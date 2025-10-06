
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

// Response interceptor - handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    // Suppress noisy console errors for expected conflict (e.g., table already reserved)
    if (status === 409 && (data?.errorCode === 'TABLE_NOT_AVAILABLE' || data?.message)) {
      return Promise.reject(error);
    }
    console.error("API Error:", data || error.message);
    return Promise.reject(error);
  }
);

// API Functions
export const tableApi = {
  // Create new table
  create: async (tableData) => {
    const response = await api.post("/tables", tableData);
    return response.data;
  },

  // Get all tables with optional filtering
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();

    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        if (Array.isArray(filters[key])) {
          filters[key].forEach(value => queryParams.append(key, value));
        } else {
          queryParams.append(key, filters[key]);
        }
      }
    });

    const url = `/tables${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  // Get table by ID
  getById: async (id) => {
    console.log("🔍 Fetching table with ID:", id);
    const response = await api.get(`/tables/${id}`);
    return response.data;
  },

  // Update table
  update: async (id, tableData) => {
    console.log(`API: Updating table ${id} with data:`, tableData);
    const response = await api.put(`/tables/${id}`, tableData);
    console.log("API: Table update response:", response.data);
    return response.data;
  },

  // Delete table
  delete: async (id) => {
    const response = await api.delete(`/tables/${id}`);
    return response.data;
  },

  // Bulk operations
  bulkUpdate: async (tableIds, updates) => {
    const response = await api.put("/tables/bulk", { tableIds, updates });
    return response.data;
  },

  bulkDelete: async (tableIds) => {
    const response = await api.delete("/tables/bulk", { data: { tableIds } });
    return response.data;
  },

  // Analytics
  getAnalytics: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get("/tables/analytics", { params });
    return response.data;
  },

  // Get available tables for reservation
  getAvailable: async (criteria = {}) => {
    const queryParams = new URLSearchParams();

    Object.keys(criteria).forEach(key => {
      if (criteria[key] !== null && criteria[key] !== undefined && criteria[key] !== '') {
        queryParams.append(key, criteria[key]);
      }
    });

    const url = `/tables/available${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  // Transfer table assignment
  transferTable: async (tableId, newTableId, reason) => {
    const response = await api.put(`/tables/${tableId}/transfer`, {
      newTableId,
      reason
    });
    return response.data;
  },

  // Get maintenance history
  getMaintenanceHistory: async (tableId, limit = 10) => {
    const response = await api.get(`/tables/${tableId}/maintenance`, {
      params: { limit }
    });
    return response.data;
  },

  // Export tables data
  exportTables: async (format = 'csv', filters = {}) => {
    const queryParams = new URLSearchParams({ format });

    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });

    const response = await api.get(`/tables/export?${queryParams.toString()}`, {
      responseType: 'blob' // Important for file downloads
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tables-export.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true, message: 'Export completed' };
  },

  // Advanced search and filtering
  search: async (searchCriteria) => {
    const queryParams = new URLSearchParams();

    // Handle search term
    if (searchCriteria.search) {
      queryParams.append('search', searchCriteria.search);
    }

    // Handle filters
    if (searchCriteria.filters) {
      Object.keys(searchCriteria.filters).forEach(key => {
        if (searchCriteria.filters[key] !== null &&
            searchCriteria.filters[key] !== undefined &&
            searchCriteria.filters[key] !== '') {
          queryParams.append(key, searchCriteria.filters[key]);
        }
      });
    }

    // Handle sorting
    if (searchCriteria.sortBy) {
      queryParams.append('sortBy', searchCriteria.sortBy);
      queryParams.append('sortOrder', searchCriteria.sortOrder || 'asc');
    }

    // Handle pagination
    if (searchCriteria.page) {
      queryParams.append('page', searchCriteria.page);
    }
    if (searchCriteria.limit) {
      queryParams.append('limit', searchCriteria.limit);
    }

    const url = `/tables/search${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  // Get table statistics
  getStatistics: async () => {
    const response = await api.get("/tables/statistics");
    return response.data;
  },

  // Update table status with validation
  updateStatus: async (tableId, status, additionalData = {}) => {
    const response = await api.put(`/tables/${tableId}/status`, {
      status,
      ...additionalData
    });
    return response.data;
  },

  // Get tables by section
  getBySection: async (section) => {
    const response = await api.get(`/tables/section/${section}`);
    return response.data;
  },

  // Get tables by capacity range
  getByCapacity: async (minCapacity, maxCapacity) => {
    const response = await api.get(`/tables/capacity`, {
      params: { min: minCapacity, max: maxCapacity }
    });
    return response.data;
  },

  // Get table performance metrics
  getPerformance: async (tableId) => {
    const response = await api.get(`/tables/${tableId}/performance`);
    return response.data;
  },

  // Update table priority
  updatePriority: async (tableId, priority) => {
    const response = await api.put(`/tables/${tableId}/priority`, { priority });
    return response.data;
  },

  // Get tables requiring maintenance
  getMaintenanceRequired: async () => {
    const response = await api.get("/tables/maintenance/required");
    return response.data;
  },

  // Schedule maintenance for table
  scheduleMaintenance: async (tableId, maintenanceData) => {
    const response = await api.post(`/tables/${tableId}/maintenance`, maintenanceData);
    return response.data;
  },

  // Get table utilization report
  getUtilizationReport: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get("/tables/utilization", { params });
    return response.data;
  }
};

export default api;
