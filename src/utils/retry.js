export const retryRequest = async (
  apiCall,
  retries = 3,
  delay = 500
) => {
  try {
    return await apiCall();
  } catch (err) {
    if (retries === 0) throw err;
    await new Promise(res => setTimeout(res, delay));
    return retryRequest(apiCall, retries - 1, delay * 2);
  }
};
