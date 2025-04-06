import { Router } from "express";
import Devis from "../../../models/Devis.js";
import Response, { Status } from "../../../models/app/Response.js";

const managerStatRouter = Router();

managerStatRouter.get("/stats", async (req, res, next) => {
  try {
    // Count total devis
    const totalDevis = await Devis.countDocuments();

    // Count completed devis
    const completedDevis = await Devis.countDocuments({ status: "completed" });

    res.status(200).json(new Response("Statistiques récupérées avec succès", Status.Ok, { totalDevis, completedDevis }));
  } catch (error) {
    next(error);
  }
});

export default managerStatRouter;
