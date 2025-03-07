import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    picture: {
      type: String,
      default: "eb99a2736e6237c3668de38bbe3eec32_qowqzj",
    },
  },
  { timestamps: true }
);

const User = model("User", UserSchema);

export default User;
