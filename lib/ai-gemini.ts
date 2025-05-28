import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeFoodWithGemini(prompt: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const fullPrompt = `
Você é um nutricionista. Sua tarefa é analisar a entrada do usuário (sobre alimentos consumidos) e retornar apenas um JSON válido, com os campos: nome, quantidade, unidade, calorias. Retorne apenas o objeto JSON correspondente ao alimento descrito.

Exemplo de entrada: "2 ovos cozidos"
Exemplo de resposta: { "nome": "ovo cozido", "quantidade": 2, "unidade": "unidade", "calorias": 156 }

Se a quantidade não estiver explícita, tente inferir. Se não souber, estime porção padrão.

Alimento: ${prompt}
Resposta:
  `;

  const result = await model.generateContent(fullPrompt);
  const response = await result.response.text();

  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Resposta da IA não pôde ser convertida em JSON.");

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error("Resposta da IA inválida.");
  }
}
