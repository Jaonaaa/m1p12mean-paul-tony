import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    id_client: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id_devis: { type: Schema.Types.ObjectId, ref: "Devis", required: true },
    amount: { type: Number, required: true },
    date_payment: { type: Date, required: true },
    methode_payment: { type: String, required: true },
    status: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const PAYMENT_STATUSES = {
  PAID: "paid",
  UNPAID: "unpaid",
};

export const PAYMENT_METHODS = {
  CREDIT_CARD: "card",
};

export default model("Payment", paymentSchema);
