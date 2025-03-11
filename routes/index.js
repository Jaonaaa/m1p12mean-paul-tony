import express from "express";
import apiRouter from "./api/index.js";
import authRouter from "./auth/index.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const routes = express.Router();

export default () => {
  routes.get("/", (_, res) => {
    res.redirect(process.env.URL_FRONT);
  });
  routes.get("/yolo", (_, res) => {
    res.send({ message: "YOLO" });
  });
  //
  routes.use("/api", authenticateToken, apiRouter);
  routes.use("/auth", authRouter);
  return routes;
};
