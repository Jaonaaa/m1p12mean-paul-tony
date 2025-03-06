import { Router } from "express";
import Role from "../../models/Role.js";
var roleRouter = Router();

roleRouter.post("/", async (req, res) => {
  const role = new Role(req.body);
  await role.save();
  res.status(201).json(role);
});

roleRouter.get("/", async (req, res) => {
  const roles = await Role.find();
  res.json(roles);
});

roleRouter.put("/:id", async (req, res) => {
  const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(role);
});

roleRouter.delete("/:id", async (req, res) => {
  await Role.findByIdAndDelete(req.params.id);
  res.json({ message: "Role supprimé" });
});

export const findRole = async (label) => {
  return await Role.findOne({ label: label });
};

export default roleRouter;
