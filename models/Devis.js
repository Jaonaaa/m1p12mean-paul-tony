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
  payed: { type: Number, default: 0 },
});

export const STATUS_DEVIS = {
  PENDING: "pending",
  REFUSED: "rejected",
  IN_PROGRESS: "in_progress",
  PAUSED: "paused",
  COMPLETED: "completed",
  CANCELED: "canceled",
};

export default model("Devis", devisSchema);
