import { Router } from "express";
import Work from "../../models/Work.js";
import Response, { Status } from "../../models/app/Response.js";

const workRouter = Router();

workRouter.post("/", async (req, res) => {
  const work = new Work(req.body);
  await work.save();
  res.status(201).json(new Response("", Status.Ok, work));
});

workRouter.get("/", async (req, res) => {
  const works = await Work.find();
  res.status(200).json(new Response("", Status.Ok, works));
});

workRouter.put("/:id", async (req, res) => {
  const work = await Work.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(201).json(new Response("", Status.Ok, work));
});

workRouter.delete("/:id", async (req, res) => {
  await Work.findByIdAndDelete(req.params.id);
  res.status(201).json(new Response("Work supprimé", Status.Ok));
});

export const findWork = async (id) => {
  return await Work.findById(id).populate("id_devis");
};

export default workRouter;
