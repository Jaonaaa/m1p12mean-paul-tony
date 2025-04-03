import { Router } from "express";
import Devis from "../../../models/Devis.js";
import Response, { Status } from "../../../models/app/Response.js";
import createDevis from "../../../services/api/devis/client.js";
import { paginate } from "../../../utils/pagination.js";
import { formatClientInDevis } from "../../../services/api/devis/index.js";
import { devisPopulate, devisPopulateAll } from "./utils.js";
import Work from "../../../models/Work.js";
import MyError from "../../../models/app/MyError.js";
import { formatUser } from "../../../services/auth/user.js";

const devisClientRouter = Router();

const MESSAGES = {
  DEVIS_CREATED: "Devis créé avec succès",
  DEVIS_UPDATED: "Devis mis à jour avec succès",
  DEVIS_NOT_FOUND: "Devis introuvable",
};

// CLIENT
devisClientRouter.post("/", async (req, res, next) => {
  try {
    const newDevis = await createDevis(req.body);
    res.status(201).json(new Response(MESSAGES.DEVIS_CREATED, Status.Ok, newDevis));
  } catch (error) {
    next(error);
  }
});

devisClientRouter.get("/details/:id_devis", async (req, res, next) => {
  try {
    const { id_devis } = req.params;

    let devis = await Devis.findById(id_devis).populate(devisPopulateAll);
    if (!devis) throw new MyError(MESSAGES.DEVIS_NOT_FOUND, 404);
    if (devis.services_details.length > 0) console.log(devis.services_details[0].workers);
    devis.services_details = devis.services_details.map((service) =>
      service.workers.map((worker) => {
        worker.id_user = formatUser(worker.id_user);
        return worker;
      })
    );
    console.log("====================================");
    if (devis.services_details.length > 0) console.log(devis.services_details[0].workers);
    console.log("====================================");
    let work = await Work.findOne({ id_devis: devis._id });
    if (devis.services_details.length > 0) console.log(devis.services_details[0].workers);
    console.log(devis.services_details.workers);
    res.status(200).json(new Response("", Status.Ok, { devis: devis, detail: work }));
  } catch (error) {
    next(error);
  }
});

devisClientRouter.get("/client", async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { page = 1, limit = 10 } = req.query;
    let { data: devis, totalPages } = await paginate(Devis, page, limit, { id_client: _id }, devisPopulate, { created_at: -1 });
    devis = formatClientInDevis(devis);
    res.status(200).json(new Response("", Status.Ok, { devis, totalPages, page: parseInt(page), limit: parseInt(limit) }));
  } catch (error) {
    next(error);
  }
});

devisClientRouter.get("/client/vehicle/:id_vehicle", async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { id_vehicle } = req.params;
    let devis = await Devis.find({ id_vehicle: id_vehicle, id_client: _id }).populate(devisPopulate).sort({ created_at: -1 });
    devis = formatClientInDevis(devis);
    res.status(200).json(new Response("", Status.Ok, devis));
  } catch (error) {
    next(error);
  }
});

export default devisClientRouter;
