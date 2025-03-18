import { Router } from "express";
import ClientVehicle from "../../models/ClientVehicle.js";
import Response, { Status } from "../../models/app/Response.js";
import MyError from "../../models/app/MyError.js";

const clientVehicleRouter = Router();

const MESSAGES = {
  CLIENT_VEHICLE_CREATED: "Véhicule client créé avec succès",
  CLIENT_VEHICLE_UPDATED: "Véhicule client mis à jour avec succès",
  CLIENT_VEHICLE_DELETED: "Véhicule client supprimé",
  ID_NOT_FOUND: "ID introuvable",
};

// Create a new client vehicle
clientVehicleRouter.post("/", async (req, res, next) => {
  try {
    const { id_type_vehicle, id_brand_vehicle, id_client, registration_number, year } = req.body;
    if (!id_type_vehicle || !id_brand_vehicle || !id_client || !registration_number || !year) {
      throw new MyError("Tous les champs sont requis", 400);
    }
    const newClientVehicle = new ClientVehicle({ id_type_vehicle, id_brand_vehicle, id_client, registration_number, year });
    const savedClientVehicle = await newClientVehicle.save();
    res.status(201).json(new Response(MESSAGES.CLIENT_VEHICLE_CREATED, Status.Ok, savedClientVehicle));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

// Get all client vehicles
clientVehicleRouter.get("/", async (req, res, next) => {
  try {
    const clientVehicles = await ClientVehicle.find().populate(["id_type_vehicle", "id_brand_vehicle", "id_client"]);
    res.status(200).json(new Response("", Status.Ok, clientVehicles));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

// Get a single client vehicle by ID
clientVehicleRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new MyError(MESSAGES.ID_NOT_FOUND, 400);
    const clientVehicle = await ClientVehicle.findById(id).populate(["id_type_vehicle", "id_brand_vehicle", "id_client"]);
    if (!clientVehicle) throw new MyError(MESSAGES.ID_NOT_FOUND, 404);
    res.status(200).json(new Response("", Status.Ok, clientVehicle));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

// Update a client vehicle by ID
clientVehicleRouter.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_type_vehicle, id_brand_vehicle, id_client, registration_number, year } = req.body;
    if (!id_type_vehicle || !id_brand_vehicle || !id_client || !registration_number || !year) {
      throw new MyError("Tous les champs sont requis", 400);
    }
    const updatedClientVehicle = await ClientVehicle.findByIdAndUpdate(
      id,
      { id_type_vehicle, id_brand_vehicle, id_client, registration_number, year },
      { new: true }
    );
    if (!updatedClientVehicle) throw new MyError(MESSAGES.ID_NOT_FOUND, 404);
    res.status(200).json(new Response(MESSAGES.CLIENT_VEHICLE_UPDATED, Status.Ok, updatedClientVehicle));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

// Delete a client vehicle by ID
clientVehicleRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new MyError(MESSAGES.ID_NOT_FOUND, 400);
    const deletedClientVehicle = await ClientVehicle.findByIdAndDelete(id);
    if (!deletedClientVehicle) throw new MyError(MESSAGES.ID_NOT_FOUND, 404);
    res.status(200).json(new Response(MESSAGES.CLIENT_VEHICLE_DELETED, Status.Ok));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

export default clientVehicleRouter;
