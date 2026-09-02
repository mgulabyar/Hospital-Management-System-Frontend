/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auto Interceptor validation tracking for active authorization sessions
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

export const hmsDoctorServices = {
  // Fetch active daily OPD token queues assigned to the logged-in doctor
  getDoctorQueue: async (statusQuery?: string) => {
    const url = statusQuery ? `/tokens?status=${statusQuery}` : '/tokens';
    const response = await apiClient.get(url);
    return response.data; // Returns populated patient demographics and vitals arrays
  },

  // Post dynamic encounter notes and prescriptions array block to MedicalRecord schema
  submitMedicalRecordPrescription: async (payload: any) => {
    const response = await apiClient.post('/medical-records', payload);
    return response.data; // Saves record and auto changes token status to 'Completed'
  },

  // Fetch historic medical encounters chart sheet for a specific patient
  getPatientHistoryLogs: async (patientId: string) => {
    const response = await apiClient.get(`/medical-records/patient/${patientId}`);
    return response.data;
  }
};
