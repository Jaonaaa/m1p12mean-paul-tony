import { Router } from "express";
import ServicesDetailsInDevis from "../../../models/Services_details_in_devis.js";
import Response, { Status } from "../../../models/app/Response.js";
import { authenticateManagerAndMechanic } from "../../../middleware/authMiddleware.js";
import { STATUS_DEVIS } from "../../../models/Devis.js";
import MyError from "../../../models/app/MyError.js";
import { updateDevisStatus } from "../../../services/api/devis/index.js";
import { updateDevisProgress } from "../../../services/api/devis/work/index.js";

const servicesDetailsMechanicRouter = Router();

const MESSAGES = {
  SERVICES_DETAILS_UPDATED: "Tache mis à jour avec succès",
  SERVICES_DETAILS_NOT_FOUND: "Détails des services introuvables",
  NO_PERMISSION_TO_UPDATE_TASK: "Vous n'avez pas la permission de modifié cette tache",
  IS_NOT_STARTED: "Tache pas encore commencé",
};

servicesDetailsMechanicRouter.get("/tasks", authenticateManagerAndMechanic, async (req, res, next) => {
  try {
    const { id_emp } = req.body;
    const tasks = await ServicesDetailsInDevis.find({
      workers: id_emp,
    })
      .sort({ begin_at: -1 })
      .populate(["service", "id_devis"]);
    res.status(201).json(new Response("", Status.Ok, tasks));
  } catch (error) {
    next(error);
  }
});

servicesDetailsMechanicRouter.put("/start", authenticateManagerAndMechanic, async (req, res, next) => {
  try {
    const { id_emp, id_task } = req.body;

    const task_assigned = await ServicesDetailsInDevis.findOne({
      workers: id_emp,
      _id: id_task,
    });
    if (!task_assigned) throw new MyError(MESSAGES.NO_PERMISSION_TO_UPDATE_TASK, 403);

    const task = await ServicesDetailsInDevis.findByIdAndUpdate(id_task, { status: STATUS_DEVIS.IN_PROGRESS }, { new: true });
    updateDevisStatus(task_assigned.id_devis, STATUS_DEVIS.IN_PROGRESS, STATUS_DEVIS.ACCEPTED);

    res.status(201).json(new Response(MESSAGES.SERVICES_DETAILS_UPDATED, Status.Ok, task));
  } catch (error) {
    next(error);
  }
});

servicesDetailsMechanicRouter.put("/finished", authenticateManagerAndMechanic, async (req, res, next) => {
  try {
    const { id_emp, id_task } = req.body;

    const task_assigned = await ServicesDetailsInDevis.findOne({
      workers: id_emp,
      _id: id_task,
    });

    if (!task_assigned) throw new MyError(MESSAGES.NO_PERMISSION_TO_UPDATE_TASK, 403);
    if (task_assigned.status !== STATUS_DEVIS.IN_PROGRESS) throw new MyError(MESSAGES.IS_NOT_STARTED);

    const task = await ServicesDetailsInDevis.findByIdAndUpdate(id_task, { status: STATUS_DEVIS.COMPLETED }, { new: true });
    await updateDevisProgress(task_assigned.id_devis);
    res.status(201).json(new Response(MESSAGES.SERVICES_DETAILS_UPDATED, Status.Ok, task));
  } catch (error) {
    next(error);
  }
});

export default servicesDetailsMechanicRouter;
