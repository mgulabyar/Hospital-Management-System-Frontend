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

export const hmsAppointmentServices = {
  createAppointment: async (payload: any) => {
    const response = await apiClient.post("/appointments", payload);
    return response.data;
  },

  getAppointments: async (filters?: {
    patient?: string;
    doctor?: string;
    department?: string;
    status?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const searchParams = new URLSearchParams();

    if (filters?.patient) {
      searchParams.set("patient", filters.patient);
    }

    if (filters?.doctor) {
      searchParams.set("doctor", filters.doctor);
    }

    if (filters?.department) {
      searchParams.set("department", filters.department);
    }

    if (filters?.status) {
      searchParams.set("status", filters.status);
    }

    if (filters?.date) {
      searchParams.set("date", filters.date);
    }

    if (filters?.startDate) {
      searchParams.set("startDate", filters.startDate);
    }

    if (filters?.endDate) {
      searchParams.set("endDate", filters.endDate);
    }

    const queryString = searchParams.toString();

    const response = await apiClient.get(
      queryString ? `/appointments?${queryString}` : "/appointments",
    );

    return response.data;
  },

  rescheduleAppointment: async (id: string, payload: any) => {
    const response = await apiClient.put(
      `/appointments/${id}/reschedule`,
      payload,
    );

    return response.data;
  },

  cancelAppointment: async (id: string, cancellationReason: string) => {
    const response = await apiClient.put(`/appointments/${id}/cancel`, {
      cancellationReason,
    });

    return response.data;
  },

  checkInAppointment: async (id: string) => {
    const response = await apiClient.put(`/appointments/${id}/check-in`, {});
    return response.data;
  },

  updateAppointmentStatus: async (id: string, status: string) => {
    const response = await apiClient.put(`/appointments/${id}/status`, {
      status,
    });

    return response.data;
  },
};
