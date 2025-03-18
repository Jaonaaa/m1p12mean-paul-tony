import { Router } from "express";
import Service from "../../models/Service.js";
import Response, { Status } from "../../models/app/Response.js";
import { insertService } from "../../services/api/service/index.js";
import { paginate } from "../../utils/pagination.js";

const serviceRouter = Router();

const MESSAGES = {
  SERVICE_CREATED: "Service créé avec succès",
  SERVICE_UPDATED: "Service mis à jour avec succès",
  SERVICE_DELETED: "Service supprimé",
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

serviceRouter.get("/", async (req, res) => {
  const services = await Service.find();
  res.status(200).json(new Response("", Status.Ok, services));
});

serviceRouter.put("/:id", async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(201).json(new Response(MESSAGES.SERVICE_UPDATED, Status.Ok, service));
});

serviceRouter.delete("/:id", async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.status(201).json(new Response(MESSAGES.SERVICE_DELETED, Status.Ok));
});

export const findService = async (label) => {
  return await Service.findOne({ label: label }).select("label");
};

export default serviceRouter;
