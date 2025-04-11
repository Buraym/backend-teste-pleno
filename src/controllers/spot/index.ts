import { Request, Response } from "express";
import Spot from "../../models/Spot";

export async function SpotListing(req: Request, res: Response) {
  const { id } = req.query;
  if (id) {
    const spot = await Spot.findByPk(String(id));
    return res.status(200).json({ spot });
  } else {
    const spots = await Spot.findAll();
    return res.status(200).json({ spots });
  }
}

export async function SpotCreation(req: Request, res: Response) {
  try {
    const { name, active } = req.body;
    const spot = await Spot.create({
      name,
      active,
    });
    return res.status(202).json({ spot });
  } catch (err) {
    return res.status(400).json({ error: "Erro ao cadastrar lote" });
  }
}

export async function SpotUpdate(req: Request, res: Response) {
  try {
    const { id } = req.query;
    const { name, active } = req.body;
    const spot = await Spot.update(
      {
        name,
        active,
      },
      {
        where: {
          id,
        },
      }
    );
    return res.status(204).json({ spot });
  } catch (err) {
    return res.status(400).json({ error: "Erro ao atualizar lote" });
  }
}

export async function SpotDestroy(req: Request, res: Response) {
  try {
    const { id } = req.query;
    await Spot.destroy({
      where: {
        id,
      },
    });
    return res.status(204);
  } catch (err) {
    return res.status(400).json({ error: "Erro ao deletar lote" });
  }
}
