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
  // Get all reservations with optional filters (admin only)
  getAll: async (params = {}) => {
    // Ensure type is always provided for backend compatibility
    const queryParams = { type: "restaurant", ...params };
    console.log("Fetching reservations with params:", queryParams);
    const response = await api.get("/reservations/", { params: queryParams });
    console.log("API Response:", response.data);
    // Handle different response structures
    return response.data.items || response.data.data || response.data || [];
  },

  // Get single reservation by type and ID
  getById: async (type, id) => {
    // If type is not provided, default to 'restaurant'
    // Map 'bar' type to 'restaurant' since they use the same route
    const reservationType = type === 'bar' ? 'restaurant' : (type || 'restaurant');
    console.log(`Fetching reservation with type: ${reservationType}, id: ${id}`);
    const response = await api.get(`/reservations/${reservationType}/${id}`);
    return response.data;
  },

  // Create new reservation by type
  create: async (type, reservationData) => {
    const response = await api.post(`/reservations/restaurant`, reservationData);
    return response.data;
  },

  // Update reservation
  update: async (type, id, reservationData) => {
    console.log(`API: Updating reservation ${id} with data:`, reservationData);
    // Map 'bar' type to 'restaurant' since they use the same route
    const mappedType = type === 'bar' ? 'restaurant' : type;
    const response = await api.put(`/reservations/${mappedType}/${id}`, reservationData);
    console.log("API: Reservation update response:", response.data);
    return response.data;
  },

  // Update reservation status (admin only)
  updateStatus: async (type, id, status) => {
    // Map 'bar' type to 'restaurant' since they use the same route
    const mappedType = type === 'bar' ? 'restaurant' : type;
    const response = await api.put(`/reservations/${mappedType}/${id}/status`, { status });
    return response.data;
  },

  // Delete reservation (admin only)
  delete: async (type, id) => {
    // Map 'bar' type to 'restaurant' since they use the same route
    const mappedType = type === 'bar' ? 'restaurant' : type;
    const response = await api.delete(`/reservations/${mappedType}/${id}`);
    return response.data;
  },

  // Get reservations by date range
  getByDateRange: async (startDate, endDate, type = "restaurant") => {
    const params = { startDate, endDate, type };
    const response = await api.get("/reservations/", { params });
    return response.data;
  },

  // Search reservations
  search: async (query, type = "restaurant") => {
    const params = { search: query, type };
    const response = await api.get("/reservations/", { params });
    return response.data;
  },
};

export default api;
