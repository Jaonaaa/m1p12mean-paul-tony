import { Schema, model } from "mongoose";

const payementSchema = new Schema(
  {
    id_client: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id_devis: { type: Schema.Types.ObjectId, ref: "Devis", required: true },
    montant: { type: Number, required: true },
    date_paiement: { type: Date, required: true },
    methode_paiement: { type: String, required: true },
    statut: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default model("Payement", payementSchema);
