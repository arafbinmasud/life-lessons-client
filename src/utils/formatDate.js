const DATE_TIME_OPTIONS = {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
};

export const formatDateTime = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString("en-GB", DATE_TIME_OPTIONS);
};

export const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB");
};
