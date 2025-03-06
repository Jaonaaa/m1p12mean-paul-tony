import express from "express";
import roleRouter from "./role.js";
import userRouter from "./user.js";

const apiRouter = express.Router();

apiRouter.use("/role", roleRouter);
apiRouter.use("/user", userRouter);

export default apiRouter;
