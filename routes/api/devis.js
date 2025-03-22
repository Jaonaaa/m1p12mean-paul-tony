import { Router } from "express";
import { authenticateManager } from "../../middleware/authMiddleware.js";
import Devis from "../../models/Devis.js";
import Response, { Status } from "../../models/app/Response.js";
import createDevis from "../../services/api/devis/client.js";
import { paginate } from "../../utils/pagination.js";
import { formatClientInDevis } from "../../services/api/devis/index.js";

const devisRouter = Router();

const devisPopulate = [
  {
    path: "services_details",
    populate: {
      path: "service",
    },
  },
  "id_client",
  "id_vehicle",
];
devisRouter.post("/", async (req, res, next) => {
  try {
    const newDevis = await createDevis(req.body);
    res.status(201).json(new Response("Devis créer avec succes", Status.Ok, newDevis));
  } catch (error) {
    next(error);
  }
});

devisRouter.get("/", authenticateManager, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    let { data: devis, totalPages } = await paginate(Devis, page, limit, {}, devisPopulate);
    devis = formatClientInDevis(devis);
    res.status(200).json(new Response("", Status.Ok, { devis, totalPages, page: parseInt(page), limit: parseInt(limit) }));
  } catch (error) {
    next(error);
  }
});
devisRouter.get("/client", async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { page = 1, limit = 10 } = req.query;
    let { data: devis, totalPages } = await paginate(Devis, page, limit, { id_client: _id }, devisPopulate);
    devis = formatClientInDevis(devis);
    res.status(200).json(new Response("", Status.Ok, { devis, totalPages, page: parseInt(page), limit: parseInt(limit) }));
  } catch (error) {
    next(error);
  }
});

export default devisRouter;
