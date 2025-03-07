import { connect } from "mongoose";

// MONGO_URI_PROD
// MONGO_URI
/**
 * @returns {Promise<Mongoose>}
 */
export const dbConnection = async ({ prod = true }) => {
  let uri = prod ? process.env.MONGO_URI_PROD : process.env.MONGO_URI;
  return connect(uri, {})
    .then(() => {
      console.log("Connect to db");
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};
