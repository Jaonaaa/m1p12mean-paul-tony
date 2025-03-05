import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import articleRouter from "./routes/articles.js";
import dotenv from "dotenv";
import categorieRouter from "./routes/categories.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(json());

// Connexion à MongoDB
connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connecté"))
  .catch((err) => console.log(err));

// Routes
app.use("/articles", articleRouter);
app.use("/categories", categorieRouter);

app.get("/", (req, res) => {
  res.send("API RESTful avec Express et MongoDB");
});

app.listen(PORT, () => console.log(`Serveur démarré: http://localhost:${PORT}`));
