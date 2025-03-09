import { Schema, model } from "mongoose";

const serviceSchema = new Schema({
  label: { type: String, required: true },
  price: { type: Number, default: 0 },
  default_duration: { type: Number },
  description: { type: String },
  required_skills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
});

export default model("Service", serviceSchema);
