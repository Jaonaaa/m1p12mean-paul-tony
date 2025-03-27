import { Schema, model } from "mongoose";

const servicesDetailsInDevisSchema = new Schema({
  status: { type: String },
  begin_at: { type: Date },
  workers: [{ type: Schema.Types.ObjectId, ref: "Employe" }],
  service: { type: Schema.Types.ObjectId, ref: "Service" },
  quantity: { type: Number, default: 0 },
  finished_at: { type: Date },
  id_devis: { type: Schema.Types.ObjectId, ref: "Devis" },
});

export default model("ServicesDetailsInDevis", servicesDetailsInDevisSchema);
