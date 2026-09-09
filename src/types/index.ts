/* eslint-disable @typescript-eslint/no-explicit-any */
// Add these types

export type ReportType =
  | "financial"
  | "patient"
  | "appointment"
  | "clinical"
  | "pharmacy"
  | "lab"
  | "inventory"
  | "staff"
  | "department";

export interface GenerateReportParams {
  startDate: string;
  endDate: string;
  status?: string;
  paymentStatus?: string;
  departmentId?: string;
  doctorId?: string;
  reportType?: string;
}

export interface ReportData {
  _id: string;
  reportType: string;
  title: string;
  description: string;
  generatedBy: {
    _id: string;
    name: string;
    email: string;
  };
  data: any;
  summary: any;
  status: "pending" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}