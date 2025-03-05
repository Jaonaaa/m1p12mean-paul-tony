import { Router } from "express";
import Categorie from "../models/Categorie.js";
var router = Router();
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const article = new Categorie(req.body);
    await article.save();
    res.status(201).json(article);
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const articles = await Categorie.find();
    res.json(articles);
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const article = await Categorie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(article);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await Categorie.findByIdAndDelete(req.params.id);
    res.json({ message: "Elemeent supprimé" });
  })
);

router.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const categorieRouter = router;
export default categorieRouter;
