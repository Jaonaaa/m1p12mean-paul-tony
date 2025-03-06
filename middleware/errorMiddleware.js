import Response, { Status } from "../models/app/Response.js";

/**
 *
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
function errorHandler(err, req, res, next) {
  const status = typeof err.status == "number" ? err.status : 500;
  res.status(status).json(new Response(err.message, Status.Error));
}

export default errorHandler;
