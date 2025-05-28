import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';
import FoodLog from '../../models/FoodLog';

function calcularCalorias(alimentos: any[]) {
  return alimentos.reduce((total, item) => total + (item.calorias || 0), 0);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    const { data } = req.query;
    let foodlog = await FoodLog.findOne({ data });
    if (foodlog) {
    foodlog = foodlog.toObject();

    const alimentosLimpos = Array.isArray(foodlog.alimentos)
      ? foodlog.alimentos.map((a: { _doc: any; calorias: any; nome: any; quantidade: any; unidade: any; }) => {
          if (a._doc) return { ...a._doc };
          if (typeof a.calorias !== "undefined") return { ...a };
          console.log(a);
          return {
            nome: a.nome,
            quantidade: Number(a.quantidade),
            unidade: a.unidade,
            calorias: Number(a.calorias) || 0
          };
        })
      : [];

    res.status(200).json({
      data: foodlog.data,
      alimentos: alimentosLimpos,
      calorias_total: typeof foodlog.calorias_total === "number" ? foodlog.calorias_total : 0,
    });
  } else {
      return res.status(200).json({ data, alimentos: [], calorias_total: 0 });
    }
    return;
  }

  if (req.method === 'POST') {
    let { data, alimentos } = req.body;
    const calorias_total = calcularCalorias(alimentos);

    let foodlog = await FoodLog.findOne({ data });
    if (foodlog) {
      console.log(alimentos, calorias_total);
      foodlog.set({ alimentos, calorias_total });
      await foodlog.save();
    } else {
      foodlog = await FoodLog.create({ data, alimentos, calorias_total });
    }

    foodlog = foodlog.toObject();

    return res.status(200).json({
      data: foodlog.data,
      alimentos, // já vem com calorias individuais!
      calorias_total,
    });
  }

  res.status(405).json({ error: "Método não permitido" });
}
