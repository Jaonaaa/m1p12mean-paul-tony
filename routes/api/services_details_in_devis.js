import { Router } from "express";
import ServicesDetailsInDevis from "../../models/Services_details_in_devis.js";
import Response, { Status } from "../../models/app/Response.js";

const servicesDetailsInDevisRouter = Router();

servicesDetailsInDevisRouter.post("/", async (req, res) => {
  const servicesDetailsInDevis = new ServicesDetailsInDevis(req.body);
  await servicesDetailsInDevis.save();
  res.status(201).json(new Response("", Status.Ok, servicesDetailsInDevis));
});

servicesDetailsInDevisRouter.get("/", async (req, res) => {
  const servicesDetailsInDevis = await ServicesDetailsInDevis.find();
  res.status(200).json(new Response("", Status.Ok, servicesDetailsInDevis));
});

servicesDetailsInDevisRouter.put("/:id", async (req, res) => {
  const servicesDetailsInDevis = await ServicesDetailsInDevis.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(201).json(new Response("", Status.Ok, servicesDetailsInDevis));
});

servicesDetailsInDevisRouter.delete("/:id", async (req, res) => {
  await ServicesDetailsInDevis.findByIdAndDelete(req.params.id);
  res.status(201).json(new Response("ServicesDetailsInDevis supprimé", Status.Ok));
});

export const findServicesDetailsInDevis = async (id) => {
  return await ServicesDetailsInDevis.findById(id).populate("workers");
};

export default servicesDetailsInDevisRouter;
