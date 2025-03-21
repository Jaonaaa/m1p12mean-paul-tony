import { Router } from "express";
import Devis from "../../models/Devis.js";
import Response, { Status } from "../../models/app/Response.js";
import createDevis from "../../services/api/devis/client.js";

const devisRouter = Router();

devisRouter.post("/", async (req, res, next) => {
  try {
    const newDevis = await createDevis(req.body);
    res.status(201).json(new Response("Devis créer avec succes", Status.Ok, newDevis));
  } catch (error) {
    next(error);
  }
});

devisRouter.get("/", async (req, res, next) => {
  try {
    const devis = await Devis.find();
    res.status(200).json(new Response("", Status.Ok, devis));
  } catch (error) {
    next(error);
  }
});

export default devisRouter;
