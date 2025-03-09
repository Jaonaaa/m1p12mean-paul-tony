import express from "express";
import roleRouter from "./role.js";
import userRouter from "./user.js";
import serviceRouter from "./service.js";
import devisRouter from "./devis.js";
import workRouter from "./work.js";
import employeRouter from "./employe.js";
import employeWorkTimeRouter from "./employe_work_time.js";
import servicesDetailsInDevisRouter from "./services_details_in_devis.js";

const apiRouter = express.Router();

apiRouter.use("/role", roleRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/service", serviceRouter);
apiRouter.use("/devis", devisRouter);
apiRouter.use("/work", workRouter);
apiRouter.use("/employe", employeRouter);
apiRouter.use("/employe_work_time", employeWorkTimeRouter);
apiRouter.use("/services_details_in_devis", servicesDetailsInDevisRouter);

export default apiRouter;
