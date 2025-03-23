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
