import { Router } from "express";
import EmployeWorkTime from "../../models/Employe_work_time.js";
import Response, { Status } from "../../models/app/Response.js";

const employeWorkTimeRouter = Router();

employeWorkTimeRouter.post("/", async (req, res) => {
  const employeWorkTime = new EmployeWorkTime(req.body);
  await employeWorkTime.save();
  res.status(201).json(new Response("", Status.Ok, employeWorkTime));
});

employeWorkTimeRouter.get("/", async (req, res) => {
  const employeWorkTimes = await EmployeWorkTime.find();
  res.status(200).json(new Response("", Status.Ok, employeWorkTimes));
});

employeWorkTimeRouter.put("/:id", async (req, res) => {
  const employeWorkTime = await EmployeWorkTime.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(201).json(new Response("", Status.Ok, employeWorkTime));
});

employeWorkTimeRouter.delete("/:id", async (req, res) => {
  await EmployeWorkTime.findByIdAndDelete(req.params.id);
  res.status(201).json(new Response("EmployeWorkTime supprimé", Status.Ok));
});

export const findEmployeWorkTime = async (id) => {
  return await EmployeWorkTime.findById(id).populate("id_employe");
};

export default employeWorkTimeRouter;
