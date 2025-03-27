import express from "express";
import brandVehicleRouter from "./brand_vehicle.js";
import clientVehicleRouter from "./client_vehicle.js";
import devisRouter from "./devis/devis.js";
import employeRouter from "./employe.js";
import roleRouter from "./role.js";
import serviceRouter from "./service.js";
import serviceCategoriesRouter from "./service_categories.js";
import servicesDetailsInDevisRouter from "./service_details_devis/index.js";
import skillRouter from "./skill.js";
import typeVehicleRouter from "./type_vehicle.js";
import userRouter from "./user.js";
import workRouter from "./work/index.js";

const apiRouter = express.Router();

apiRouter.use("/role", roleRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/skill", skillRouter);
apiRouter.use("/service", serviceRouter);
apiRouter.use("/devis", devisRouter);
apiRouter.use("/work", workRouter);
apiRouter.use("/employe", employeRouter);
apiRouter.use("/services_details_in_devis", servicesDetailsInDevisRouter);
apiRouter.use("/service_categories", serviceCategoriesRouter);
apiRouter.use("/brand_vehicle", brandVehicleRouter);
apiRouter.use("/type_vehicle", typeVehicleRouter);
apiRouter.use("/client_vehicle", clientVehicleRouter);

export default apiRouter;
