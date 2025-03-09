import mongoose from "mongoose";

const employeSchema = new mongoose.Schema({
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  entered_at: { type: Date },
  salary: { type: Number },
});

export default mongoose.model("Employe", employeSchema);
