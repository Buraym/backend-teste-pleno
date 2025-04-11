import { generatePaycheckReport, parseCSV } from "../../utils";
import { Request, Response } from "express";
import { Op } from "sequelize";
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import Paycheck from "../../models/Paycheck";
import Spot from "../../models/Spot";
import PaycheckIndex from "../../models/PaycheckIndex";

export async function PaycheckListing(req: Request, res: Response) {
  const { nome, valor_inicial, valor_final, id_lote, relatorio, id_boleto } =
    req.query;
  let paychecks = [];
  if (id_boleto) {
    const paycheck = await Paycheck.findByPk(String(id_boleto));
    paychecks = [paycheck];
  } else if (!nome && !valor_inicial && !valor_final && !id_lote) {
    paychecks = await Paycheck.findAll();
  } else {
    let conditions = {
      active: {
        [Op.eq]: true,
      },
    };
    if (nome) {
      // @ts-ignore
      conditions.name = {
        [Op.like]: `%${nome}%`,
      };
    }
    if (valor_inicial || valor_final) {
      // @ts-ignore
      conditions.value = {
        [Op.between]: [
          valor_inicial ? valor_inicial : 0,
          valor_final ? valor_final : null,
        ],
      };
    }
    if (id_lote) {
      // @ts-ignore
      conditions.spot_id = {
        [Op.eq]: id_lote,
      };
    }
    paychecks = await Paycheck.findAll({
      where: conditions,
    });
  }
  if (relatorio) {
    const base64String = await generatePaycheckReport(
      paychecks,
      [
        { title: "Nome sacado", name: "nome", val: nome },
        { title: "Valor mínimo", name: "valor_inicial", val: valor_inicial },
        { title: "Valor final", name: "valor_final", val: valor_final },
        { title: "Número do lote", name: "id_lote", val: id_lote },
      ].filter((row) => row.val !== undefined)
    );
    return res.json(base64String);
  } else {
    return res.json(paychecks);
  }
}

export async function PaycheckCreation(req: Request, res: Response) {
  try {
    const { name, value, spot_id, code } = req.body;
    const paycheck = await Paycheck.create({
      name,
      value,
      spot_id,
      code,
      active: true,
    });
    return res.status(202).json({ paycheck });
  } catch (err) {
    return res.status(400).json({ error: "Erro ao cadastrar boleto" });
  }
}

export async function PaycheckUpdate(req: Request, res: Response) {
  try {
    const { id } = req.query;
    const { name, value, spot_id, active, code } = req.body;
    const paycheck = await Paycheck.update(
      {
        name,
        value,
        spot_id,
        code,
        active,
      },
      {
        where: {
          id,
        },
      }
    );
    return res.status(204).json({ paycheck });
  } catch (err) {
    return res.status(400).json({ error: "Erro ao atualizar boleto" });
  }
}

export async function PaycheckDestroy(req: Request, res: Response) {
  try {
    const { id } = req.query;
    await Paycheck.destroy({
      where: {
        id,
      },
    });
    return res.status(204);
  } catch (err) {
    return res.status(400).json({ error: "Erro ao deletar boleto" });
  }
}

export async function PaycheckCSVImport(req: Request, res: Response) {
  const file = req.file as Express.Multer.File;

  if (!file) {
    return res.status(400).json({ error: "Nenhum arquivo enviado" });
  }

  const csvData = await parseCSV(file.path, ";");
  fs.unlinkSync(file.path);

  // @ts-ignore
  const spots: Spot[] = await Spot.findAll({
    attributes: ["id", "name"],
    where: {
      name: {
        [Op.in]: csvData.map((row) => row.unidade),
      },
      active: true,
    },
  });

  const paychecksToBeCreated = csvData
    .filter((row) => spots.map((spot) => spot.name).includes(row.unidade))
    .map((row) => ({
      name: row.nome,
      spot_id: spots.find((spot) => spot.name! === row.unidade)!.id,
      value: row.valor,
      code: row.linha_digitavel,
      active: true,
    }));

  const paychecks = await Paycheck.bulkCreate(paychecksToBeCreated);

  return res.json(paychecks);
}

export async function PaycheckPDFImport(req: Request, res: Response) {
  const file = req.file as Express.Multer.File;

  const existingPdfBytes = fs.readFileSync(file.path);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const totalPages = pdfDoc.getPageCount();

  for (let i = 0; i < totalPages; i++) {
    const index = await PaycheckIndex.findOne({
      where: {
        position: {
          [Op.eq]: i,
        },
      },
    });

    if (index) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(page);

      const pdfBytes = await newPdf.save();
      fs.writeFileSync(
        // @ts-ignore
        path.join("uploads/", `${index.paycheck_id}.pdf`),
        pdfBytes
      );
    } else {
      return res
        .status(400)
        .json({ error: "Nenhum index encontrado para esta posição" });
    }
  }

  fs.unlinkSync(file.path);
  const indexes = await PaycheckIndex.findAll();

  return res.json("FOI SEPARADO NOS ARQUIVOS");
}
