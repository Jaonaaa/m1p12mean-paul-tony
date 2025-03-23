import { Router } from "express";
import Work from "../../../models/Work.js";
import Response, { Status } from "../../../models/app/Response.js";
import { authenticateManager } from "../../../middleware/authMiddleware.js";
import { paginate } from "../../../utils/pagination.js";

const workRouter = Router();

const workPopulate = [
  {
    path: "id_devis",
    populate: [
      {
        path: "id_vehicle",
      },
      {
        path: "services_details",
      },
    ],
  },
];

workRouter.get("/", authenticateManager, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { data: works, totalPages } = await paginate(Work, page, limit, {}, workPopulate);
    res.status(200).json(new Response("", Status.Ok, { works, totalPages, page: parseInt(page), limit: parseInt(limit) }));
  } catch (error) {
    next(error);
  }
});

export default workRouter;
