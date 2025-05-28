import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';
import User from '../../models/User';

type DadosTMB = {
  sexo: string;
  peso: number;
  altura: number;
  idade: number;
};

function calcularTMB({ sexo, peso, altura, idade }: DadosTMB): number {
  // Fórmula de Harris-Benedict (simplificada)
  if (sexo === 'Masculino') {
    return 88.36 + (13.4 * peso) + (4.8 * altura) - (5.7 * idade);
  } else {
    return 447.6 + (9.2 * peso) + (3.1 * altura) - (4.3 * idade);
  }
}

function calcularCaloriasManutencao(tmb: number, exercicio_horas: number) {
  // Multiplicador de atividade física (leve, moderado, intenso)
  let fator = 1.375; // Exercício leve
  if (exercicio_horas >= 2) fator = 1.55; // Moderado
  if (exercicio_horas >= 4) fator = 1.725; // Intenso
  return tmb * fator;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    const { sexo, idade, peso, altura, exercicio_horas } = req.body;

    // Calcular TMB e manutenção
    const tmb = calcularTMB({ sexo, peso, altura, idade });
    const manutencao = calcularCaloriasManutencao(tmb, exercicio_horas);

    // Sugerir déficit de 1500kcal
    const deficit = manutencao - 1500;

    // Criar ou atualizar perfil (por simplicidade, 1 usuário só)
    let user = await User.findOne();
    if (user) {
      user.set({ sexo, idade, peso, altura, exercicio_horas, tmb, calorias_manutencao: manutencao, deficit });
      await user.save();
    } else {
      user = await User.create({ sexo, idade, peso, altura, exercicio_horas, tmb, calorias_manutencao: manutencao, deficit });
    }
    res.status(200).json(user);
  }

  if (req.method === 'GET') {
    const user = await User.findOne();
    if (!user) return res.status(404).json({ error: 'Perfil não cadastrado' });
    res.status(200).json(user);
  }
}
