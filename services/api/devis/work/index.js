import MyError from "../../../../models/app/MyError.js";
import Work from "../../../../models/Work.js";
import { convertToGMT, isBeforeNow } from "../../../../utils/date.js";
import { getDevisDuration } from "../index.js";

const MESSAGES = {
  FUTURE_DATE: "La date choisie ne peut pas être antérieure à aujourd'hui.",
  INVALID_DATE: "Données requise non fournis",
};

export const createWork = async (devis_id, begin_at) => {
  if (!devis_id || !begin_at) throw new MyError(INVALID_DATE);
  if (isBeforeNow(begin_at)) throw new MyError(MESSAGES.FUTURE_DATE);

  const durationDevis = await getDevisDuration(devis_id);
  const begin_at_datetime = convertToGMT(begin_at);

  const expected_end = new Date(begin_at_datetime);
  expected_end.setHours(begin_at_datetime.getHours() + durationDevis);

  const work = new Work({
    id_devis: devis_id,
    begin_at_datetime,
    expected_end,
    progress: 0.0,
  });
  await work.save();
  return work;
};
