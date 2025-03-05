import { model, Schema } from "mongoose";

const CategorieSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default model("Categorie", CategorieSchema);
