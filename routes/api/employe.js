import { Router } from "express";
import Employe from "../../models/Employe.js";
import Response, { Status } from "../../models/app/Response.js";
import { getEmployeSkills } from "../../services/api/employe/index.js";
import { authenticateManager, authenticateMechanic } from "../../middleware/authMiddleware.js";

const employeRouter = Router();

employeRouter.get("/", authenticateManager, async (req, res) => {
  const employes = await Employe.find();
  res.status(200).json(new Response("", Status.Ok, employes));
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

employeRouter.put("/:id", async (req, res) => {
  const employe = await Employe.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(201).json(new Response("", Status.Ok, employe));
});

employeRouter.delete("/:id", async (req, res) => {
  await Employe.findByIdAndDelete(req.params.id);
  res.status(201).json(new Response("Employe supprimé", Status.Ok));
});

export default employeRouter;
