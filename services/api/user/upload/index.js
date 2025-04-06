import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

const { CLOUDINARY_KEY, CLOUDINARY_SECRET, CLOUDINARY_CLOUD_NAME } = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
});

/**
 * @param {String} public_id
 * @returns {String}
 */
export function getCloudinaryUrl(public_id, options = {}) {
  return cloudinary.url(public_id, {
    transformation: [{ fetch_format: "auto" }, { quality: "auto" }, options],
  });
}

/**
 * @param {String[]} publicIds
 * @returns {String[]}
 */
export function getCloudinaryUrls(publicIds, options = {}) {
  return publicIds.map((public_id) => getCloudinaryUrl(public_id, options));
}

/**
 * @param {string} base64
 * @returns {Promise<string>}
 */
async function uploadBase64ToCloudinary(base64) {
  const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64}`);
  return result.public_id;
}

export default uploadBase64ToCloudinary;
