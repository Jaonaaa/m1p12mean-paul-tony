import { Router } from "express";
import ServiceCategories from "../../models/Service_Categories.js";
import MyError from "../../models/app/MyError.js";
import Response, { Status } from "../../models/app/Response.js";

const serviceCategoriesRouter = Router();

const MESSAGES = {
  CATEGORY_NOT_FOUND: "Catégorie de service non trouvée",
  CATEGORY_CREATED: "Catégorie de service créée",
  CATEGORY_UPDATED: "Catégorie de service mise à jour",
  CATEGORY_DELETED: "Catégorie de service supprimée",
};

serviceCategoriesRouter.post("/", async (req, res, next) => {
  try {
    const { label } = req.body;
    const newCategory = new ServiceCategories({ label });
    const savedCategory = await newCategory.save();
    res.status(201).json(new Response(MESSAGES.CATEGORY_CREATED, Status.Ok, savedCategory));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

serviceCategoriesRouter.get("/", async (req, res, next) => {
  try {
    const categories = await ServiceCategories.find();
    res.status(200).json(new Response(null, Status.Ok, categories));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

serviceCategoriesRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await ServiceCategories.findById(id);
    if (!category) throw new MyError(MESSAGES.CATEGORY_NOT_FOUND, 404);
    res.status(200).json(new Response(null, Status.Ok, category));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

serviceCategoriesRouter.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { label } = req.body;
    const updatedCategory = await ServiceCategories.findByIdAndUpdate(id, { label }, { new: true });
    if (!updatedCategory) throw new MyError(MESSAGES.CATEGORY_NOT_FOUND, 404);
    res.status(200).json(new Response(MESSAGES.CATEGORY_UPDATED, Status.Ok, updatedCategory));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

serviceCategoriesRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCategory = await ServiceCategories.findByIdAndDelete(id);
    if (!deletedCategory) throw new MyError(MESSAGES.CATEGORY_NOT_FOUND, 404);
    res.status(200).json(new Response(MESSAGES.CATEGORY_DELETED, Status.Ok, deletedCategory));
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

export default serviceCategoriesRouter;
