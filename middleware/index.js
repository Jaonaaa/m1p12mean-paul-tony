import cors from "cors";
import { json, urlencoded } from "express";
import errorHandler from "./errorMiddleware.js";

/**
 * @param {Express} app
 */
export const setup = (app) => {
  // Middleware
  app.use(cors());
  app.use(json({ limit: "20mb" }));
  app.use(urlencoded({ limit: "20mb", extended: true }));
};

/**
 * @param {Express} app
 */
export const setupCustom = (app) => {
  // Middleware
  app.use(errorHandler);
};
