import MyError from "../../../models/app/MyError.js";
import { STATUS_DEVIS } from "../../../models/Devis.js";
import Services_details_in_devis from "../../../models/Services_details_in_devis.js";

const MESSAGES = {
  ERROR_ON_SAVE: "Erreur lors de la création des détails des services ",
  ERROR_ON_ASSIGN: "Erreur pendant l'assignation du travail",
  NO_EMP: `Aucun employé n'a été sélectionné`,
  TASK_NOT_FOUND: "Travail non trouvé",
};
/**
 * Crée les détails des services pour un devis.
 *
 * @param {Array<any>} services - Les IDs des services.
 * @returns {Promise<Array<Object>>} Les détails des services créés.
 * @throws {Error} Si une erreur se produit lors de la création des détails des services.
 */
export const createServicesDetails = async (services, id_devis) => {
  try {
    const servicesDetails = services.map((service) => ({
      workers: [],
      begin_at: null,
      service: service.id,
      status: STATUS_DEVIS.PENDING,
      quantity: service.quantity,
      id_devis,
    }));

    const savedServicesDetails = await Services_details_in_devis.insertMany(servicesDetails);
    for (const element of savedServicesDetails) {
      const service_detail = await Services_details_in_devis.findById(element._id).populate("service");
      element.service = service_detail.service;
    }
    return savedServicesDetails;
  } catch (error) {
    throw new Error(`${MESSAGES.ERROR_ON_SAVE} : ${error.message}`);
  }
};

export const updateServicesDetails = async (servicesDetails, id_devis) => {
  try {
    for (const service of servicesDetails) {
      service.id_devis = id_devis;
    }
    await Services_details_in_devis.updateMany(
      { _id: { $in: servicesDetails.map((service) => service._id) } },
      { $set: { id_devis: id_devis } }
    );
    return servicesDetails;
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

export const assignTask = async (id_serviceDetail, employes) => {
  try {
    if (!employes.length) throw new MyError(MESSAGES.NO_EMP);

    const serviceDetail = await Services_details_in_devis.findByIdAndUpdate(
      id_serviceDetail,
      { $set: { workers: employes } },
      { new: true }
    );

    if (!serviceDetail) throw new MyError(MESSAGES.TASK_NOT_FOUND, 404);

    return serviceDetail;
  } catch (error) {
    throw new Error(`${MESSAGES.ERROR_ON_ASSIGN} : ${error.message}`);
  }
};
