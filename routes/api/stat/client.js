import { Router } from "express";
import Devis from "../../../models/Devis.js";
import Response, { Status } from "../../../models/app/Response.js";

const clientStatRouter = Router();

clientStatRouter.get("/stats", async (req, res, next) => {
  try {
    const { _id } = req.user;

    // Count total devis for the client
    const totalDevis = await Devis.countDocuments({ id_client: _id });

    // Count completed devis for the client
    const completedDevis = await Devis.countDocuments({ id_client: _id, status: "completed" });

    res.status(200).json(new Response("Statistiques récupérées avec succès", Status.Ok, { totalDevis, completedDevis }));
  } catch (error) {
    next(error);
  }
});

export default clientStatRouter;
