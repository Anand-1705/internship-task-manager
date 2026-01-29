export const formatDateTime = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString();
};
