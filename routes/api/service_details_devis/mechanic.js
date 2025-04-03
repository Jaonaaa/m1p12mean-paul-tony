import { Router } from "express";
import ServicesDetailsInDevis from "../../../models/Services_details_in_devis.js";
import Response, { Status } from "../../../models/app/Response.js";
import { authenticateManagerAndMechanic } from "../../../middleware/authMiddleware.js";
import { STATUS_DEVIS } from "../../../models/Devis.js";
import MyError from "../../../models/app/MyError.js";
import { updateDevisStatus } from "../../../services/api/devis/index.js";
import { updateDevisProgress } from "../../../services/api/devis/work/index.js";
import Employe from "../../../models/Employe.js";
import { getCompatibleEmp } from "../../../services/api/task/employe.js";

const servicesDetailsMechanicRouter = Router();

const MESSAGES = {
  SERVICES_DETAILS_UPDATED: "Tache mis à jour avec succès",
  SERVICES_DETAILS_NOT_FOUND: "Détails des services introuvables",
  NO_PERMISSION_TO_UPDATE_TASK: "Vous n'avez pas la permission de modifié cette tache",
  IS_NOT_STARTED: "Tache pas encore commencé",
  EMPLOYE_NOT_FOUND: "Employé introuvable",
};

const populateServiceDetails = [
  "service",
  "id_devis",
  {
    path: "workers",
    populate: [
      {
        path: "skills",
      },
    ],
  },
];
servicesDetailsMechanicRouter.get("/tasks/", authenticateManagerAndMechanic, async (req, res, next) => {
  try {
    const { _id } = req.user;
    const emp = await Employe.findOne({ id_user: _id });
    if (!emp) throw new MyError(MESSAGES.EMPLOYE_NOT_FOUND);

    const tasks = await ServicesDetailsInDevis.find({
      workers: emp._id,
    })
      .sort({ begin_at: -1 })
      .populate(populateServiceDetails);

    res.status(201).json(new Response("", Status.Ok, tasks));
  } catch (error) {
    next(error);
  }
});

servicesDetailsMechanicRouter.get("/tasks/not-started", authenticateManagerAndMechanic, async (req, res, next) => {
  try {
    const { _id } = req.user;
    const emp = await Employe.findOne({ id_user: _id });
    if (!emp) throw new MyError(MESSAGES.EMPLOYE_NOT_FOUND);

    const tasks = await ServicesDetailsInDevis.find({
      workers: emp._id,
      status: STATUS_DEVIS.PENDING,
    })
      .sort({ begin_at: -1 })
      .populate(populateServiceDetails);
    res.status(201).json(new Response("", Status.Ok, tasks));
  } catch (error) {
    next(error);
  }
});
servicesDetailsMechanicRouter.get("/tasks/started", authenticateManagerAndMechanic, async (req, res, next) => {
  try {
    const { _id } = req.user;
    const emp = await Employe.findOne({ id_user: _id });
    if (!emp) throw new MyError(MESSAGES.EMPLOYE_NOT_FOUND);
    const tasks = await ServicesDetailsInDevis.find({
      workers: emp._id,
      status: STATUS_DEVIS.IN_PROGRESS,
    })
      .sort({ begin_at: -1 })
      .populate(populateServiceDetails);
    res.status(201).json(new Response("", Status.Ok, tasks));
  } catch (error) {
    next(error);
  }
});

servicesDetailsMechanicRouter.put("/start", authenticateManagerAndMechanic, async (req, res, next) => {
  try {
    const { id_user, id_task } = req.body;

    const emp = await Employe.findOne({ id_user: id_user });
    if (!emp) throw new MyError(MESSAGES.EMPLOYE_NOT_FOUND);

    const task_assigned = await ServicesDetailsInDevis.findOne({
      workers: emp._id,
      _id: id_task,
    });
    if (!task_assigned) throw new MyError(MESSAGES.NO_PERMISSION_TO_UPDATE_TASK, 403);

    const task = await ServicesDetailsInDevis.findByIdAndUpdate(id_task, { status: STATUS_DEVIS.IN_PROGRESS }, { new: true }).populate(
      populateServiceDetails
    );
    updateDevisStatus(task_assigned.id_devis, STATUS_DEVIS.IN_PROGRESS, STATUS_DEVIS.ACCEPTED);

    res.status(201).json(new Response(MESSAGES.SERVICES_DETAILS_UPDATED, Status.Ok, task));
  } catch (error) {
    next(error);
  }
});

servicesDetailsMechanicRouter.put("/finished", authenticateManagerAndMechanic, async (req, res, next) => {
  try {
    const { id_user, id_task } = req.body;

    const emp = await Employe.findOne({ id_user: id_user });
    if (!emp) throw new MyError(MESSAGES.EMPLOYE_NOT_FOUND);

    const task_assigned = await ServicesDetailsInDevis.findOne({
      workers: emp._id,
      _id: id_task,
    });

    if (!task_assigned) throw new MyError(MESSAGES.NO_PERMISSION_TO_UPDATE_TASK, 403);
    if (task_assigned.status !== STATUS_DEVIS.IN_PROGRESS) throw new MyError(MESSAGES.IS_NOT_STARTED);

    const task = await ServicesDetailsInDevis.findByIdAndUpdate(id_task, { status: STATUS_DEVIS.COMPLETED }, { new: true }).populate(
      populateServiceDetails
    );
    await updateDevisProgress(task_assigned.id_devis);
    res.status(201).json(new Response(MESSAGES.SERVICES_DETAILS_UPDATED, Status.Ok, task));
  } catch (error) {
    next(error);
  }
});

servicesDetailsMechanicRouter.get("/task/service/:id_task/mechanic", authenticateManagerAndMechanic, async (req, res, next) => {
  try {
    const { id_task } = req.params;
    const emp = await getCompatibleEmp(id_task);
    res.status(201).json(new Response("", Status.Ok, emp));
  } catch (error) {
    next(error);
  }
});

export default servicesDetailsMechanicRouter;
