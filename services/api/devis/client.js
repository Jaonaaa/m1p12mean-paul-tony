import MyError from "../../../models/app/MyError.js";
import ClientVehicle from "../../../models/ClientVehicle.js";
import Devis, { STATUS_DEVIS } from "../../../models/Devis.js";
import { convertToGMT, isBeforeNow, isValidDateTime } from "../../../utils/date.js";
import { getTotalPrice } from "../service/index.js";
import { createServicesDetails, getDevisDurationFromService, updateServicesDetails } from "./service_details.js";

const MESSAGES = {
  ERROR_ON_DEVIS: "Erreur lors de la création du devis",
  SERVICES_REQUIRED: "Le devis doit inclure au moins un service.",
  CLIENT_ID_REQUIRED: "Le devis doit inclure l'ID du client.",
  PRICE_TOTAL_REQUIRED: "Le devis doit inclure le prix total.",
  VEHICLE_ID_REQUIRED: "Le devis doit inclure l'ID du véhicule du client.",
  LABEL_REQUIRED: "Le devis doit inclure le label.",
  DATE_FORMAT_INCORRECT: "Le format de la date n'est pas correct.",
  FUTURE_DATE: "La date choisie ne peut pas être antérieure à aujourd'hui.",
  QUANTITY_INVALID: "La quantité du service est invalide",
  VEHICLE_NOT_FOUND: "Véhicule non trouvé",
  WRONG_OWNER: "Ce n'est pas un véhicule de ce client",
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
 * @throws {MyError}
 */
export const createDevis = async (devisData) => {
  try {
    await checkDevis(devisData);
    const devis = formatNewDevis(devisData);
    const detailsServices = await createServicesDetails(devisData.services);
    const durationHour = getDevisDurationFromService(detailsServices);

    devis.services_details = detailsServices;
    devis.expected_duration = durationHour;
    devis.price_total = await getTotalPrice(devisData.services);

    const newDevis = new Devis(devis);
    const savedDevis = await newDevis.save();

    updateServicesDetails(detailsServices, savedDevis._id);
    // Create the work when the devis begin
    return savedDevis;
  } catch (error) {
    throw new MyError(`${MESSAGES.ERROR_ON_DEVIS} : ${error.message}`);
  }
};

const checkDevis = async (devisData) => {
  if (!devisData.services || devisData.services.length === 0) {
    throw new MyError(MESSAGES.SERVICES_REQUIRED);
  }

  for (let i = 0; i < devisData.services.length; i++) {
    if (+devisData.services[i].quantity <= 0) {
      throw new MyError(MESSAGES.QUANTITY_INVALID);
    }
  }

  if (!devisData.id_client) {
    throw new MyError(MESSAGES.CLIENT_ID_REQUIRED);
  }
  if (!devisData.id_vehicle) {
    throw new MyError(MESSAGES.VEHICLE_ID_REQUIRED);
  }
  if (!devisData.label) {
    throw new MyError(MESSAGES.LABEL_REQUIRED);
  }

  const clientVehicle = await ClientVehicle.findById(devisData.id_vehicle);
  if (!clientVehicle) throw new MyError(MESSAGES.VEHICLE_NOT_FOUND);
  if (clientVehicle.id_client != devisData.id_client) throw new MyError(MESSAGES.WRONG_OWNER);
};

const formatNewDevis = (devisData) => {
  const create_at = checkCreateDate(devisData);

  return {
    id_client: devisData.id_client,
    created_at: create_at,
    status: STATUS_DEVIS.PENDING,
    id_vehicle: devisData.id_vehicle,
    label: devisData.label,
  };
};

const checkCreateDate = (devis) => {
  const isValid = isValidDateTime(devis.created_at);
  const created_dateTime = convertToGMT(devis.created_at);
  if (!isValid) throw new MyError(MESSAGES.DATE_FORMAT_INCORRECT);
  if (isBeforeNow(devis.created_at)) throw new MyError(MESSAGES.FUTURE_DATE);
  return created_dateTime;
};

export default createDevis;
