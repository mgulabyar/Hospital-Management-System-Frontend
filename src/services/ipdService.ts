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
  (error) => Promise.reject(error),
);

export const hmsIPDServices = {
  getIPDDashboard: async () => {
    const response = await apiClient.get("/ipd/dashboard");
    return response.data;
  },

  getWards: async (activeOnly = false) => {
    const response = await apiClient.get(
      activeOnly ? "/ipd/wards?activeOnly=true" : "/ipd/wards",
    );

    return response.data;
  },

  createWard: async (payload: any) => {
    const response = await apiClient.post("/ipd/wards", payload);
    return response.data;
  },

  updateWard: async (wardId: string, payload: any) => {
    const response = await apiClient.put(`/ipd/wards/${wardId}`, payload);
    return response.data;
  },

  addBedToWard: async (wardId: string, bedNumber: string) => {
    const response = await apiClient.post(`/ipd/wards/${wardId}/beds`, {
      bedNumber,
    });

    return response.data;
  },

  updateBedStatus: async (
    wardId: string,
    bedId: string,
    status: "Available" | "Maintenance",
  ) => {
    const response = await apiClient.put(
      `/ipd/wards/${wardId}/beds/${bedId}/status`,
      {
        status,
      },
    );

    return response.data;
  },

  getIPDAdmissions: async (filters?: {
    status?: string;
    ward?: string;
    patient?: string;
    doctor?: string;
  }) => {
    const searchParams = new URLSearchParams();

    if (filters?.status) {
      searchParams.set("status", filters.status);
    }

    if (filters?.ward) {
      searchParams.set("ward", filters.ward);
    }

    if (filters?.patient) {
      searchParams.set("patient", filters.patient);
    }

    if (filters?.doctor) {
      searchParams.set("doctor", filters.doctor);
    }

    const queryString = searchParams.toString();

    const response = await apiClient.get(
      queryString ? `/ipd/admissions?${queryString}` : "/ipd/admissions",
    );

    return response.data;
  },

  createIPDAdmission: async (payload: any) => {
    const response = await apiClient.post("/ipd/admissions", payload);
    return response.data;
  },

  dischargePatient: async (admissionId: string, dischargeSummary: string) => {
    const response = await apiClient.put(
      `/ipd/admissions/${admissionId}/discharge`,
      {
        dischargeSummary,
      },
    );

    return response.data;
  },
};
