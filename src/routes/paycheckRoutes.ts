import express, { Request, Response } from "express";
import Paycheck from "../models/Paycheck";
import multer from "multer";
import fs from "fs";
import Spot from "../models/Spot";
import { Op } from "sequelize";
import { parseCSV } from "../utils";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

async function PaycheckCSVImport(req: Request, res: Response) {
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

// @ts-ignore
router.post("/paycheck-import", upload.single("file"), PaycheckCSVImport);

export default router;
