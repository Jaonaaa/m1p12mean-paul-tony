import { compare, hash } from "bcrypt";
import { Router } from "express";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../../models/User.js";
import { findRole } from "../api/role.js";
import MyError from "../../models/app/MyError.js";
import Response, { Status } from "../../models/app/Response.js";

dotenv.config();

const userAuthRouter = Router();
const { JWT_KEY } = process.env;

const buildToken = (user, role) =>
  jsonwebtoken.sign(
    {
      _id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role,
    },
    JWT_KEY,
    { expiresIn: "1d" }
  );

const handleTokenVerification = (token, extractRole = false) => {
  if (!token) throw new MyError("Token requis", 500);
  return jsonwebtoken.verify(token, JWT_KEY, (err, payload) => {
    if (err?.name === "TokenExpiredError") throw new MyError("Token expiré", 401);
    return extractRole ? payload.role : payload;
  });
};

userAuthRouter.post("/register", async (req, res, next) => {
  try {
    const { password, ...userData } = req.body;
    const hashedPassword = await hash(password, 10);
    const clientRole = await findRole("client");

    const user = new User({ ...userData, password: hashedPassword, role: clientRole._id });
    await user.save();

    res.status(201).json(
      new Response("Utilisateur enregistré", Status.Ok, {
        user: {
          _id: user._id,
          lastname: user.lastname,
          firstname: user.firstname,
          email: user.email,
          role: { label: clientRole.label },
        },
        token: buildToken(user, clientRole),
      })
    );
  } catch {
    next(new Response("Échec de l'inscription"));
  }
});

userAuthRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("role", "label");
    if (!user || !(await compare(password, user.password))) {
      throw new MyError("Email ou mot de passe incorrect");
    }

    res.status(200).json(new Response("Connecté", Status.Ok, { token: buildToken(user, user.role) }));
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
