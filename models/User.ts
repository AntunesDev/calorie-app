// models/User.ts
import mongoose, { Schema, models, model } from 'mongoose';

const UserSchema = new Schema({
  sexo: { type: String, enum: ['Masculino', 'Feminino'], required: true },
  idade: { type: Number, required: true },
  peso: { type: Number, required: true },
  altura: { type: Number, required: true },
  exercicio_horas: { type: Number, required: true },
  tmb: { type: Number },         // Taxa metabólica basal
  calorias_manutencao: { type: Number },
  deficit: { type: Number },     // Valor sugerido para emagrecer
});

export default models.User || model('User', UserSchema);
