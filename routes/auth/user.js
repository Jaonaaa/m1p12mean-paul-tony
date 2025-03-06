import { compare, hash } from "bcrypt";
import { Router } from "express";
import jsonwebtoken from "jsonwebtoken";
import User from "../../models/User.js";
import { findRole } from "../api/role.js";
import MyError from "../../models/app/MyError.js";
import dotenv from "dotenv";
import Response, { Status } from "../../models/app/Response.js";

dotenv.config();
const userAuthRouter = Router();
const JWT_KEY = process.env.JWT_KEY;

userAuthRouter.post("/register", async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashedPassword = await hash(password, 10);
    const clientRole = await findRole("client");
    // Verifie que l'email n'exite déja pour un message perso :3
    const user = new User({ ...req.body, password: hashedPassword, role: clientRole._id });
    await user.save();
    res.status(201).json(new Response("Utilisateur enregistré", Status.Ok, { user, ...user }));
  } catch (error) {
    next(new Response("Échec de l'inscription"));
  }
});

userAuthRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("role", "label");
    if (!user) throw new MyError("Email non inscrit sur Vroom");

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) throw new MyError("Email ou mot de passe incorrect");

    const token = jsonwebtoken.sign(
      { userId: user._id, email: user.email, firstname: user.firstname, lastname: user.lastname, role: user.role },
      JWT_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json(new Response("Connecté", Status.Ok, { token }));
  } catch (error) {
    next(error);
  }
});

userAuthRouter.post("/token", async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) throw new MyError("Token requis", 500);
    const payload = jsonwebtoken.verify(token, JWT_KEY, (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          throw new MyError("Token expiré", 401);
        }
      }
      return payload;
    });
    res.status(200).json({ ...payload });
  } catch (error) {
    next(error);
  }
});

export default userAuthRouter;
