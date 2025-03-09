import { Schema, model } from "mongoose";

const serviceSchema = new Schema({
  label: { type: String, required: true },
  price: { type: Number, default: 0 },
  default_duration: { type: Number },
});

export default model("Service", serviceSchema);
