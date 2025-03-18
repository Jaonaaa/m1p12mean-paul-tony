import dotenv from "dotenv";
import { Router } from "express";
import jsonwebtoken from "jsonwebtoken";
import MyError from "../../models/app/MyError.js";
import Response, { Status } from "../../models/app/Response.js";
import { ROLES } from "../../models/Role.js";
import { getCloudinaryUrl } from "../../services/api/user/upload/index.js";
import { getEmployeByUserId } from "../../services/auth/employe.js";
import { login, registerUser, validateUser } from "../../services/auth/user.js";
import { sendEmail } from "../../services/email/index.js";

dotenv.config();

const userAuthRouter = Router();
const { JWT_KEY } = process.env;

const MESSAGES = {
  TOKEN_REQUIRED: "Token requis",
  TOKEN_EXPIRED: "Token expiré",
  INVALID_CREDENTIALS: "Email ou mot de passe incorrect",
  USER_REGISTERED: "Utilisateur enregistré",
  CONNECTED: "Connecté",
};

export const buildToken = (user, role) => jsonwebtoken.sign({ ...user, role }, JWT_KEY, { expiresIn: "1d" });

export const buildUser = (user, role) => {
  return { ...user, picture: getCloudinaryUrl(user.picture, { width: 200, height: 200 }), role: { label: role.label } };
};

const handleTokenVerification = (token, extractRole = false) => {
  if (!token) throw new MyError(MESSAGES.TOKEN_REQUIRED, 500);
  return jsonwebtoken.verify(token, JWT_KEY, (err, payload) => {
    if (err?.name === "TokenExpiredError") throw new MyError(MESSAGES.TOKEN_EXPIRED, 401);
    return extractRole ? payload.role : payload;
  });
};

userAuthRouter.post("/register", async (req, res, next) => {
  try {
    validateUser(req.body);
    const { user, role } = await registerUser(req.body);
    sendEmail(user.email, `${user.firstname} ${user.lastname}`);
    res.status(201).json(
      new Response(MESSAGES.USER_REGISTERED, Status.Ok, {
        user: { ...user, role: { label: role } },
        token: buildToken(user, role),
      })
    );
  } catch (error) {
    next(new Response(error.message));
  }
});

userAuthRouter.post("/login", async (req, res, next) => {
  try {
    const { user, formated_user } = await login(req.body, MESSAGES.INVALID_CREDENTIALS);
    const isMechanic = user.role.label === ROLES.MECANICIEN;
    const employe = isMechanic ? await getEmployeByUserId(user._id) : null;

    const responsePayload = {
      user: buildUser(formated_user, user.role),
      token: buildToken(formated_user, user.role),
    };

    if (isMechanic) {
      responsePayload.employe = employe;
    }

    res.json(new Response(MESSAGES.CONNECTED, Status.Ok, responsePayload));
  } catch (error) {
    next(error);
  }
});

userAuthRouter.post("/token", async (req, res, next) => {
  try {
    res.status(200).json(new Response("", Status.Ok, handleTokenVerification(req.body.token)));
  } catch (error) {
    next(error);
  }
});

userAuthRouter.post("/token/role", async (req, res, next) => {
  try {
    res.status(200).json(new Response("", Status.Ok, handleTokenVerification(req.body.token, true)));
  } catch (error) {
    next(error);
  }
});

export default userAuthRouter;
