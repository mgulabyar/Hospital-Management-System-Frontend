/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useCallback, useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Database,
  Filter,
  KeyRound,
  RefreshCw,
  Search,
  ShieldAlert,
  UserRoundX,
  X,
} from "lucide-react";
import { hmsAuditLogServices } from "../../services/auditLogService";

const formatDateTime = (dateValue?: string) => {
  if (!dateValue) {
    return "N/A";
  }

  return new Date(dateValue).toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const getStatusStyle = (status: string) => {
  if (status === "SUCCESS") {
    return "border-emerald-100 bg-emerald-50 text-[#029352]";
  }

  return "border-rose-100 bg-rose-50 text-rose-600";
};

const moduleOptions = [
  "AUTH",
  "PATIENTS",
  "DEPARTMENTS",
  "STAFF",
  "RECEPTION",
  "PATIENT_VISITS",
  "APPOINTMENTS",
  "MEDICAL_RECORDS",
  "LABORATORY",
  "PHARMACY",
  "BILLING",
];

const roleOptions = [
  "SUPER_ADMIN",
  "DOCTOR",
  "RECEPTIONIST",
  "PHARMACIST",
  "LABORATORIAN",
  "ACCOUNTANT",
  "PATIENT",
  "SYSTEM",
];

export const SecurityLogsWorkspace: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [summary, setSummary] = useState<any | null>(null);

  const [moduleFilter, setModuleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const fetchAuditData = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setErrorMsg("");

      try {
        const [logsResponse, summaryResponse] = await Promise.all([
          hmsAuditLogServices.getAuditLogs({
            module: moduleFilter || undefined,
            status: statusFilter || undefined,
            role: roleFilter || undefined,
            search: searchQuery || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            limit: 250,
          }),
          hmsAuditLogServices.getAuditSummary(),
        ]);

        if (logsResponse.success) {
          setAuditLogs(logsResponse.data || []);
        } else {
          setAuditLogs([]);
        }

        if (summaryResponse.success) {
          setSummary(summaryResponse.data || null);
        } else {
          setSummary(null);
        }
      } catch (err: any) {
        setAuditLogs([]);
        setSummary(null);

        setErrorMsg(
          err?.response?.data?.message ||
            "Failed to synchronize real system audit logs.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [endDate, moduleFilter, roleFilter, searchQuery, startDate, statusFilter],
  );

  useEffect(() => {
    fetchAuditData();
  }, [fetchAuditData]);

  useEffect(() => {
    const refreshTimer = window.setInterval(() => {
      fetchAuditData(true);
    }, 60000);

    return () => window.clearInterval(refreshTimer);
  }, [fetchAuditData]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const clearFilters = () => {
    setModuleFilter("");
    setStatusFilter("");
    setRoleFilter("");
    setSearchInput("");
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="mx-auto max-w-7xl p-6 font-sans antialiased text-slate-700">
      <div className="mb-6 flex flex-col gap-4 rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1a4b8c]">
            Security <span className="text-[#029352]">Audit Logs</span>
          </h1>

          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
            Monitor recorded account access and hospital workflow activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchAuditData(true)}
            disabled={refreshing}
            className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-400 transition-colors hover:bg-[#1a4b8c]/5 hover:text-[#1a4b8c] disabled:cursor-not-allowed disabled:opacity-50"
            title="Refresh Audit Logs"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>

          <div className="shrink-0 rounded-lg border border-rose-100 bg-rose-50 p-2.5 text-rose-600">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-rose-100 bg-rose-50 p-4 text-xs font-bold text-rose-600 shadow-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

          <span className="leading-relaxed">{errorMsg}</span>

          <button
            type="button"
            onClick={() => setErrorMsg("")}
            className="ml-auto rounded p-0.5 transition-colors hover:bg-rose-100"
            aria-label="Close audit error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Audit Logs
            </span>

            <Database className="h-4 w-4 text-[#1a4b8c]" />
          </div>

          <p className="mt-2 text-2xl font-black text-[#1a4b8c]">
            {summary?.totalLogs || 0}
          </p>

          <p className="mt-1 text-[10px] font-medium text-slate-400">
            Stored audit events
          </p>
        </div>

        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#029352]">
              Successful Events
            </span>

            <CheckCircle2 className="h-4 w-4 text-[#029352]" />
          </div>

          <p className="mt-2 text-2xl font-black text-[#029352]">
            {summary?.successLogs || 0}
          </p>

          <p className="mt-1 text-[10px] font-medium text-[#029352]/80">
            Confirmed workflow actions
          </p>
        </div>

        <div className="rounded-lg border border-rose-100 bg-rose-50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
              Failed Events
            </span>

            <UserRoundX className="h-4 w-4 text-rose-600" />
          </div>

          <p className="mt-2 text-2xl font-black text-rose-700">
            {summary?.failureLogs || 0}
          </p>

          <p className="mt-1 text-[10px] font-medium text-rose-600/80">
            Validation and access failures
          </p>
        </div>

        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1a4b8c]">
              Last 24 Hours
            </span>

            <Activity className="h-4 w-4 text-[#1a4b8c]" />
          </div>

          <p className="mt-2 text-2xl font-black text-[#1a4b8c]">
            {summary?.recentLogs || 0}
          </p>

          <p className="mt-1 text-[10px] font-medium text-[#1a4b8c]/70">
            Recent hospital activity
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <ShieldAlert className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a4b8c]">
                System Access <span className="text-[#029352]">Trail</span>
              </h3>

              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Real audit records from login and hospital workflow events
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-6">
            <select
              value={moduleFilter}
              onChange={(event) => setModuleFilter(event.target.value)}
              className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-600 outline-none transition-all focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
            >
              <option value="">ALL MODULES</option>

              {moduleOptions.map((module) => (
                <option key={module} value={module}>
                  {module.replace("_", " ")}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-600 outline-none transition-all focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
            >
              <option value="">ALL RESULTS</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="FAILURE">FAILURE</option>
            </select>

            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-600 outline-none transition-all focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
            >
              <option value="">ALL ROLES</option>

              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role.replace("_", " ")}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-[10px] font-semibold text-slate-600 outline-none transition-all focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
              title="Start date"
            />

            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-[10px] font-semibold text-slate-600 outline-none transition-all focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
              title="End date"
            />

            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-[9px] font-bold uppercase tracking-wide text-slate-500 transition-colors hover:bg-slate-100"
            >
              <Filter className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search audit reference, action, user, email, or description..."
                className="w-full rounded-md border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 rounded-md bg-[#1a4b8c] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#143b6e]"
            >
              <Search className="h-3.5 w-3.5" />
              Search
            </button>
          </form>
        </div>

        {loading && (
          <div className="flex min-h-75 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a4b8c] border-t-[#029352]" />
          </div>
        )}

        {!loading && auditLogs.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center">
            <ShieldAlert className="mx-auto mb-3 h-8 w-8 text-slate-400" />

            <p className="text-xs font-semibold text-slate-400">
              No audit log records match the selected filters.
            </p>

            <p className="mt-1 text-[10px] font-medium text-slate-400">
              New system actions will appear here after they are recorded.
            </p>
          </div>
        )}

        {!loading && auditLogs.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-slate-200/60">
            <table className="w-full min-w-287.5 text-left">
              <thead className="bg-slate-50 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3">Audit Ref</th>
                  <th className="px-4 py-3">Action / Module</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Operator</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">IP Address</th>
                  <th className="px-4 py-3">Result</th>
                  <th className="px-4 py-3">Recorded At</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white text-xs font-medium text-slate-600">
                {auditLogs.map((log: any) => (
                  <tr
                    key={log._id}
                    className="transition-colors hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3.5 font-mono text-[10px] font-bold text-[#1a4b8c]">
                      {log.logNumber || "AUD-UNKNOWN"}
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="font-mono text-[10px] font-bold text-slate-700">
                        {log.action?.replace(/_/g, " ") || "SYSTEM ACTION"}
                      </p>

                      <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-[#029352]">
                        {log.module?.replace(/_/g, " ") || "SYSTEM"}
                      </p>
                    </td>

                    <td className="max-w-75 px-4 py-3.5 text-[11px] leading-relaxed text-slate-600">
                      {log.description || "No description available"}
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="text-[11px] font-bold text-slate-700">
                        {log.performedBy?.name || log.performerName || "System"}
                      </p>

                      <p className="mt-0.5 font-mono text-[9px] text-slate-400">
                        {log.performedBy?.email || log.performerEmail || "—"}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600">
                        {(
                          log.performedBy?.role ||
                          log.performerRole ||
                          "SYSTEM"
                        ).replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-[10px] text-slate-500">
                      {log.ipAddress || "Unknown"}
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${getStatusStyle(
                          log.status,
                        )}`}
                      >
                        {log.status || "SUCCESS"}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 whitespace-nowrap text-[10px] text-slate-500">
                        <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                        <span>{formatDateTime(log.createdAt)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2 rounded-lg border border-slate-200/60 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-[#029352]/10 p-1.5 text-[#029352]">
              <KeyRound className="h-3.5 w-3.5" />
            </div>

            <span className="text-[10px] font-medium text-slate-500">
              Audit events record actor, role, IP address, action result, and
              timestamp.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-md bg-[#1a4b8c]/10 p-1.5 text-[#1a4b8c]">
              <Activity className="h-3.5 w-3.5" />
            </div>

            <span className="text-[10px] font-medium text-slate-500">
              Auto-refreshes every 60 seconds
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
