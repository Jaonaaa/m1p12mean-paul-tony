import jwt from "jsonwebtoken";
import { ROLES } from "../models/Role.js";

/**
 * @typedef {Object} UserRole
 * @property {string} _id
 * @property {string} label
 */

/**
 * @typedef {Object} JwtPayload
 * @property {string} _id
 * @property {string} email
 * @property {string} firstname
 * @property {string} lastname
 * @property {UserRole} role
 * @property {number} iat
 * @property {number} exp
 */

const NOT_AUTHORIZED = { message: "T'es pas autorisé a voir ca XDD" };
const INVALID_TOKEN = { message: "Token invalide" };
const MANAGER_ROLE_REQUIRED = { message: "Accès refusé: rôle de manager requis" };
const MECHANIC_ROLE_REQUIRED = { message: "Accès refusé: rôle de mécanicien requis" };

const verifyToken = (req, res, next, roleCheck, roleErrorMessage = NOT_AUTHORIZED) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json(NOT_AUTHORIZED);

  /**
   * @param {jwt.VerifyErrors | null} err
   * @param {JwtPayload} payload
   */
  const handleVerification = (err, payload) => {
    if (err) return res.status(403).json(INVALID_TOKEN);
    if (roleCheck && !roleCheck(payload.role)) {
      return res.status(403).json(roleErrorMessage);
    }
    req.user = payload;
    next();
  };

  jwt.verify(token, process.env.JWT_KEY, handleVerification);
};

const authenticateToken = (req, res, next) => {
  verifyToken(req, res, next);
};

const authenticateManager = (req, res, next) => {
  verifyToken(req, res, next, (role) => role.label === ROLES.MANAGER, MANAGER_ROLE_REQUIRED);
};

const authenticateMechanic = (req, res, next) => {
  verifyToken(req, res, next, (role) => role.label === ROLES.MECANICIEN, MECHANIC_ROLE_REQUIRED);
};

export { authenticateToken, authenticateManager, authenticateMechanic };
