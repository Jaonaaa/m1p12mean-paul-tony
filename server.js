import dotenv from "dotenv";
import express from "express";
import { dbConnection } from "./config/db/index.js";
import { setup, setupCustom } from "./middleware/index.js";
import Routes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
setup(app);

// Routes
app.use(Routes());

// Custom Middleware
setupCustom(app);

// Database Connection
await dbConnection({ prod: false });

app.listen(PORT, () => console.log(`Serveur démarré: http://localhost:${PORT}`));
