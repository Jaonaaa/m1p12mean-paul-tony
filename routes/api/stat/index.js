import { Router } from "express";
import mechanicStatRouter from "./mechanic.js";
import managerStatRouter from "./manager.js";
import clientStatRouter from "./client.js";

const statRouter = Router();

statRouter.use("/mechanic", mechanicStatRouter);
statRouter.use("/manager", managerStatRouter);
statRouter.use("/client", clientStatRouter);

export default statRouter;
