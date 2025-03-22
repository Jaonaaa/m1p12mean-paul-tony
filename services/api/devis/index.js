import { formatUser } from "../../auth/user.js";

export function formatClientInDevis(devisArray) {
  return devisArray.map((devis) => {
    devis.id_client = formatUser(devis.id_client);
    return devis;
  });
}
