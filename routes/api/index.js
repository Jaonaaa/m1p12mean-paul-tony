import express from "express";
import roleRouter from "./role.js";
import userRouter from "./user.js";
import serviceRouter from "./service.js";
import devisRouter from "./devis/devis.js";
import workRouter from "./work/index.js";
import employeRouter from "./employe.js";
import employeWorkTimeRouter from "./employe_work_time.js";
import servicesDetailsInDevisRouter from "./services_details_in_devis.js";
import skillRouter from "./skill.js";
import serviceCategoriesRouter from "./service_categories.js";
import brandVehicleRouter from "./brand_vehicle.js";
import typeVehicleRouter from "./type_vehicle.js";
import clientVehicleRouter from "./client_vehicle.js";

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
apiRouter.use("/brand_vehicle", brandVehicleRouter);
apiRouter.use("/type_vehicle", typeVehicleRouter);
apiRouter.use("/client_vehicle", clientVehicleRouter);

export default apiRouter;
