import { Schema, model } from "mongoose";

const RoleSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Role = model("Role", RoleSchema);

export const ROLES = {
  MANAGER: "manager",
  CLIENT: "client",
  MECANICIEN: "mechanic",
};

export default Role;
