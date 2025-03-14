import express from "express";
import roleRouter from "./role.js";
import userRouter from "./user.js";
import serviceRouter from "./service.js";
import devisRouter from "./devis.js";
import workRouter from "./work.js";
import employeRouter from "./employe.js";
import employeWorkTimeRouter from "./employe_work_time.js";
import servicesDetailsInDevisRouter from "./services_details_in_devis.js";
import skillRouter from "./skill.js";
import serviceCategoriesRouter from "./service_categories.js";

const apiRouter = express.Router();

apiRouter.use("/role", roleRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/skill", skillRouter);
apiRouter.use("/service", serviceRouter);
apiRouter.use("/devis", devisRouter);
apiRouter.use("/work", workRouter);
apiRouter.use("/employe", employeRouter);
apiRouter.use("/employe_work_time", employeWorkTimeRouter);
apiRouter.use("/services_details_in_devis", servicesDetailsInDevisRouter);
apiRouter.use("/service_categories", serviceCategoriesRouter);

export default apiRouter;
