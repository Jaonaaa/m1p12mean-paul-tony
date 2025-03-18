import { Schema, model } from "mongoose";

const clientVehicleSchema = new Schema({
  id_type_vehicle: { type: Schema.Types.ObjectId, ref: "TypeVehicle" },
  id_brand_vehicle: { type: Schema.Types.ObjectId, ref: "BrandVehicle" },
  id_client: { type: Schema.Types.ObjectId, ref: "User" },
  registration_number: { type: String },
  year: { type: Number },
});

export default model("ClientVehicle", clientVehicleSchema);
