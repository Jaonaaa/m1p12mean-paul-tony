import { Schema, model } from "mongoose";

const brandVehicleSchema = new Schema({
  label: { type: String },
});

export default model("BrandVehicle", brandVehicleSchema);
