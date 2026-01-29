import axios from "axios";

const api = axios.create({
  baseURL: "https://69760224c0c36a2a994ffdb4.mockapi.io",
  timeout: 5000,
});

// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 403) alert("403: Access Denied");
    else if (status === 404) alert("404: Resource Not Found");
    else if (status === 500) alert("500: Server Error");
    else alert("Network Error");

    return Promise.reject(error);
  }
);

export default api;
