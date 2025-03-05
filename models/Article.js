import { Schema, Types, model } from "mongoose";

const ArticleSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    categorie: { type: Types.ObjectId, ref: "Categorie", required: true },
  },
  { timestamps: true }
);

export default model("Article", ArticleSchema);
