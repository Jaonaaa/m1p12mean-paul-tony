import { Router } from "express";
import Devis from "../../models/Devis.js";
import Response, { Status } from "../../models/app/Response.js";

const devisRouter = Router();

devisRouter.post("/", async (req, res) => {
  const devis = new Devis(req.body);
  await devis.save();
  res.status(201).json(new Response("", Status.Ok, devis));
});

devisRouter.get("/", async (req, res) => {
  const devis = await Devis.find();
  res.status(200).json(new Response("", Status.Ok, devis));
});

devisRouter.put("/:id", async (req, res) => {
  const devis = await Devis.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(201).json(new Response("", Status.Ok, devis));
});

devisRouter.delete("/:id", async (req, res) => {
  await Devis.findByIdAndDelete(req.params.id);
  res.status(201).json(new Response("Devis supprimé", Status.Ok));
});

export const findDevis = async (id) => {
  return await Devis.findById(id).populate("services").populate("id_client");
};

export default devisRouter;
