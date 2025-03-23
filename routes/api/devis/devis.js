import { Router } from "express";
import client from "./client.js";
import manager from "./manager.js";

const devisRouter = Router();

devisRouter.use("/", client);
devisRouter.use("/", manager);

export default devisRouter;
