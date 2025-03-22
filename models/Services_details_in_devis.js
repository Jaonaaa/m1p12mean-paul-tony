import { Schema, model } from "mongoose";

const servicesDetailsInDevisSchema = new Schema({
  status: { type: String },
  begin_at: { type: Date },
  workers: [{ type: Schema.Types.ObjectId, ref: "EmployeWorkTime" }],
  service: { type: Schema.Types.ObjectId, ref: "Service" },
});

export default model("ServicesDetailsInDevis", servicesDetailsInDevisSchema);
