import { Schema, model } from "mongoose";

const typeVehicleSchema = new Schema({
  label: { type: String },
});

export default model("TypeVehicle", typeVehicleSchema);
