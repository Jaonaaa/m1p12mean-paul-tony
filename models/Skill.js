import { Schema, model } from "mongoose";

const skillSchema = new Schema({
  label: { type: String },
});

export default model("Skill", skillSchema);
