import { formatUser } from "../../auth/user.js";

export const formatClientVehicle = (clientVehicleData) => {
  let client = clientVehicleData.id_client;
  if (!client) return clientVehicleData;
  clientVehicleData.id_client = formatUser(client);

  return clientVehicleData;
};
