import { Router } from "express";
import Service from "../../models/Service.js";
import Response, { Status } from "../../models/app/Response.js";

const serviceRouter = Router();

serviceRouter.post("/", async (req, res) => {
  const service = new Service(req.body);
  await service.save();
  res.status(201).json(new Response("", Status.Ok, service));
});

serviceRouter.get("/", async (req, res) => {
  const services = await Service.find();
  res.status(200).json(new Response("", Status.Ok, services));
});

serviceRouter.put("/:id", async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(201).json(new Response("", Status.Ok, service));
});

serviceRouter.delete("/:id", async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.status(201).json(new Response("Service supprimé", Status.Ok));
});

export const findService = async (label) => {
  return await Service.findOne({ label: label }).select("label");
};

export default serviceRouter;
