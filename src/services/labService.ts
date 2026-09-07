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

export const hmsLabServices = {
  getLabReportsQueue: async (statusQuery?: string) => {
    const url = statusQuery
      ? `/lab/reports?status=${statusQuery}`
      : "/lab/reports";
    const response = await apiClient.get(url);
    return response.data;
  },

  submitAnalyticalLabResult: async (id: string, testResultValues: string) => {
    const response = await apiClient.put(`/lab/report/${id}`, {
      testResultValues,
    });
    return response.data;
  },
};
