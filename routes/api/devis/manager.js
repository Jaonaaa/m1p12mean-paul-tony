import { Router } from "express";
import { authenticateManager, authenticateManagerAndMechanic } from "../../../middleware/authMiddleware.js";
import Devis, { STATUS_DEVIS } from "../../../models/Devis.js";
import Response, { Status } from "../../../models/app/Response.js";
import { formatClientInDevis, confirmDevis, getDetailsDevis } from "../../../services/api/devis/index.js";
import { paginate } from "../../../utils/pagination.js";
import MyError from "../../../models/app/MyError.js";
import { assignTask } from "../../../services/api/devis/service_details.js";

const devisManagerRouter = Router();

const MESSAGES = {
  INVALID_DATA: "Les données envoyées sont invalides.",
  STARTED_DEVIS: "Devis commencé!",
  TASK_ASSIGNED: "Tache assigné!",
};

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

const fetchDevisOn = async (req, status) => {
  const { page = 1, limit = 10 } = req.query;
  let { data: devis, totalPages } = await paginate(
    Devis,
    page,
    limit,
    {
      status: status,
    },
    devisPopulate
  );
  devis = formatClientInDevis(devis);
  return { devis, totalPages, page, limit };
};

/// MANAGER
devisManagerRouter.get("/", authenticateManager, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    let { data: devis, totalPages } = await paginate(Devis, page, limit, {}, devisPopulate);
    devis = formatClientInDevis(devis);
    devis = await getDetailsDevis(devis);
    res.status(200).json(new Response("", Status.Ok, { devis, totalPages, page: parseInt(page), limit: parseInt(limit) }));
  } catch (error) {
    next(error);
  }
});

devisManagerRouter.get("/created", authenticateManager, async (req, res, next) => {
  try {
    let { devis, limit, page, totalPages } = await fetchDevisOn(req, STATUS_DEVIS.PENDING);
    devis = await getDetailsDevis(devis);
    res.status(200).json(new Response("", Status.Ok, { devis, totalPages, page: parseInt(page), limit: parseInt(limit) }));
  } catch (error) {
    next(error);
  }
});

devisManagerRouter.get("/accept", authenticateManagerAndMechanic, async (req, res, next) => {
  try {
    let { devis, limit, page, totalPages } = await fetchDevisOn(req, STATUS_DEVIS.ACCEPTED);
    devis = await getDetailsDevis(devis);
    res.status(200).json(new Response("", Status.Ok, { devis, totalPages, page: parseInt(page), limit: parseInt(limit) }));
  } catch (error) {
    next(error);
  }
});

devisManagerRouter.get("/started", authenticateManagerAndMechanic, async (req, res, next) => {
  try {
    let { devis, limit, page, totalPages } = await fetchDevisOn(req, STATUS_DEVIS.IN_PROGRESS);
    devis = await getDetailsDevis(devis);
    res.status(200).json(new Response("", Status.Ok, { devis, totalPages, page: parseInt(page), limit: parseInt(limit) }));
  } catch (error) {
    next(error);
  }
});

devisManagerRouter.get("/completed", authenticateManager, async (req, res, next) => {
  try {
    let { devis, limit, page, totalPages } = await fetchDevisOn(req, STATUS_DEVIS.COMPLETED);
    devis = formatClientInDevis(devis);
    devis = await getDetailsDevis(devis);
    res.status(200).json(new Response("", Status.Ok, { devis, totalPages, page: parseInt(page), limit: parseInt(limit) }));
  } catch (error) {
    next(error);
  }
});

/// ACTION

devisManagerRouter.put("/on/confirm", authenticateManager, async (req, res, next) => {
  try {
    const { id_devis, begin_at } = req.body;
    if (!id_devis || !begin_at) throw new MyError(MESSAGES.INVALID_DATA);

    await confirmDevis(id_devis, begin_at);
    res.status(200).json(new Response(MESSAGES.STARTED_DEVIS, Status.Ok));
  } catch (error) {
    next(error);
  }
});

devisManagerRouter.put("/service/assign", authenticateManager, async (req, res, next) => {
  try {
    const { id_service_details, workers } = req.body;
    if (!id_service_details || !workers) throw new MyError(MESSAGES.INVALID_DATA);
    await assignTask(id_service_details, workers);
    res.status(200).json(new Response(MESSAGES.TASK_ASSIGNED, Status.Ok));
  } catch (error) {
    next(error);
  }
});

export default devisManagerRouter;
