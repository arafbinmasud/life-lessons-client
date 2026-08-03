const FALLBACK = "Something went wrong. Please try again.";

// Extracts a human readable message from axios, firebase or generic errors.
export const getErrorMessage = (error, fallback = FALLBACK) => {
  if (!error) return fallback;
  if (typeof error === "string") return error;

  const responseData = error.response?.data;
  if (typeof responseData === "string" && responseData.trim()) {
    return responseData;
  }
  if (responseData?.message) return responseData.message;
  if (responseData?.error) return responseData.error;

  if (error.code === "ERR_NETWORK") {
    return "Network error. Please check your connection and try again.";
  }

  if (error.message) return error.message;
  return fallback;
};

export default getErrorMessage;
