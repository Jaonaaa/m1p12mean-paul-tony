import dotenv from "dotenv";
import { Router } from "express";
import Response, { Status } from "../../models/app/Response.js";
import { registerEmploye } from "../../services/auth/employe.js";
import { buildToken } from "./user.js";
import { authenticateManager } from "../../middleware/authMiddleware.js";

dotenv.config();

const employeAuthRouter = Router();

const MESSAGES = {
  USER_REGISTERED: "Employé enregistré",
};

employeAuthRouter.post("/register", authenticateManager, async (req, res, next) => {
  try {
    const { user, employe } = req.body;
    const { employe: registeredEmploye, user: registeredUser, role } = await registerEmploye({ user, employe });
    res.json(
      new Response(MESSAGES.USER_REGISTERED, Status.Ok, {
        user: { ...registeredUser, role: { label: role } },
        employe: registeredEmploye,
        token: buildToken(registeredUser, { label: role }),
      })
    );
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

export default employeAuthRouter;
