import axios from "axios";

const baseURL = (import.meta.env.VITE_API_URL || "https://frontend-z3na.vercel.app//api").replace(/\/$/, "");

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("phishscale_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("phishscale_token");
      localStorage.removeItem("phishscale_user");
    }
    return Promise.reject(error);
  }
);

export const apiBase = baseURL;
export default api;
