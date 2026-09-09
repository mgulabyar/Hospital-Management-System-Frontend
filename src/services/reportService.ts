import axios from "axios";
import type { GenerateReportParams } from "../types";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
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
  }
);

export const reportService = {
  async generateFinancialReport(params: GenerateReportParams) {
    const response = await api.post("/reports/generate/financial", params);
    return response.data;
  },

  async generatePatientReport(params: GenerateReportParams) {
    const response = await api.post("/reports/generate/patient", params);
    return response.data;
  },

  async generateAppointmentReport(params: GenerateReportParams) {
    const response = await api.post("/reports/generate/appointment", params);
    return response.data;
  },

  async generateClinicalReport(params: GenerateReportParams) {
    const response = await api.post("/reports/generate/clinical", params);
    return response.data;
  },

  async generatePharmacyReport(params: GenerateReportParams) {
    const response = await api.post("/reports/generate/pharmacy", params);
    return response.data;
  },

  async generateLabReport(params: GenerateReportParams) {
    const response = await api.post("/reports/generate/lab", params);
    return response.data;
  },

  async generateInventoryReport(params: GenerateReportParams) {
    const response = await api.post("/reports/generate/inventory", params);
    return response.data;
  },

  async generateStaffReport(params: GenerateReportParams) {
    const response = await api.post("/reports/generate/staff", params);
    return response.data;
  },

  async generateDepartmentReport(params: GenerateReportParams) {
    const response = await api.post("/reports/generate/department", params);
    return response.data;
  },

  async getAllReports() {
    const response = await api.get("/reports/all");
    return response.data;
  },

  async getReportById(id: string) {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  async downloadExcel(reportId: string, reportType: string) {
    const response = await api.get(`/reports/download/${reportId}`, {
      responseType: "blob",
      params: { reportType },
    });
    return response.data;
  },
};
