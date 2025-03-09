import { Schema, model } from "mongoose";

const servicesDetailsInDevisSchema = new Schema({
  status: { type: String },
  begin_at: { type: Date },
  workers: [{ type: Schema.Types.ObjectId, ref: "EmployeWorkTime" }],
});

export default model("ServicesDetailsInDevis", servicesDetailsInDevisSchema);
