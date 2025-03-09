import { Schema, model } from "mongoose";

const devisSchema = new Schema({
  services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
  id_client: { type: Schema.Types.ObjectId, ref: "User" },
  price_total: { type: Number },
  created_at: { type: Date },
  status: { type: String },
});

export default model("Devis", devisSchema);
