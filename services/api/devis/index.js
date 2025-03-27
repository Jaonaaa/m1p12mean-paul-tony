import MyError from "../../../models/app/MyError.js";
import Devis, { STATUS_DEVIS } from "../../../models/Devis.js";
import { PAYMENT_METHODS, PAYMENT_STATUSES } from "../../../models/Payment.js";
import { convertToGMT, isBefore } from "../../../utils/date.js";
import { formatUser } from "../../auth/user.js";
import { createPayment } from "../payment/index.js";
import { createWork } from "./work/index.js";

const MESSAGES = {
  DEVIS_ALREADY_ACCEPTED: "Le devis a déja été confirmé.",
  DEVIS_START_CAN_NOT_BE_BEFORE: "Le devis ne peut pas commencer avant la date de la création du devis.",
  DEVIS_NOT_ALLOWED_TO_START: "Vous ne pouvez pas démarrer ce devis.",
  DEVIS_NOT_FOUND: "Devis non existant",
  DEVIS_ARRAY_NULL: "Le tableau de devis est null",
};

/**
 * Obtient la durée d'un devis.
 *
 * @param {string} devis_id - L'ID du devis.
 * @returns {Promise<number>} La durée totale du devis en heures.
 */
export async function getDevisDuration(devis_id) {
  const devis = await Devis.findById(devis_id).populate({
    path: "services_details",
    populate: {
      path: "service",
    },
  });
  const durationHour = devis.services_details.reduce((sum, serviceDetail) => sum + serviceDetail.service.default_duration, 0);
  return durationHour;
}

/**
 * Démarre un devis s'il n'est pas déjà en cours.
 *
 * @param {string} devis_id - L'ID du devis.
 * @param {string} begin_at - Le temps ou le devis commence
 * @returns {Promise<Object>} Le devis mis à jour.
 * @throws {Error} Si le devis est déjà en cours.
 */
export async function confirmDevis(devis_id, begin_at) {
  const devis = await Devis.findById(devis_id);

  if (!devis) throw new MyError(MESSAGES.DEVIS_NOT_FOUND);

  if (isBefore(begin_at, convertToGMT(devis.created_at, -3))) throw new MyError(MESSAGES.DEVIS_START_CAN_NOT_BE_BEFORE);

  if (devis.status === STATUS_DEVIS.ACCEPTED) throw new MyError(MESSAGES.DEVIS_ALREADY_ACCEPTED);

  devis.status = STATUS_DEVIS.ACCEPTED;
  const updatedDevis = await devis.save();

  await createWork(updatedDevis._id, begin_at);
  await createPayment(
    updatedDevis.id_client,
    updatedDevis,
    begin_at,
    updatedDevis.price_total,
    PAYMENT_METHODS.CREDIT_CARD,
    PAYMENT_STATUSES.PAID
  );

  return updatedDevis;
}

/**
 * Formate les informations du client dans un tableau de devis.
 *
 * @param {Array<Object>} devisArray - Le tableau de devis.
 * @returns {Array<Object>} Le tableau formaté de devis.
 */
export function formatClientInDevis(devisArray) {
  if (!devisArray) throw new MyError(MESSAGES.DEVIS_ARRAY_NULL);
  return devisArray.map((devis) => {
    devis.id_client = formatUser(devis.id_client);
    return devis;
  });
}

export async function updateDevisStatus(id_devis, status, status_needed) {
  const devis = await Devis.findById(id_devis);
  if (!devis) throw new MyError(MESSAGES.DEVIS_NOT_FOUND);
  if (devis.status == status_needed) {
    devis.status = status;
    return await devis.save();
  }
  return devis;
}
