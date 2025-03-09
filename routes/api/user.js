import { Router } from "express";
import User from "../../models/User.js";
import MyError from "../../models/app/MyError.js";
import Response, { Status } from "../../models/app/Response.js";
import uploadBase64ToCloudinary from "../../services/api/user/upload/index.js";
const userRouter = Router();

userRouter.get("/all", async (_, res) => {
  const users = await User.find().select("-password -email");
  res.json(new Response(null, Status.Ok, users));
});

userRouter.put("/picture", async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);
    const { picture } = req.body;
    if (!user) throw new MyError("Utilisateur introuvable", 404);
    let public_id = await uploadBase64ToCloudinary(picture);
    user.picture = public_id;
    const updated_user = await User.findByIdAndUpdate(user._id, user, { new: true });

    res.json(new Response("Image mise a jour", Status.Ok, updated_user));
  } catch (error) {
    next(error);
  }
});

export default userRouter;
