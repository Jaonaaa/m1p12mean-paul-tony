import Service from "../../../models/Service.js";
import MyError from "../../../models/app/MyError.js";
import ServiceCategories from "../../../models/Service_Categories.js";
import Skill from "../../../models/Skill.js";

const ERROR_MESSAGES = {
  INVALID_LABEL: "Le label est requis",
  INVALID_PRICE: "Le prix doit être un nombre positif",
  INVALID_DURATION: "La durée doit être un temps valide",
  INVALID_CATEGORY: "La catégorie de service est invalide",
  INVALID_SKILLS: "Les compétences requises non trouvés",
};

export const insertService = async (serviceData) => {
  const { label, price, default_duration, description, required_skills, category } = serviceData;

  await validateServiceData({ label, price, default_duration, required_skills, category });

  const newService = new Service({
    label,
    price,
    default_duration,
    description,
    required_skills,
    category,
  });

  const savedService = await newService.save();

  return savedService;
};

const validateServiceData = async ({ label, price, default_duration, required_skills, category }) => {
  if (!label) throw new MyError(ERROR_MESSAGES.INVALID_LABEL);

  if (typeof price !== "number" || price < 0) throw new MyError(ERROR_MESSAGES.INVALID_PRICE);

  if (typeof default_duration !== "number" || default_duration < 0) throw new MyError(ERROR_MESSAGES.INVALID_DURATION);

  const categoryExists = await ServiceCategories.findById(category);

  if (!categoryExists) throw new MyError(ERROR_MESSAGES.INVALID_CATEGORY);

  const skillChecks = required_skills.map(async (skillId) => {
    const skillExists = await Skill.findById(skillId);
    if (!skillExists) throw new MyError(ERROR_MESSAGES.INVALID_SKILLS);
  });

  await Promise.all(skillChecks);
};
