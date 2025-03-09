import { Router } from "express";
import Role from "../../models/Role.js";
import Response, { Status } from "../../models/app/Response.js";
const roleRouter = Router();

roleRouter.post("/", async (req, res) => {
  const role = new Role(req.body);
  await role.save();
  res.status(201).json(new Response("", Status.Ok, role));
});

roleRouter.get("/", async (req, res) => {
  const roles = await Role.find();
  res.status(200).json(new Response("", Status.Ok, roles));
});

roleRouter.put("/:id", async (req, res) => {
  const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(201).json(new Response("", Status.Ok, role));
});

roleRouter.delete("/:id", async (req, res) => {
  await Role.findByIdAndDelete(req.params.id);
  res.status(201).json(new Response("Role supprimé", Status.Ok));
});

export const findRole = async (label) => {
  return await Role.findOne({ label: label }).select("label");
};

export default roleRouter;
