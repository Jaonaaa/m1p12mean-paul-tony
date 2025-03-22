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
});

export const STATUS_DEVIS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REFUSED: "rejected",
  IN_PROGRESS: "in_progress",
  PAUSED: "paused",
  COMPLETED: "completed",
  CANCELED: "canceled",
  WAITING_FOR_REVIEW: "waiting_for_review",
};

export default model("Devis", devisSchema);
