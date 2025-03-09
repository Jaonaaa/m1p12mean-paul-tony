import { Schema, model } from "mongoose";

const workSchema = new Schema({
  id_devis: { type: Schema.Types.ObjectId, ref: "Devis" },
  begin_at: { type: Date },
  expected_end: { type: Date },
  progress: { type: Number },
});

export default model("Work", workSchema);
