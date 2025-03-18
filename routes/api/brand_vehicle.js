import { Router } from "express";
import BrandVehicle from "../../models/BrandVehicle.js";
import Response, { Status } from "../../models/app/Response.js";
import MyError from "../../models/app/MyError.js";
import { paginate } from "../../utils/pagination.js";

const brandVehicleRouter = Router();

const MESSAGES = {
  BRAND_VEHICLE_CREATED: "Marque de véhicule créée avec succès",
  BRAND_VEHICLE_UPDATED: "Marque de véhicule mise à jour avec succès",
  BRAND_VEHICLE_DELETED: "Marque de véhicule supprimée",
  ID_NOT_FOUND: "ID introuvable",
};

brandVehicleRouter.post("/", async (req, res, next) => {
  try {
    const { label } = req.body;
    if (!label) throw new MyError("Le label est requis", 400);
    const newBrandVehicle = new BrandVehicle({ label });
    const savedBrandVehicle = await newBrandVehicle.save();
    res.status(201).json(new Response(MESSAGES.BRAND_VEHICLE_CREATED, Status.Ok, savedBrandVehicle));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

brandVehicleRouter.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { data: brands, totalPages } = await paginate(BrandVehicle, page, limit);
    res.status(200).json(new Response("", Status.Ok, { brands, totalPages, page: parseInt(page), limit: parseInt(limit) }));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

brandVehicleRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new MyError(MESSAGES.ID_NOT_FOUND, 400);
    const brandVehicle = await BrandVehicle.findById(id);
    if (!brandVehicle) throw new MyError(MESSAGES.ID_NOT_FOUND, 404);
    res.status(200).json(new Response("", Status.Ok, brandVehicle));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

brandVehicleRouter.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { label } = req.body;
    if (!label) throw new MyError("Le label est requis", 400);
    const updatedBrandVehicle = await BrandVehicle.findByIdAndUpdate(id, { label }, { new: true });
    if (!updatedBrandVehicle) throw new MyError(MESSAGES.ID_NOT_FOUND, 404);
    res.status(200).json(new Response(MESSAGES.BRAND_VEHICLE_UPDATED, Status.Ok, updatedBrandVehicle));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

brandVehicleRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new MyError(MESSAGES.ID_NOT_FOUND, 400);
    const deletedBrandVehicle = await BrandVehicle.findByIdAndDelete(id);
    if (!deletedBrandVehicle) throw new MyError(MESSAGES.ID_NOT_FOUND, 404);
    res.status(200).json(new Response(MESSAGES.BRAND_VEHICLE_DELETED, Status.Ok));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

export default brandVehicleRouter;
