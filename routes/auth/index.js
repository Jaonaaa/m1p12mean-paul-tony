import express from "express";
import userAuthRouter from "./user.js";

const authRouter = express.Router();

authRouter.use("/", userAuthRouter);
export default authRouter;
