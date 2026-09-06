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

export const hmsDoctorServices = {
  getDoctorQueue: async (
    statusQuery?: string,
    doctorId?: string,
    department?: string,
    date?: string,
  ) => {
    const searchParams = new URLSearchParams();

    if (statusQuery) {
      // Map appointment status to token status
      const mappedStatus = statusQuery
        .split(",")
        .map((status) => {
          if (status === "Checked-In") {
            return "Pending";
          }
          if (status === "Completed") {
            return "Completed";
          }
          if (status === "Cancelled") {
            return "Cancelled";
          }
          return status;
        })
        .join(",");

      searchParams.set("status", mappedStatus);
    }

    if (doctorId) {
      searchParams.set("doctor", doctorId);
    }

    if (department) {
      searchParams.set("department", department);
    }

    if (date) {
      searchParams.set("date", date);
    }

    const queryString = searchParams.toString();

    const response = await apiClient.get(
      queryString ? `/tokens?${queryString}` : "/tokens",
    );

    return response.data;
  },

  startConsultation: async (tokenId: string) => {
    const response = await apiClient.put(
      `/tokens/${tokenId}/start-consultation`,
      {},
    );

    return response.data;
  },

  submitMedicalRecordPrescription: async (payload: any) => {
    const response = await apiClient.post("/medical-records", payload);
    return response.data;
  },

  getPatientHistoryLogs: async (patientId: string) => {
    const response = await apiClient.get(
      `/medical-records/patient/${patientId}`,
    );

    return response.data;
  },
};
