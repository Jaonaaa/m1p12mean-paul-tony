import { Router } from "express";
import Employe from "../../models/Employe.js";
import Response, { Status } from "../../models/app/Response.js";

const employeRouter = Router();

employeRouter.post("/", async (req, res) => {
  const employe = new Employe(req.body);
  await employe.save();
  res.status(201).json(new Response("", Status.Ok, employe));
});

employeRouter.get("/", async (req, res) => {
  const employes = await Employe.find();
  res.status(200).json(new Response("", Status.Ok, employes));
});

employeRouter.put("/:id", async (req, res) => {
  const employe = await Employe.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(201).json(new Response("", Status.Ok, employe));
});

employeRouter.delete("/:id", async (req, res) => {
  await Employe.findByIdAndDelete(req.params.id);
  res.status(201).json(new Response("Employe supprimé", Status.Ok));
});

export const findEmploye = async (id) => {
  return await Employe.findById(id).populate("id_user");
};

export default employeRouter;
