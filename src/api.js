import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL?.trim();
const isLocalhost =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const fallbackApiUrl = isLocalhost
  ? "http://localhost:5000/api"
  : "https://phishingscale-project.onrender.com/api";

const baseURL = (rawApiUrl || fallbackApiUrl).replace(/\/+$/, "");

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
