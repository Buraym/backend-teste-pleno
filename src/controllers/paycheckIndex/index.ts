import { Request, Response } from "express";
import PaycheckIndex from "../../models/PaycheckIndex";
import Paycheck from "../../models/Paycheck";
import { Op, Sequelize } from "sequelize";

export async function PaycheckIndexListing(req: Request, res: Response) {
  const { id } = req.query;
  if (id) {
    const paycheckIndex = await PaycheckIndex.findByPk(String(id));
    return res.status(200).json({ paycheckIndex });
  } else {
    const paycheckIndexes = await PaycheckIndex.findAll();
    return res.status(200).json({ paycheckIndexes });
  }
}

export async function PaycheckIndexCreation(req: Request, res: Response) {
  try {
    const { paycheck_id, position } = req.body;
    const paycheck = await Paycheck.findByPk(String(paycheck_id));
    if (!paycheck) {
      return res.status(400).json({ error: "Boleto não existe" });
    }
    const usedParams = await PaycheckIndex.findOne({
      where: {
        [Op.or]: [
          {
            position,
          },
          {
            paycheck_id,
          },
        ],
      },
    });
    if (usedParams) {
      return res.status(400).json({
        error: "Posição ou boleto já têm um index, use outros parametros",
      });
    }
    const paycheckIndex = await PaycheckIndex.create({
      paycheck_id,
      position,
    });
    return res.status(202).json({ paycheckIndex });
  } catch (err) {
    return res.status(400).json({ error: "Erro ao posicionar boleto" });
  }
}

export async function PaycheckIndexUpdate(req: Request, res: Response) {
  try {
    const { id } = req.query;
    const { paycheck_id, position } = req.body;
    const oldIndex = await PaycheckIndex.findByPk(String(id));
    if (!oldIndex) {
      return res.status(400).json({ error: "Posição do boleto não existe" });
    }
    const paycheck = await Paycheck.findByPk(String(paycheck_id));
    if (!paycheck) {
      return res.status(400).json({ error: "Boleto não existe" });
    }
    const sequelize = Paycheck.sequelize as Sequelize;

    await sequelize.transaction(async (t) => {
      const toBeFixedIndexPos = await PaycheckIndex.findOne({
        where: {
          position: {
            [Op.eq]: position,
          },
          id: { [Op.ne]: id },
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      const toBeFixedIndexPaycheck = await PaycheckIndex.findOne({
        where: {
          paycheck_id: {
            [Op.eq]: paycheck_id,
          },
          id: { [Op.ne]: id },
        },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (toBeFixedIndexPaycheck && toBeFixedIndexPos) {
        const toBeFixedPaycheck = oldIndex.paycheck_id;
        const toBeFixedPos = oldIndex.position;

        await toBeFixedIndexPos.update(
          { positon: toBeFixedPos },
          { transaction: t }
        );
        await toBeFixedIndexPaycheck.update(
          { paycheck: toBeFixedPaycheck },
          { transaction: t }
        );
      } else if (!toBeFixedIndexPos && toBeFixedIndexPaycheck) {
        const toBeFixedPaycheck = oldIndex.paycheck_id;
        await toBeFixedIndexPaycheck.update(
          { paycheck_id: toBeFixedPaycheck },
          { transaction: t }
        );
      } else if (toBeFixedIndexPos && !toBeFixedIndexPaycheck) {
        const toBeFixedPos = oldIndex.position;
        await toBeFixedIndexPos.update(
          { position: toBeFixedPos },
          { transaction: t }
        );
      }
    });

    const paycheckIndex = await PaycheckIndex.update(
      {
        paycheck_id,
        position,
      },
      {
        where: {
          id,
        },
      }
    );

    return res.status(204).json({ paycheckIndex });
  } catch (err) {
    return res
      .status(400)
      .json({ error: "Erro ao atualizar posição de boleto" });
  }
}

export async function PaycheckIndexDestroy(req: Request, res: Response) {
  try {
    const { id } = req.query;
    await PaycheckIndex.destroy({
      where: {
        id,
      },
    });
    return res.status(204);
  } catch (err) {
    return res.status(400).json({ error: "Erro ao remover posição do boleto" });
  }
}
