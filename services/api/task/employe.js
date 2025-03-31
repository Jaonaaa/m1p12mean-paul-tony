import MyError from "../../../models/app/MyError.js";
import Employe from "../../../models/Employe.js";
import Services_details_in_devis from "../../../models/Services_details_in_devis.js";
import { formatEmployes } from "../employe/index.js";

const MESSAGES = {
  TASK_NOT_FOUND: "Tâche introuvable",
  NO_COMPATIBLE_EMPLOYEES: "Aucun employé compatible pour cette tâche",
};
export const getCompatibleEmp = async (id_task) => {
  const task = await Services_details_in_devis.findById(id_task).populate("service");
  if (!task) throw new MyError(MESSAGES.TASK_NOT_FOUND);
  const service = task.service;
  let emp = [];
  if (service.required_skills.length == 0) emp = await Employe.find().populate(["id_user", "skills"]);
  else emp = await Employe.find({ skills: { $all: service.required_skills } }).populate(["id_user", "skills"]);
  emp = formatEmployes(emp);
  return emp;
};
