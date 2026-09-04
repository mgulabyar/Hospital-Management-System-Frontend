/* eslint-disable @typescript-eslint/no-explicit-any */

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
  (error) => {
    return Promise.reject(error);
  },
);

export const hmsServices = {
  auth: {
    login: async (payload: any) => {
      const response = await apiClient.post("/auth/login", payload);
      return response.data;
    },
  },

  billing: {
    getDashboardAnalytics: async () => {
      const response = await apiClient.get("/billing/dashboard-analytics");
      return response.data;
    },
  },

  departments: {
    getAllDepartments: async (activeOnly = false) => {
      const url = activeOnly ? "/departments?activeOnly=true" : "/departments";

      const response = await apiClient.get(url);
      return response.data;
    },

    createDepartment: async (payload: any) => {
      const response = await apiClient.post("/departments", payload);
      return response.data;
    },

    updateDepartment: async (id: string, payload: any) => {
      const response = await apiClient.put(`/departments/${id}`, payload);
      return response.data;
    },

    toggleDepartmentStatus: async (id: string) => {
      const response = await apiClient.patch(
        `/departments/${id}/toggle-status`,
      );
      return response.data;
    },
  },

  staff: {
    getAllStaff: async (
      roleQuery?: string,
      departmentId?: string,
      activeOnly = false,
    ) => {
      const searchParams = new URLSearchParams();

      if (roleQuery) {
        searchParams.set("role", roleQuery);
      }

      if (departmentId) {
        searchParams.set("department", departmentId);
      }

      if (activeOnly) {
        searchParams.set("activeOnly", "true");
      }

      const queryString = searchParams.toString();

      const url = queryString ? `/staff?${queryString}` : "/staff";

      const response = await apiClient.get(url);
      return response.data;
    },

    createStaffAccount: async (payload: any) => {
      const response = await apiClient.post("/staff", payload);
      return response.data;
    },

    updateStaffAccount: async (id: string, payload: any) => {
      const response = await apiClient.put(`/staff/${id}`, payload);
      return response.data;
    },

    deleteStaffAccount: async (id: string) => {
      const response = await apiClient.delete(`/staff/${id}`);
      return response.data;
    },

    toggleStaffStatus: async (id: string) => {
      const response = await apiClient.put(`/staff/${id}/status`);
      return response.data;
    },
  },
};
