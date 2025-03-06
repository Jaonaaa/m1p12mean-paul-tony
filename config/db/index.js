import { connect } from "mongoose";

// Connexion à MongoDB
// MONGO_URI_PROD
// MONGO_URI
/**
 * @returns {Promise<Mongoose>}
 */
export const dbConnection = async () => {
  return connect(process.env.MONGO_URI, {})
    .then(() => {
      console.log("Connect to db");
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};
