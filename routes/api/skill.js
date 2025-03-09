import { Router } from "express";
import Skill from "../../models/Skill.js";
import Response, { Status } from "../../models/app/Response.js";

const skillRouter = Router();

skillRouter.post("/", async (req, res) => {
  const skill = new Skill(req.body);
  await skill.save();
  res.status(201).json(new Response("", Status.Ok, skill));
});

skillRouter.get("/", async (req, res) => {
  const skills = await Skill.find();
  res.status(200).json(new Response("", Status.Ok, skills));
});

skillRouter.put("/:id", async (req, res) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(201).json(new Response("", Status.Ok, skill));
});

skillRouter.delete("/:id", async (req, res) => {
  await Skill.findByIdAndDelete(req.params.id);
  res.status(201).json(new Response("Skill supprimé", Status.Ok));
});

export const findSkill = async (label) => {
  return await Skill.findOne({ label: label }).select("label");
};

export default skillRouter;
