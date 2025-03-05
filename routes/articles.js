import { Router } from "express";
import Article from "../models/Article.js";
var router = Router();
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const article = new Article(req.body);
    await article.save();
    res.status(201).json(article);
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const articles = await Article.find().populate("categorie");
    res.json(articles);
  })
);

router.get(
  "/categories/:id_category",
  asyncHandler(async (req, res) => {
    const categorieId = req.params.id_category;
    if (categorieId == null) res.status(500).json({ message: "Aucun catégorie spécifier" });
    const articles = await Article.find({ categorie: categorieId }).populate("categorie"); // don't have to populate but it's just for testing
    res.json(articles);
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(article);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Article supprimé" });
  })
);

router.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const articleRouter = router;
export default articleRouter;
