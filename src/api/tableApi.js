
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";
const tempToken = import.meta.env.VITE_TEMP_TOKEN;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    if (tempToken) {
      config.headers.Authorization = `Bearer ${tempToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API Functions
export const tableApi = {
  // Create new table
  create: async (tableData) => {
    const response = await api.post("/tables", tableData);
    return response.data;
  },

  // Get all tables
  getAll: async () => {
    const response = await api.get("/tables");
    return response.data;
  },

  // Get table by ID
  getById: async (id) => {
    const response = await api.get(`/tables/${id}`);
    return response.data;
  },

  // Update table
  update: async (id, tableData) => {
    const response = await api.put(`/tables/${id}`, tableData);
    return response.data;
  },

  // Delete table
  delete: async (id) => {
    const response = await api.delete(`/tables/${id}`);
    return response.data;
  },
};

export default api;