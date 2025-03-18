import { Router } from "express";
import Skill from "../../models/Skill.js";
import Response, { Status } from "../../models/app/Response.js";
import { paginate } from "../../utils/pagination.js";

const skillRouter = Router();

skillRouter.post("/", async (req, res) => {
  const skill = new Skill(req.body);
  await skill.save();
  res.status(201).json(new Response("", Status.Ok, skill));
});

skillRouter.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { data: skills, totalPages } = await paginate(Skill, page, limit);
  res.status(200).json(new Response("", Status.Ok, { skills, totalPages, page: parseInt(page), limit: parseInt(limit) }));
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
