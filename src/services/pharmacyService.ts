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

export const hmsPharmacyServices = {
  addMedicineToStock: async (payload: any) => {
    const response = await apiClient.post('/pharmacy/inventory', payload);
    return response.data;
  },

  dispenseMedicinesReceipt: async (payload: any) => {
    const response = await apiClient.post('/pharmacy/sales', payload);
    return response.data; 
  }
};
