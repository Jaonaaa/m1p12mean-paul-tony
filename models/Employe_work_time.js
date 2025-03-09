import { Schema, model } from "mongoose";

const employeWorkTimeSchema = new Schema({
  id_employe: { type: Schema.Types.ObjectId, ref: "Employe" },
  duration: { type: Number },
});

export default model("EmployeWorkTime", employeWorkTimeSchema);
