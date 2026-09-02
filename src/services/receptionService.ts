/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auto Interceptor validation tracking
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

export const hmsReceptionServices = {
  // Register patient into permanent hospital demographic database collection
  registerPatientProfile: async (payload: any) => {
    const response = await apiClient.post("/patients", payload);
    return response.data;
  },

  // Fetch running list of registered patient profile documents
  getRegisteredPatients: async (searchString?: string) => {
    const url = searchString ? `/patients?search=${searchString}` : "/patients";
    const response = await apiClient.get(url);
    return response.data;
  },

  // Post dynamic queue data ticket number inside AppointmentToken schema registry
  issueOPDQueueToken: async (payload: any) => {
    const response = await apiClient.post("/tokens", payload);
    return response.data;
  },
};
