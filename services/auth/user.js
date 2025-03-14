import { hash } from "bcrypt";
import MyError from "../../models/app/MyError.js";
import { ROLES } from "../../models/Role.js";
import User from "../../models/User.js";
import { findRole } from "../../routes/api/role.js";
import { getCloudinaryUrl } from "../api/user/upload/index.js";

const MESSAGES = {
  INVALID_EMAIL_FORMAT: "Format de l'email invalide",
  PASSWORD_TOO_SHORT: "Le mot de passe doit contenir au moins 8 caractères",
};

export function validateUser(user) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const minPasswordLength = 8;

  if (!emailRegex.test(user.email)) {
    throw new MyError(MESSAGES.INVALID_EMAIL_FORMAT);
  }

  if (user.password.length < minPasswordLength) {
    throw new MyError(MESSAGES.PASSWORD_TOO_SHORT);
  }
}

export async function registerUser(user, role = ROLES.CLIENT) {
  const { password, ...userData } = user;

  const hashedPassword = await hash(password, 10);
  const clientRole = await findRole(role);

  const new_user = new User({ ...userData, password: hashedPassword, role: clientRole._id });
  const saved_user = await new_user.save();
  return { user: formatUser(saved_user), role: clientRole.label };
}

export function formatUser(user) {
  return {
    _id: user._id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    picture: getCloudinaryUrl(user.picture),
  };
}
