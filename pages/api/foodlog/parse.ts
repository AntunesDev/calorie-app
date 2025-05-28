import type { NextApiRequest, NextApiResponse } from "next";
import { analyzeFoodWithGemini } from "@/lib/ai-gemini";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Campo obrigatório" });

  try {
    const aiResult = await analyzeFoodWithGemini(prompt);

    if (!aiResult || !aiResult.nome || !aiResult.calorias) {
      return res.status(422).json({ error: "Não foi possível identificar o alimento." });
    }

    return res.status(200).json({ item: aiResult });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Falha ao consultar a IA." });
  }
}
