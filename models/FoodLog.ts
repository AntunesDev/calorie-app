import mongoose, { Schema, models, model } from 'mongoose';

const FoodItemSchema = new Schema({
  nome: { type: String, required: true },
  quantidade: { type: Number, required: true }, // Em gramas ou unidade
  unidade: { type: String, required: true },    // "g", "ml", "un"
  calorias: { type: Number, required: true },
}, { _id: false });

const FoodLogSchema = new Schema({
  data: { type: String, required: true },      // yyyy-mm-dd
  alimentos: [FoodItemSchema],
  calorias_total: { type: Number, default: 0 }
});

export default models.FoodLog || model('FoodLog', FoodLogSchema);
