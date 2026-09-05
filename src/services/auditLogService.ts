import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const savedSession = localStorage.getItem("hms_user_session");

    if (savedSession) {
      const { token } = JSON.parse(savedSession);

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export const hmsAuditLogServices = {
  getAuditLogs: async (filters?: {
    module?: string;
    status?: string;
    role?: string;
    user?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();

    if (filters?.module) {
      searchParams.set("module", filters.module);
    }

    if (filters?.status) {
      searchParams.set("status", filters.status);
    }

    if (filters?.role) {
      searchParams.set("role", filters.role);
    }

    if (filters?.user) {
      searchParams.set("user", filters.user);
    }

    if (filters?.startDate) {
      searchParams.set("startDate", filters.startDate);
    }

    if (filters?.endDate) {
      searchParams.set("endDate", filters.endDate);
    }

    if (filters?.search?.trim()) {
      searchParams.set("search", filters.search.trim());
    }

    if (filters?.limit) {
      searchParams.set("limit", String(filters.limit));
    }

    const queryString = searchParams.toString();

    const response = await apiClient.get(
      queryString ? `/audit-logs?${queryString}` : "/audit-logs",
    );

    return response.data;
  },

  getAuditSummary: async () => {
    const response = await apiClient.get("/audit-logs/summary");
    return response.data;
  },
};
