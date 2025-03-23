export const isValidDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return !isNaN(date.getTime());
};

export const convertToGMT = (utcDateStr, GMT = 3) => {
  const utcDate = new Date(utcDateStr);
  return new Date(utcDate.getTime() + GMT * 60 * 60 * 1000);
};

export const now = (GMT = 3) => {
  const now = new Date();
  return new Date(now.getTime() + GMT * 60 * 60 * 1000);
};

export const isBeforeNow = (date) => {
  const created_dateTime = convertToGMT(date);
  return now() > created_dateTime;
};

export const isBefore = (date1, date2) => {
  const date1_ = convertToGMT(date1);
  const date2_ = convertToGMT(date2);
  return date2_ > date1_;
};
