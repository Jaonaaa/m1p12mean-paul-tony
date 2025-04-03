import { Schema, model } from "mongoose";

const devisSchema = new Schema({
  services_details: [{ type: Schema.Types.ObjectId, ref: "ServicesDetailsInDevis" }],
  id_client: { type: Schema.Types.ObjectId, ref: "User" },
  price_total: { type: Number },
  created_at: { type: Date },
  status: { type: String },
  id_vehicle: { type: Schema.Types.ObjectId, ref: "ClientVehicle" },
  label: { type: String, required: true },
  expected_duration: { type: Number },
  replies: [{ type: Schema.Types.ObjectId, ref: "Reply" }],
  payed: { type: Number, default: 0 },
  details: { type: Object },
});

export const STATUS_DEVIS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

export default model("Devis", devisSchema);
