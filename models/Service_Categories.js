import { Schema, model } from "mongoose";

const serviceCategoriesSchema = new Schema({
  label: { type: String, required: true },
});

export default model("ServiceCategories", serviceCategoriesSchema);
