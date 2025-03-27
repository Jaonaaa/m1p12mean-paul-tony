import MyError from "../models/app/MyError.js";

/**
 * Paginates the results of a Mongoose model query.
 *
 * @param {import('mongoose').Model} Model - The Mongoose model to paginate.
 * @param {number} [page=1] - The page number to retrieve.
 * @param {number} [limit=10] - The number of documents per page.
 * @param {Object} [filter={}] - The filter criteria for the query.
 * @param {string | Object | Array} [populate] - The fields to populate.
 * @param {Object} [sort={}] - The sorting criteria for the query.
 * @returns {Promise<Object>} The paginated results.
 * @throws {MyError} If an error occurs during pagination.
 */
export const paginate = async (Model, page = 1, limit = 10, filter = {}, populate, sort = {}) => {
  try {
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const skip = (page - 1) * limit;
    const totalDocuments = await Model.countDocuments(filter);
    const totalPages = Math.ceil(totalDocuments / limit);
    let query = Model.find(filter).sort(sort).skip(skip).limit(limit);

    if (populate) {
      query = query.populate(populate);
    }

    const data = await query;

    return {
      data,
      totalDocuments,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };
  } catch (error) {
    throw new MyError(error.message);
  }
};
