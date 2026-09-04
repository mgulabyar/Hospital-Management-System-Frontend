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

export type PaymentMethod = "Cash" | "Card" | "Insurance" | "Online";

export const hmsBillingServices = {
  getAllBillingPatients: async (filters?: {
    billingStage?: string;
    paymentStatus?: string;
    patient?: string;
    date?: string;
  }) => {
    const searchParams = new URLSearchParams();

    if (filters?.billingStage) {
      searchParams.set("billingStage", filters.billingStage);
    }

    if (filters?.paymentStatus) {
      searchParams.set("paymentStatus", filters.paymentStatus);
    }

    if (filters?.patient) {
      searchParams.set("patient", filters.patient);
    }

    if (filters?.date) {
      searchParams.set("date", filters.date);
    }

    const queryString = searchParams.toString();

    const response = await apiClient.get(
      queryString ? `/billing/patients?${queryString}` : "/billing/patients",
    );

    return response.data;
  },

  generateCentralizedBillSummary: async (
    tokenId: string,
    refreshCharges = false,
  ) => {
    const response = await apiClient.post("/billing/generate", {
      tokenId,
      refreshCharges,
    });

    return response.data;
  },

  settleInvoicePaymentLedger: async (
    invoiceId: string,
    payload: {
      paymentMethod: PaymentMethod;
      amount: number;
      paymentReference?: string;
    },
  ) => {
    const response = await apiClient.put(`/billing/settle/${invoiceId}`, payload);
    return response.data;
  },

  getInvoices: async (filters?: {
    patient?: string;
    paymentStatus?: string;
    paymentMethod?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const searchParams = new URLSearchParams();

    if (filters?.patient) {
      searchParams.set("patient", filters.patient);
    }

    if (filters?.paymentStatus) {
      searchParams.set("paymentStatus", filters.paymentStatus);
    }

    if (filters?.paymentMethod) {
      searchParams.set("paymentMethod", filters.paymentMethod);
    }

    if (filters?.startDate) {
      searchParams.set("startDate", filters.startDate);
    }

    if (filters?.endDate) {
      searchParams.set("endDate", filters.endDate);
    }

    const queryString = searchParams.toString();

    const response = await apiClient.get(
      queryString ? `/billing/invoices?${queryString}` : "/billing/invoices",
    );

    return response.data;
  },

  getDashboardAnalytics: async () => {
    const response = await apiClient.get("/billing/dashboard-analytics");
    return response.data;
  },
};