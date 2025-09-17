// src/api/reservations.js
import axios from "axios";

// Base URL - replace with your actual backend URL
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";
const tempToken = import.meta.env.VITE_TEMP_TOKEN;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token if needed
api.interceptors.request.use(
  (config) => {
    // Use tempToken from env, localStorage is commented out as requested
    // const token = localStorage.getItem("token") || tempToken;
    const token = tempToken; // ← Only use tempToken, localStorage disabled

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      // localStorage.removeItem("token"); // ← Commented out as requested
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API Functions
export const reservationApi = {
  // Get all restaurant reservations with optional filters
  getAll: async (params = {}) => {
    const response = await api.get("/reservations/restaurant", { params });
    return response.data;
  },

  // Get single reservation by ID
  getById: async (id) => {
    const response = await api.get(`/reservations/restaurant/${id}`);
    return response.data;
  },

  // Create new reservation
  create: async (reservationData) => {
    const response = await api.post("/reservations/restaurant", reservationData);
    return response.data;
  },

  // Update reservation
  update: async (id, reservationData) => {
    const response = await api.put(`/reservations/restaurant/${id}`, reservationData);
    return response.data;
  },

  // Delete reservation
  delete: async (id) => {
    const response = await api.delete(`/reservations/restaurant/${id}`);
    return response.data;
  },

  // Get reservations by date range
  getByDateRange: async (startDate, endDate) => {
    const response = await api.get("/reservations/date-range", {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Search reservations
  search: async (query) => {
    const response = await api.get("/reservations/search", {
      params: { q: query },
    });
    return response.data;
  },
};

export default api;