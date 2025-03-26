import { STATUS_DEVIS } from "../../../models/Devis.js";
import Services_details_in_devis from "../../../models/Services_details_in_devis.js";

const MESSAGES = {
  ERROR_ON_SAVE: "Erreur lors de la création des détails des services ",
};
/**
 * Crée les détails des services pour un devis.
 *
 * @param {Array<any>} services - Les IDs des services.
 * @returns {Promise<Array<Object>>} Les détails des services créés.
 * @throws {Error} Si une erreur se produit lors de la création des détails des services.
 */
export const createServicesDetails = async (services) => {
  try {
    const servicesDetails = services.map((service) => ({
      workers: [],
      begin_at: null,
      service: service.id,
      status: STATUS_DEVIS.PENDING,
      quantity: service.quantity,
    }));

    const savedServicesDetails = await Services_details_in_devis.insertMany(servicesDetails);
    return savedServicesDetails;
  } catch (error) {
    throw new Error(`${MESSAGES.ERROR_ON_SAVE} : ${error.message}`);
  }
};

/**
 *
 * @param {Array} servicesDetails
 */
export const getDevisDurationFromService = (servicesDetails) => {
  return servicesDetails.reduce((totalDuration, serviceDetail) => {
    return totalDuration + (serviceDetail.service.default_duration || 0);
  }, 0);
};
