import { Schema, model } from "mongoose";

const employeSchema = new Schema({
  id_user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  entered_at: { type: Date },
  salary: { type: Number },
  skills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
});

export default model("Employe", employeSchema);
