import { Router } from "express";
import Service from "../../models/Service.js";
import Response, { Status } from "../../models/app/Response.js";
import { insertService } from "../../services/api/service/index.js";
import { paginate } from "../../utils/pagination.js";
import MyError from "../../models/app/MyError.js";

const serviceRouter = Router();

const MESSAGES = {
  SERVICE_CREATED: "Service créé avec succès",
  SERVICE_UPDATED: "Service mis à jour avec succès",
  SERVICE_DELETED: "Service supprimé",
  ID_NOT_FOUND: "ID introuvable",
  SKILLS_REQUIRED: "Compétences requises",
};

serviceRouter.post("/", async (req, res, next) => {
  try {
    const serviceData = req.body;
    const newService = await insertService(serviceData);
    res.status(201).json(new Response(MESSAGES.SERVICE_CREATED, Status.Ok, newService));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

serviceRouter.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { data: services, totalPages } = await paginate(Service, page, limit, {}, ["required_skills", "category"]);
    res.status(200).json(new Response("", Status.Ok, { services, totalPages, page: parseInt(page), limit: parseInt(limit) }));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

serviceRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new MyError(MESSAGES.ID_NOT_FOUND, 400);
    const service = await Service.findById(id).populate(["required_skills", "category"]);
    res.status(200).json(new Response("", Status.Ok, service));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

serviceRouter.put("/:id/skills", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { skills } = req.body;

    if (!skills) throw new MyError(MESSAGES.SKILLS_REQUIRED, 400);
    const service = await Service.findById(id);
    service.required_skills = skills; // Update skills
    let updatedSkills = await service.save();
    updatedSkills = await updatedSkills.populate("required_skills");
    res.status(201).json(new Response(MESSAGES.SERVICE_UPDATED, Status.Ok, updatedSkills));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

serviceRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new MyError(MESSAGES.ID_NOT_FOUND, 400);
    await Service.findByIdAndDelete(id);
    res.status(201).json(new Response(MESSAGES.SERVICE_DELETED, Status.Ok));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

export const findService = async (label) => {
  return await Service.findOne({ label }).select("label");
};

export default serviceRouter;
