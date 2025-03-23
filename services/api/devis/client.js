import MyError from "../../../models/app/MyError.js";
import Devis, { STATUS_DEVIS } from "../../../models/Devis.js";
import { convertToGMT, isValidDateTime, now } from "../../../utils/date.js";
import { createServicesDetails, getDevisDurationFromService } from "./service_details.js";

const MESSAGES = {
  SERVICES_REQUIRED: "Le devis doit inclure au moins un service.",
  CLIENT_ID_REQUIRED: "Le devis doit inclure l'ID du client.",
  PRICE_TOTAL_REQUIRED: "Le devis doit inclure le prix total.",
  VEHICLE_ID_REQUIRED: "Le devis doit inclure l'ID du véhicule du client.",
  LABEL_REQUIRED: "Le devis doit inclure le label.",
  DATE_FORMAT_INCORRECT: "Le format de la date n'est pas correct.",
  FUTURE_DATE: "La date choisie ne peut pas être antérieure à aujourd'hui.",
};

/**
 *
 * @param {Object} devisData
 * @param {Array<string>} devisData.services
 * @param {string} devisData.id_client
 * @param {number} devisData.price_total
 * @param {Date} devisData.created_at
 * @param {string} devisData.status
 * @param {string} devisData.id_vehicle
 * @param {string} devisData.label
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const createDevis = async (devisData) => {
  try {
    checkDevis(devisData);
    const devis = formatNewDevis(devisData);
    const detailsServices = await createServicesDetails(devisData.services);
    const durationHour = getDevisDurationFromService(detailsServices);

    devis.services_details = detailsServices;
    devis.expected_duration = durationHour;

    const newDevis = new Devis(devis);
    const savedDevis = await newDevis.save();

    // Create the work when the devis begin
    return savedDevis;
  } catch (error) {
    throw new Error(`Erreur lors de la création du devis : ${error.message}`);
  }
};

const checkDevis = async (devisData) => {
  if (!devisData.services || devisData.services.length === 0) {
    throw new Error(MESSAGES.SERVICES_REQUIRED);
  }
  if (!devisData.id_client) {
    throw new Error(MESSAGES.CLIENT_ID_REQUIRED);
  }
  if (!devisData.price_total || devisData.price_total < 0) {
    throw new Error(MESSAGES.PRICE_TOTAL_REQUIRED);
  }
  if (!devisData.id_vehicle) {
    throw new Error(MESSAGES.VEHICLE_ID_REQUIRED);
  }
  if (!devisData.label) {
    throw new Error(MESSAGES.LABEL_REQUIRED);
  }
};

const formatNewDevis = (devisData) => {
  const create_at = checkCreateDate(devisData);

  return {
    id_client: devisData.id_client,
    price_total: devisData.price_total,
    created_at: create_at,
    status: STATUS_DEVIS.PENDING,
    id_vehicle: devisData.id_vehicle,
    label: devisData.label,
  };
};

const checkCreateDate = (devis) => {
  const isValid = isValidDateTime(devis.created_at);
  const created_dateTime = convertToGMT(devis.created_at);

  if (!isValid) throw new Error(MESSAGES.DATE_FORMAT_INCORRECT);
  if (now() > created_dateTime) throw new Error(MESSAGES.FUTURE_DATE);
  return created_dateTime;
};

export default createDevis;
