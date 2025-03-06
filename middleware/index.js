import cors from "cors";
import { json } from "express";
import errorHandler from "./errorMiddleware.js";

/**
 * @param {Express} app
 */
export const setup = (app) => {
  // Middleware
  app.use(cors());
  app.use(json());
};

/**
 * @param {Express} app
 */
export const setupCustom = (app) => {
  // Middleware
  app.use(errorHandler);
};
