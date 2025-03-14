import { compare } from "bcrypt";
import dotenv from "dotenv";
import { Router } from "express";
import MyError from "../../models/app/MyError.js";
import Response, { Status } from "../../models/app/Response.js";
import User from "../../models/User.js";
import { getEmployeByUserId, registerEmploye } from "../../services/auth/employe.js";
import { formatUser } from "../../services/auth/user.js";
import { buildToken, buildUser } from "./user.js";

dotenv.config();

const employeAuthRouter = Router();

const MESSAGES = {
  INVALID_CREDENTIALS: "Email ou mot de passe incorrect",
  USER_REGISTERED: "Employé enregistré",
  CONNECTED: "Connecté",
};

employeAuthRouter.post("/register", async (req, res, next) => {
  try {
    const { user, employe } = req.body;
    const { employe: registeredEmploye, user: registeredUser, role } = await registerEmploye({ user, employe });
    res.json(
      new Response(MESSAGES.USER_REGISTERED, Status.Ok, {
        user: { ...registeredUser, role: { label: role } },
        employe: registeredEmploye,
        token: buildToken(registeredUser, role),
      })
    );
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

employeAuthRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("role", "label");
    if (!user || !(await compare(password, user.password))) throw new MyError(MESSAGES.INVALID_CREDENTIALS);
    let formattedUser = formatUser(user);
    const employe = await getEmployeByUserId(user._id);
    res.json(
      new Response(MESSAGES.CONNECTED, Status.Ok, {
        user: buildUser(formattedUser, user.role),
        employe: employe,
        token: buildToken(formattedUser, user.role),
      })
    );
  } catch (error) {
    next(new Response(error.message, Status.Error));
  }
});

export default employeAuthRouter;
