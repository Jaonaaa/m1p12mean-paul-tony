import { Router } from "express";
import { authenticateManager } from "../../../middleware/authMiddleware.js";
import Devis, { STATUS_DEVIS } from "../../../models/Devis.js";
import Response, { Status } from "../../../models/app/Response.js";
import { formatClientInDevis, startDevis } from "../../../services/api/devis/index.js";
import { paginate } from "../../../utils/pagination.js";
import MyError from "../../../models/app/MyError.js";

const devisManagerRouter = Router();

const MESSAGES = {
  INVALID_DATA: "Les données envoyées sont invalides.",
  STARTED_DEVIS: "Devis commencé!",
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

/// MANAGER
devisManagerRouter.get("/", authenticateManager, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    let { data: devis, totalPages } = await paginate(Devis, page, limit, {}, devisPopulate);
    devis = formatClientInDevis(devis);
    res.status(200).json(new Response("", Status.Ok, { devis, totalPages, page: parseInt(page), limit: parseInt(limit) }));
  } catch (error) {
    next(error);
  }
});

devisManagerRouter.get("/created", authenticateManager, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    let { data: devis, totalPages } = await paginate(
      Devis,
      page,
      limit,
      {
        status: STATUS_DEVIS.PENDING,
      },
      devisPopulate
    );
    devis = formatClientInDevis(devis);
    res.status(200).json(new Response("", Status.Ok, { devis, totalPages, page: parseInt(page), limit: parseInt(limit) }));
  } catch (error) {
    next(error);
  }
});

devisManagerRouter.get("/started", authenticateManager, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    let { data: devis, totalPages } = await paginate(
      Devis,
      page,
      limit,
      {
        status: STATUS_DEVIS.IN_PROGRESS,
      },
      devisPopulate
    );
    devis = formatClientInDevis(devis);
    res.status(200).json(new Response("", Status.Ok, { devis, totalPages, page: parseInt(page), limit: parseInt(limit) }));
  } catch (error) {
    next(error);
  }
});

devisManagerRouter.get("/completed", authenticateManager, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    let { data: devis, totalPages } = await paginate(
      Devis,
      page,
      limit,
      {
        status: STATUS_DEVIS.COMPLETED,
      },
      devisPopulate
    );
    devis = formatClientInDevis(devis);
    res.status(200).json(new Response("", Status.Ok, { devis, totalPages, page: parseInt(page), limit: parseInt(limit) }));
  } catch (error) {
    next(error);
  }
});

devisManagerRouter.put("/on/start", authenticateManager, async (req, res, next) => {
  try {
    const { id_devis, begin_at } = req.body;
    if (!id_devis || !begin_at) throw new MyError(MESSAGES.INVALID_DATA);

    await startDevis(id_devis, begin_at);
    res.status(200).json(new Response(MESSAGES.STARTED_DEVIS, Status.Ok));
  } catch (error) {
    next(error);
  }
});

export default devisManagerRouter;
