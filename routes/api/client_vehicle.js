import { Router } from "express";
import ClientVehicle from "../../models/ClientVehicle.js";
import Response, { Status } from "../../models/app/Response.js";
import MyError from "../../models/app/MyError.js";
import { paginate } from "../../utils/pagination.js";
import { formatClientVehicle } from "../../services/api/client_vehicle/index.js";

const clientVehicleRouter = Router();

const MESSAGES = {
  CLIENT_VEHICLE_CREATED: "Véhicule client créé avec succès",
  CLIENT_VEHICLE_UPDATED: "Véhicule client mis à jour avec succès",
  CLIENT_VEHICLE_DELETED: "Véhicule client supprimé",
  ID_NOT_FOUND: "ID introuvable",
  ALL_FIELDS_REQUIRED: "Tous les champs sont requis",
};

clientVehicleRouter.post("/", async (req, res, next) => {
  try {
    const { id_type_vehicle, id_brand_vehicle, id_client, registration_number, year, model } = req.body;
    if (!id_type_vehicle || !id_brand_vehicle || !id_client || !registration_number || !year || !model) {
      throw new MyError(MESSAGES.ALL_FIELDS_REQUIRED, 400);
    }
    const newClientVehicle = new ClientVehicle({ ...req.body });
    const savedClientVehicle = await newClientVehicle.save();
    res.status(201).json(new Response(MESSAGES.CLIENT_VEHICLE_CREATED, Status.Ok, savedClientVehicle));
  } catch (error) {
    next(error);
  }
});

clientVehicleRouter.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { data: vehicles, totalPages } = await paginate(ClientVehicle, page, limit, {}, [
      "id_type_vehicle",
      "id_brand_vehicle",
      "id_client",
    ]);
    vehicles.forEach((vehicle) => formatClientVehicle(vehicle));
    res.status(200).json(new Response("", Status.Ok, { vehicles, totalPages, page: parseInt(page), limit: parseInt(limit) }));
  } catch (error) {
    next(error);
  }
});

clientVehicleRouter.get("/user/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) throw new MyError(MESSAGES.ID_NOT_FOUND, 400);
    const clientVehicles = (
      await ClientVehicle.find({ id_client: userId }).populate(["id_type_vehicle", "id_brand_vehicle", "id_client"])
    ).map((vehicle) => formatClientVehicle(vehicle));
    res.status(200).json(new Response("", Status.Ok, clientVehicles));
  } catch (error) {
    next(error);
  }
});

clientVehicleRouter.get("/vehicle/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new MyError(MESSAGES.ID_NOT_FOUND, 400);
    const clientVehicles = await ClientVehicle.findById(id).populate(["id_type_vehicle", "id_brand_vehicle", "id_client"]);
    res.status(200).json(new Response("", Status.Ok, clientVehicles));
  } catch (error) {
    next(error);
  }
});

clientVehicleRouter.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_type_vehicle, id_brand_vehicle, id_client, registration_number, year } = req.body;
    if (!id_type_vehicle || !id_brand_vehicle || !id_client || !registration_number || !year) {
      throw new MyError(MESSAGES.ALL_FIELDS_REQUIRED, 400);
    }
    const updatedClientVehicle = await ClientVehicle.findByIdAndUpdate(
      id,
      { id_type_vehicle, id_brand_vehicle, id_client, registration_number, year },
      { new: true }
    );
    if (!updatedClientVehicle) throw new MyError(MESSAGES.ID_NOT_FOUND, 404);
    res.status(200).json(new Response(MESSAGES.CLIENT_VEHICLE_UPDATED, Status.Ok, updatedClientVehicle));
  } catch (error) {
    next(error);
  }
});

clientVehicleRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new MyError(MESSAGES.ID_NOT_FOUND, 400);
    const deletedClientVehicle = await ClientVehicle.findByIdAndDelete(id);
    if (!deletedClientVehicle) throw new MyError(MESSAGES.ID_NOT_FOUND, 404);
    res.status(200).json(new Response(MESSAGES.CLIENT_VEHICLE_DELETED, Status.Ok));
  } catch (error) {
    next(error);
  }
});

export default clientVehicleRouter;
