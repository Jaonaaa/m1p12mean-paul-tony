import { Router } from "express";
import TypeVehicle from "../../models/TypeVehicle.js";
import Response, { Status } from "../../models/app/Response.js";
import MyError from "../../models/app/MyError.js";

const typeVehicleRouter = Router();

const MESSAGES = {
  TYPE_VEHICLE_CREATED: "Type de véhicule créé avec succès",
  TYPE_VEHICLE_UPDATED: "Type de véhicule mis à jour avec succès",
  TYPE_VEHICLE_DELETED: "Type de véhicule supprimé",
  ID_NOT_FOUND: "ID introuvable",
};

typeVehicleRouter.post("/", async (req, res, next) => {
  try {
    const { label } = req.body;
    if (!label) throw new MyError("Le label est requis", 400);
    const newTypeVehicle = new TypeVehicle({ label });
    const savedTypeVehicle = await newTypeVehicle.save();
    res.status(201).json(new Response(MESSAGES.TYPE_VEHICLE_CREATED, Status.Ok, savedTypeVehicle));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

typeVehicleRouter.get("/", async (req, res, next) => {
  try {
    const typeVehicles = await TypeVehicle.find();
    res.status(200).json(new Response("", Status.Ok, typeVehicles));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

typeVehicleRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new MyError(MESSAGES.ID_NOT_FOUND, 400);
    const typeVehicle = await TypeVehicle.findById(id);
    if (!typeVehicle) throw new MyError(MESSAGES.ID_NOT_FOUND, 404);
    res.status(200).json(new Response("", Status.Ok, typeVehicle));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

typeVehicleRouter.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { label } = req.body;
    if (!label) throw new MyError("Le label est requis", 400);
    const updatedTypeVehicle = await TypeVehicle.findByIdAndUpdate(id, { label }, { new: true });
    if (!updatedTypeVehicle) throw new MyError(MESSAGES.ID_NOT_FOUND, 404);
    res.status(200).json(new Response(MESSAGES.TYPE_VEHICLE_UPDATED, Status.Ok, updatedTypeVehicle));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

typeVehicleRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new MyError(MESSAGES.ID_NOT_FOUND, 400);
    const deletedTypeVehicle = await TypeVehicle.findByIdAndDelete(id);
    if (!deletedTypeVehicle) throw new MyError(MESSAGES.ID_NOT_FOUND, 404);
    res.status(200).json(new Response(MESSAGES.TYPE_VEHICLE_DELETED, Status.Ok));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

export default typeVehicleRouter;
