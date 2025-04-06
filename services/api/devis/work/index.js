import MyError from "../../../../models/app/MyError.js";
import { STATUS_DEVIS } from "../../../../models/Devis.js";
import Services_details_in_devis from "../../../../models/Services_details_in_devis.js";
import Work from "../../../../models/Work.js";
import { convertToGMT, isBeforeNow } from "../../../../utils/date.js";
import { getDevisDuration } from "../index.js";

const MESSAGES = {
  FUTURE_DATE: "La date choisie ne peut pas être antérieure à aujourd'hui.",
  INVALID_DATE: "Données requise non fournis",
};

export const createWork = async (devis_id, begin_at) => {
  if (!devis_id || !begin_at) throw new MyError(MESSAGES.INVALID_DATE);
  if (isBeforeNow(begin_at)) throw new MyError(MESSAGES.FUTURE_DATE);

  const durationDevis = await getDevisDuration(devis_id);
  const begin_at_datetime = convertToGMT(begin_at);

  const expected_end = new Date(begin_at_datetime);
  expected_end.setHours(begin_at_datetime.getHours() + durationDevis);

  const work = new Work({
    id_devis: devis_id,
    begin_at: begin_at_datetime,
    expected_end,
    progress: 0.0,
  });
  await work.save();
  return work;
};

export const updateDevisProgress = async (id_devis) => {
  const tasks = await Services_details_in_devis.find({ id_devis: id_devis });
  const finished = tasks.filter((task) => task.status == STATUS_DEVIS.COMPLETED).length;
  const total = tasks.length;
  const progress = Math.round((finished / total) * 100);
  await Work.updateOne({ id_devis: id_devis }, { progress: progress });
};
