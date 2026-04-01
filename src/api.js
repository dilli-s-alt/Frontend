import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL?.trim();
const isLocalhost =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const fallbackApiUrl = isLocalhost ? "http://localhost:5000/api" : "/api";
const productionDirectApiUrl = "https://phishingscale-project.onrender.com/api";

const preferredApiUrl = isLocalhost
  ? rawApiUrl || fallbackApiUrl
  : rawApiUrl && rawApiUrl.startsWith("/")
    ? rawApiUrl
    : fallbackApiUrl;

const baseURL = preferredApiUrl.replace(/\/+$/, "");

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
  async (error) => {
    const originalRequest = error.config;

    const shouldRetryDirect =
      !isLocalhost &&
      originalRequest &&
      !originalRequest.__retriedWithDirectApi &&
      (!error.response || [404, 502, 503, 504].includes(error.response.status)) &&
      String(originalRequest.baseURL || baseURL).startsWith("/api");

    if (shouldRetryDirect) {
      originalRequest.__retriedWithDirectApi = true;
      originalRequest.baseURL = productionDirectApiUrl;
      return api.request(originalRequest);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("phishscale_token");
      localStorage.removeItem("phishscale_user");
    }

    return Promise.reject(error);
  }
);

export const apiBase = baseURL;
export default api;
