import MyError from "../../../models/app/MyError.js";
import Employe from "../../../models/Employe.js";

const MESSAGES = {
  EMPLOYE_NOT_FOUND: "Employé non trouvé",
};

export async function getAllEmployes() {
  try {
    const employes = await Employe.find();
    return employes;
  } catch (err) {
    throw new MyError(err.message);
  }
}

export async function getEmployeSkills({ userId }) {
  const employe = await Employe.findOne({ id_user: userId }).populate("skills");
  if (!employe) throw new MyError(MESSAGES.EMPLOYE_NOT_FOUND);
  return employe.skills;
}
