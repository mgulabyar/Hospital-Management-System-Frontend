/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auto Interceptor validation tracking for active authorization sessions bearer token keys
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

export const hmsBillingServices = {
  // Post data points to generate compiled invoice slip in Unpaid state inside Invoice collection
  generateCentralizedBillSummary: async (payload: any) => {
    const response = await apiClient.post('/billing/generate', payload);
    return response.data;
  },

  // Put payment settlement trigger parameter method to close ledger invoices as Paid
  settleInvoicePaymentLedger: async (id: string, paymentMethod: string) => {
    const response = await apiClient.put(`/billing/settle/${id}`, { paymentMethod });
    return response.data;
  }
};
