import { Router } from "express";
import servicesDetailsMechanicRouter from "./mechanic.js";

const servicesDetailsInDevisRouter = Router();

servicesDetailsInDevisRouter.use("/", servicesDetailsMechanicRouter);

export default servicesDetailsInDevisRouter;
