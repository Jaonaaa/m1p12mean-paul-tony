import express from "express";
import userAuthRouter from "./user.js";
import employeAuthRouter from "./employe.js";

const authRouter = express.Router();

authRouter.use("/", userAuthRouter);
authRouter.use("/emp/", employeAuthRouter);

export default authRouter;
