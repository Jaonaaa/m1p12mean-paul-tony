import { Schema, model } from "mongoose";

const replySchema = new Schema(
  {
    description: { type: String, required: true },
    services: [{ type: Schema.Types.ObjectId, ref: "Service", required: true }],
  },
  {
    timestamps: true,
  }
);

export default model("Reply", replySchema);
