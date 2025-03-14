import MyError from "../../models/app/MyError.js";
import Employe from "../../models/Employe.js";
import { ROLES } from "../../models/Role.js";
import { registerUser, validateUser } from "./user.js";

const MESSAGES = {
  SALARY_INVALID: "Le salaire donner est invalide",
  PASSWORD_TOO_SHORT: "Le mot de passe doit contenir au moins 8 caractères",
  NOT_FOUND: "Employer non trouvé",
};

export async function registerEmploye({ user, employe }) {
  validateUser(user);
  const { user: userRegistred, role } = await registerUser(user, ROLES.MECANICIEN);
  validateEmploye(employe);
  const entered_at = new Date();
  const new_employe = new Employe({ id_user: userRegistred._id, ...employe, entered_at });
  const saved_employe = await new_employe.save();
  return { employe: saved_employe, user: userRegistred, role };
}

export async function getEmployeByUserId(userId) {
  const employe = await Employe.findOne({ id_user: userId });
  if (!employe) throw new MyError(NOT_FOUND);
  return employe;
}

export function validateEmploye(employe) {
  const { salary } = employe;
  if (Number(salary) < 0) {
    throw new MyError(MESSAGES.SALARY_INVALID);
  }
}
