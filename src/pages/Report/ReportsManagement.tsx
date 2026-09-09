/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import type { GenerateReportParams, ReportType } from "../../types";
import { reportService } from "../../services/reportService";
import {
  BarChart3,
  Beaker,
  CalendarDays,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  FileSpreadsheet,
  Layers,
  ListFilter,
  MessageSquare,
  Pill,
  ReceiptText,
  User,
  UserCheck,
  UserRoundCheck,
  Users,
  Wallet,
} from "lucide-react";

const ReportsManagement: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<ReportType>("financial");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [_reportId, setReportId] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const reportTypes: { value: ReportType; label: string }[] = [
    { value: "financial", label: "Financial Report" },
    { value: "patient", label: "Patient Report" },
    { value: "appointment", label: "Appointment Report" },
    { value: "clinical", label: "Clinical Report" },
    { value: "pharmacy", label: "Pharmacy Report" },
    { value: "lab", label: "Lab Report" },
    { value: "inventory", label: "Inventory Report" },
    { value: "staff", label: "Staff Report" },
    { value: "department", label: "Department Report" },
  ];

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select date range");
      return;
    }

    setLoading(true);
    try {
      const params: GenerateReportParams = {
        startDate,
        endDate,
      };

      let response;
      switch (selectedReport) {
        case "financial":
          response = await reportService.generateFinancialReport(params);
          break;
        case "patient":
          response = await reportService.generatePatientReport(params);
          break;
        case "appointment":
          response = await reportService.generateAppointmentReport(params);
          break;
        case "clinical":
          response = await reportService.generateClinicalReport(params);
          break;
        case "pharmacy":
          response = await reportService.generatePharmacyReport(params);
          break;
        case "lab":
          response = await reportService.generateLabReport(params);
          break;
        case "inventory":
          response = await reportService.generateInventoryReport(params);
          break;
        case "staff":
          response = await reportService.generateStaffReport(params);
          break;
        case "department":
          response = await reportService.generateDepartmentReport(params);
          break;
        default:
          throw new Error("Invalid report type");
      }

      setReportData(response.data);
      setReportId(response.reportId);
      setShowDetails(false);
      toast.success("Report generated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    if (!reportData) {
      toast.error("No report data to download");
      return;
    }

    const wb = XLSX.utils.book_new();

    const summaryData: any[] = [];
    if (reportData.summary) {
      Object.entries(reportData.summary).forEach(([key, value]) => {
        summaryData.push({ Metric: key, Value: value });
      });
    }
    const summaryWS = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWS, "Summary");

    const dataKey = Object.keys(reportData).find(
      (k) => Array.isArray(reportData[k]) && k !== "payments",
    );
    if (dataKey) {
      const dataWS = XLSX.utils.json_to_sheet(reportData[dataKey]);
      XLSX.utils.book_append_sheet(wb, dataWS, "Details");
    }

    XLSX.writeFile(
      wb,
      `${selectedReport}-report-${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  const getDataArray = () => {
    if (!reportData) return [];
    const dataKey = Object.keys(reportData).find(
      (k) => Array.isArray(reportData[k]) && k !== "payments",
    );
    return dataKey ? reportData[dataKey] : [];
  };

  const getColumns = (data: any[]) => {
    if (!data || data.length === 0) return [];
    const firstItem = data[0];
    return Object.keys(firstItem).filter(
      (key) => typeof firstItem[key] !== "object" || firstItem[key] === null,
    );
  };

  const data = getDataArray();
  const columns = getColumns(data);

  return (
    <div className="mx-auto max-w-7xl p-6 font-sans antialiased text-slate-700">
      <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1a4b8c]">
            Reports
            <span className="text-[#029352]"> Management</span>
          </h1>
          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
            Generate and export comprehensive hospital reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="shrink-0 rounded-lg border border-emerald-100 bg-[#029352]/10 p-2.5 text-[#029352]">
            <Pill className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="font-sans antialiased rounded-lg border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 p-4 text-[#1a4b8c]">
          <BarChart3 className="h-5 w-5 shrink-0" />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-normal text-[#1a4b8c]">
              Generate <span className="text-[#029352]">Report</span>
            </h2>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Report Type
              </label>
              <div className="relative w-full">
                <select
                  value={selectedReport}
                  onChange={(e) =>
                    setSelectedReport(e.target.value as ReportType)
                  }
                  className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 pl-3 pr-10 py-2.5 text-[11px] font-bold uppercase text-slate-500 outline-none transition-all focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10 appearance-none h-9.5"
                >
                  {reportTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label.toUpperCase()}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-600 outline-none transition-all focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10 h-9.5"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-600 outline-none transition-all focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10 h-9.5"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-start gap-2 border-t border-slate-100 pt-4">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="flex min-w-36 items-center justify-center gap-2 rounded-md bg-[#1a4b8c] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#143b6e] disabled:cursor-not-allowed disabled:opacity-60 shadow-sm h-9.5"
            >
              {loading ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Generating...</span>
                </>
              ) : (
                <span>Generate Report</span>
              )}
            </button>

            {reportData && (
              <>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="rounded-md border border-slate-200 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-colors hover:bg-slate-50 shadow-sm h-9.5"
                >
                  {showDetails ? "Hide Details" : "Show Details"}
                </button>

                <button
                  onClick={handleDownloadExcel}
                  className="flex items-center justify-center gap-1.5 rounded-md bg-[#029352] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#017542] shadow-sm h-9.5"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 shrink-0" />
                  <span>Download Excel</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {reportData && (
        <>
          <div className="font-sans mt-6 antialiased rounded-lg border border-slate-200/80 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 p-4 text-[#1a4b8c]">
              <Layers className="h-5 w-5 shrink-0" />
              <div>
                <h2 className="text-sm font-bold uppercase tracking-normal text-[#1a4b8c]">
                  Report <span className="text-[#029352]">Summary</span>
                </h2>
              </div>
            </div>

            <div className="p-5">
              {reportData.summary && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {Object.entries(reportData.summary).map(([key, value]) => {
                    const cleanKey = key.toLowerCase();

                    let IconComponent = MessageSquare;

                    if (
                      cleanKey.includes("revenue") ||
                      cleanKey.includes("collected") ||
                      cleanKey.includes("received")
                    ) {
                      IconComponent = Wallet;
                    } else if (
                      cleanKey.includes("outstanding") ||
                      cleanKey.includes("balance") ||
                      cleanKey.includes("unpaid") ||
                      cleanKey.includes("due")
                    ) {
                      IconComponent = CircleDollarSign;
                    } else if (
                      cleanKey.includes("pharmacy") ||
                      cleanKey.includes("sales") ||
                      cleanKey.includes("medicine")
                    ) {
                      IconComponent = CreditCard;
                    } else if (
                      cleanKey.includes("male") &&
                      !cleanKey.includes("female")
                    ) {
                      IconComponent = User;
                    } else if (cleanKey.includes("female")) {
                      IconComponent = User;
                    } else if (
                      cleanKey.includes("total") &&
                      cleanKey.includes("patient")
                    ) {
                      IconComponent = Users;
                    } else if (cleanKey.includes("patient")) {
                      IconComponent = UserRoundCheck;
                    } else if (
                      cleanKey.includes("visit") ||
                      cleanKey.includes("consultation")
                    ) {
                      // IconComponent = Activity;
                    } else if (
                      cleanKey.includes("lab") ||
                      cleanKey.includes("test")
                    ) {
                      IconComponent = Beaker;
                    } else if (cleanKey.includes("appointment")) {
                      IconComponent = CalendarDays;
                    } else if (
                      cleanKey.includes("staff") ||
                      cleanKey.includes("doctor") ||
                      cleanKey.includes("user")
                    ) {
                      IconComponent = UserCheck;
                    } else if (
                      cleanKey.includes("invoice") ||
                      cleanKey.includes("bill")
                    ) {
                      IconComponent = ReceiptText;
                    } else if (
                      cleanKey.includes("count") ||
                      cleanKey.includes("total")
                    ) {
                      IconComponent = ClipboardList;
                    }

                    return (
                      <div
                        key={key}
                        className="rounded-lg border border-slate-200/80 bg-slate-50 p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate"
                            title={key}
                          >
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </p>
                          <div className="text-slate-400 shrink-0">
                            <IconComponent className="h-4 w-4" />
                          </div>
                        </div>

                        <p className="mt-2 text-base font-bold text-slate-800 font-sans truncate">
                          {String(value ?? "—")}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {showDetails && data.length > 0 && (
            <div className="font-sans mt-6 antialiased rounded-lg border border-slate-200/80 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 p-4 text-[#1a4b8c]">
                <ListFilter className="h-5 w-5 shrink-0" />
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-normal text-[#1a4b8c]">
                    Detailed <span className="text-[#029352]"> Data </span>
                    <span className="text-slate-400 font-medium normal-case">
                      ({data.length})
                    </span>
                  </h2>
                </div>
              </div>

              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-50">
                <table className="w-full min-w-200 border-collapse text-left table-fixed">
                  <thead>
                    <tr className="border-b border-slate-200/60 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {columns.map((col) => (
                        <th key={col} className="px-4 py-3 whitespace-nowrap">
                          {col
                            .replace(/([A-Z])/g, " $1")
                            .trim()
                            .toUpperCase()}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white text-[11px] font-semibold text-slate-600">
                    {data.map((row: any, idx: number) => (
                      <tr
                        key={idx}
                        className="transition-colors hover:bg-[#1a4b8c]/1.5"
                      >
                        {columns.map((col) => (
                          <td
                            key={col}
                            className="px-4 py-3.5 align-middle font-sans text-slate-700 whitespace-nowrap truncate max-w-50"
                            title={
                              row[col] !== null && row[col] !== undefined
                                ? String(row[col])
                                : undefined
                            }
                          >
                            {row[col] !== null && row[col] !== undefined
                              ? String(row[col])
                              : "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReportsManagement;
