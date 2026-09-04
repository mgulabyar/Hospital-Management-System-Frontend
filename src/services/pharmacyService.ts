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

export const hmsPharmacyServices = {
  addMedicineToStock: async (payload: any) => {
    const response = await apiClient.post("/pharmacy/inventory", payload);
    return response.data;
  },

  getMedicineInventory: async (filters?: {
    search?: string;
    lowStock?: boolean;
    activeOnly?: boolean;
  }) => {
    const searchParams = new URLSearchParams();

    if (filters?.search?.trim()) {
      searchParams.set("search", filters.search.trim());
    }

    if (filters?.lowStock) {
      searchParams.set("lowStock", "true");
    }

    if (filters?.activeOnly) {
      searchParams.set("activeOnly", "true");
    }

    const queryString = searchParams.toString();

    const response = await apiClient.get(
      queryString
        ? `/pharmacy/inventory?${queryString}`
        : "/pharmacy/inventory",
    );

    return response.data;
  },

  updateMedicineInventory: async (id: string, payload: any) => {
    const response = await apiClient.put(`/pharmacy/inventory/${id}`, payload);
    return response.data;
  },

  getPendingPrescriptions: async () => {
    const response = await apiClient.get("/pharmacy/prescriptions/pending");
    return response.data;
  },

  dispenseMedicinesReceipt: async (payload: any) => {
    const response = await apiClient.post("/pharmacy/sales", payload);
    return response.data;
  },

  getPharmacySales: async (filters?: {
    patient?: string;
    medicalRecord?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const searchParams = new URLSearchParams();

    if (filters?.patient) {
      searchParams.set("patient", filters.patient);
    }

    if (filters?.medicalRecord) {
      searchParams.set("medicalRecord", filters.medicalRecord);
    }

    if (filters?.startDate) {
      searchParams.set("startDate", filters.startDate);
    }

    if (filters?.endDate) {
      searchParams.set("endDate", filters.endDate);
    }

    const queryString = searchParams.toString();

    const response = await apiClient.get(
      queryString ? `/pharmacy/sales?${queryString}` : "/pharmacy/sales",
    );

    return response.data;
  },
};
