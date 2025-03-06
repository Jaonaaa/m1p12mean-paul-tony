import { Router } from "express";
import User from "../../models/User.js";
var userRouter = Router();

userRouter.get("/all", async (req, res) => {
  const roles = await User.find().select("-password -email");
  res.json(roles);
});

// userRouter.put("/:id", async (req, res) => {
//   const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
//   res.json(role);
// });

// userRouter.delete("/:id", async (req, res) => {
//   await Role.findByIdAndDelete(req.params.id);
//   res.json({ message: "Role supprimé" });
// });

export default userRouter;
