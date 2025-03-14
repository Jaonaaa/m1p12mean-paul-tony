import MyError from "../../../../../models/app/MyError.js";
import Employe from "../../../models/Employe.js";

const MESSAGES = {};

async function getAllEmployes() {
  try {
    const employes = await Employe.find();
    return employes;
  } catch (err) {
    throw new MyError(err.message);
  }
}

export default {
  getAllEmployes,
};
