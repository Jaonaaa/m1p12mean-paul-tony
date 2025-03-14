import { Router } from "express";
import Employe from "../../models/Employe.js";
import Response, { Status } from "../../models/app/Response.js";
import { getEmployeSkills } from "../../services/api/employe/index.js";
import { authenticateManager, authenticateManagerAndMechanic, authenticateMechanic } from "../../middleware/authMiddleware.js";
import MyError from "../../models/app/MyError.js";
import Skill from "../../models/Skill.js";
import { paginate } from "../../utils/pagination.js";

const employeRouter = Router();

const MESSAGES = {
  EMPLOYE_DELETED: "Employé supprimé",
  SKILLS_UPDATED: "Compétences mises à jour",
  SKILLS_REQUIRED: "Compétences requises",
};

employeRouter.get("/", authenticateManager, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { data: employes, totalPages } = await paginate(Employe, page, limit, {}, "id_user");
  res.status(200).json(new Response("", Status.Ok, { employes, totalPages, page: parseInt(page), limit: parseInt(limit) }));
});

employeRouter.get("/:id", authenticateManagerAndMechanic, async (req, res) => {
  const { id } = req.params;
  const employe = await Employe.findById(id).populate("id_user");
  const skills = await Skill.find();
  res.status(200).json(new Response("", Status.Ok, { employe, all_skills: skills }));
});

employeRouter.get("/skills", authenticateMechanic, async (req, res, next) => {
  try {
    const { _id } = req.user;
    const skills = await getEmployeSkills({ userId: _id });
    res.status(200).json(new Response("", Status.Ok, skills));
  } catch (error) {
    next(error);
  }
});

employeRouter.put("/skills", authenticateMechanic, async (req, res, next) => {
  try {
    const { id_employe } = req.body;
    if (!req.body.skills) throw new MyError(MESSAGES.SKILLS_REQUIRED, 400);
    const employe = await Employe.findById(id_employe);
    employe.skills = req.body.skills; // Update skills
    await employe.save();
    res.status(200).json(new Response(MESSAGES.SKILLS_UPDATED, Status.Ok, employe));
  } catch (error) {
    next(error);
  }
});

employeRouter.delete("/:id", async (req, res) => {
  await Employe.findByIdAndDelete(req.params.id);
  res.status(201).json(new Response(MESSAGES.EMPLOYE_DELETED, Status.Ok));
});

export default employeRouter;
