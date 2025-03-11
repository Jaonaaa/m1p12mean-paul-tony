import { compare } from "bcrypt";
import dotenv from "dotenv";
import { Router } from "express";
import jsonwebtoken from "jsonwebtoken";
import MyError from "../../models/app/MyError.js";
import Response, { Status } from "../../models/app/Response.js";
import User from "../../models/User.js";
import { getCloudinaryUrl } from "../../services/api/user/upload/index.js";
import { formatUser, registerUser, validateUser } from "../../services/auth/user.js";

dotenv.config();

const userAuthRouter = Router();
const { JWT_KEY } = process.env;

const buildToken = (user, role) => jsonwebtoken.sign({ ...user, role }, JWT_KEY, { expiresIn: "1d" });

const buildUser = (user, role) => {
  return { ...user, picture: getCloudinaryUrl(user.picture, { width: 200, height: 200 }), role: { label: role.label } };
};

const handleTokenVerification = (token, extractRole = false) => {
  if (!token) throw new MyError("Token requis", 500);
  return jsonwebtoken.verify(token, JWT_KEY, (err, payload) => {
    if (err?.name === "TokenExpiredError") throw new MyError("Token expiré", 401);
    return extractRole ? payload.role : payload;
  });
};

userAuthRouter.post("/register", async (req, res, next) => {
  try {
    validateUser(req.body);
    const { user, role } = await registerUser(req.body);
    res.status(201).json(
      new Response("Utilisateur enregistré", Status.Ok, {
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
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("role", "label");
    if (!user || !(await compare(password, user.password))) throw new MyError("Email ou mot de passe incorrect");
    let formated_user = formatUser(user);
    res.json(
      new Response("Connecté", Status.Ok, { user: buildUser(formated_user, user.role), token: buildToken(formated_user, user.role) })
    );
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
