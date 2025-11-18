// lib/axiosClient.ts
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
// Derive the app origin (without /api) for Sanctum cookie endpoint
const API_ORIGIN = API_BASE.replace(/\/?api\/?$/, "");

const axiosClient = axios.create({
  baseURL: `${API_BASE}`,
  withCredentials: true, // Required for cookies
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

// Fetch CSRF cookie on first load
export const initCsrf = async () => {
  try {
    await axios.get(`${API_ORIGIN}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
    console.log("CSRF cookie fetched");
  } catch (error) {
    console.error("Failed to fetch CSRF cookie:", error);
  }
};

// Auto-add X-XSRF-TOKEN and Authorization headers
axiosClient.interceptors.request.use((config) => {
  const xsrfToken = getCookie("XSRF-TOKEN");
  if (xsrfToken) {
    config.headers["X-XSRF-TOKEN"] = xsrfToken;
  }
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(";").shift() || "");
  return null;
}

export default axiosClient;