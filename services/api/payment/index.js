import Payment from "../../../models/Payment.js";

export const createPayment = (id_client, devis, datePayment, amount, method, status) => {
  const payment = new Payment({
    id_client,
    id_devis: devis,
    date_payment: datePayment,
    amount,
    methode_payment: method,
    status,
  });
  return payment.save();
};
