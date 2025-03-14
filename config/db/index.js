import { connect } from "mongoose";

const MESSAGES = {
  CONNECTED: "Connected to database",
  ERROR: "Error connecting to database",
};
// MONGO_URI_PROD
// MONGO_URI
/**
 * @returns {Promise<Mongoose>}
 */
export const dbConnection = async ({ prod = true }) => {
  let uri = prod ? process.env.MONGO_URI_PROD : process.env.MONGO_URI;
  return connect(uri, {})
    .then(() => {
      console.log(MESSAGES.CONNECTED);
      return true;
    })
    .catch((err) => {
      console.log(MESSAGES.ERROR + ": ", err);
      return false;
    });
};
