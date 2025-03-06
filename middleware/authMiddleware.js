import jwt from "jsonwebtoken";

/**
 * @typedef {Object} UserRole
 * @property {string} _id
 * @property {string} label
 */

/**
 * @typedef {Object} JwtPayload
 * @property {string} userId
 * @property {string} email
 * @property {string} firstname
 * @property {string} lastname
 * @property {UserRole} role
 * @property {number} iat
 * @property {number} exp
 */

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "T'es pas autorisé a voir ca XDD" });
  /**
   * @param {jwt.VerifyErrors | null} err
   * @param {JwtPayload} payload
   */
  const handleVerification = (err, payload) => {
    if (err) return res.status(403).json({ message: "Token invalide" });
    // Verifie le 'Role' dans le payload pour certain accesibilité de ressource
    req.jwt = payload;
    next();
  };
  jwt.verify(token, process.env.JWT_KEY, handleVerification);
};

export default authenticateToken;
