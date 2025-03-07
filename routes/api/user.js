import { Router } from "express";
import User from "../../models/User.js";
import MyError from "../../models/app/MyError.js";
import { Status } from "../../models/app/Response.js";
var userRouter = Router();

userRouter.get("/all", async (_, res) => {
  const roles = await User.find().select("-password -email");
  res.json(new Response(null, Status.Ok, roles));
});

// userRouter.put("/:id", async (req, res) => {
//   const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
//   res.json(role);
// });

userRouter.put("/picture", async (req, res, next) => {
  try {
    if (req.body.id === undefined) throw new MyError("L'id est requis", 500);

    const user = await User.findById(req.body.id);
    if (!user) throw new MyError("Utilisateur introuvable", 404);

    user.picture = req.body.picture;
    const updated_user = await User.findByIdAndUpdate(req.body.id, user);

    res.json(new Response("Image modifiée", Status.Ok, updated_user));
  } catch (error) {
    next(error);
  }
});

export default userRouter;
