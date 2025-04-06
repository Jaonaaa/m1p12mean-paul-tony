import { Router } from "express";
import ServicesDetailsInDevis from "../../../models/Services_details_in_devis.js";
import Response, { Status } from "../../../models/app/Response.js";

const mechanicStatRouter = Router();

mechanicStatRouter.get("/stats", async (req, res, next) => {
  try {
    const { _id } = req.user;

    // Count tasks assigned to the mechanic
    const totalTasks = await ServicesDetailsInDevis.countDocuments({ workers: _id });

    // Count completed tasks
    const completedTasks = await ServicesDetailsInDevis.countDocuments({ workers: _id, status: "completed" });

    res.status(200).json(new Response("Statistiques récupérées avec succès", Status.Ok, { totalTasks, completedTasks }));
  } catch (error) {
    next(error);
  }
});

export default mechanicStatRouter;
