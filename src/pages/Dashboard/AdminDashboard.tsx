/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  Activity,
  DollarSign,
  Building,
  AlertTriangle,
  Terminal,
  ActivitySquare,
  Clock,
} from "lucide-react";
import { hmsServices } from "../../services/apiService";
import { hmsReceptionServices } from "../../services/receptionService";
import { MetricCard } from "../../components/UI/MetricCard";

interface AnalyticsData {
  totalPatientsRegistered: number;
  totalHospitalStaffAccounts: number;
  completedConsultationsCount: number;
  netFinancialRevenueCollected: number;
}

interface SecurityLog {
  id: string;
  event: string;
  user: string;
  time: string;
}

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AnalyticsData | null>(null);
  const [liveQueue, setLiveQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const securityLogs: SecurityLog[] = [
    {
      id: "SEC-402",
      event: "User Overwrite Succeeded",
      user: "admin@hospital.com",
      time: "Just Now",
    },
    {
      id: "SEC-401",
      event: "OPD Token Issued #1",
      user: "reception_desk",
      time: "10 mins ago",
    },
    {
      id: "SEC-400",
      event: "EMR Record Committed",
      user: "dr.shahzad",
      time: "15 mins ago",
    },
  ];

  useEffect(() => {
    const fetchDashboardMasterData = async () => {
      try {
        setLoading(true);
        setError("");

        const analyticsResponse =
          await hmsServices.billing.getDashboardAnalytics();

        if (analyticsResponse.success) {
          setMetrics(analyticsResponse.data);
        }

        const queueResponse =
          await hmsReceptionServices.getRegisteredPatients();

        if (queueResponse.success) {
          setLiveQueue(queueResponse.data.slice(0, 4));
        }
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Network error connecting to Express database pipeline.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMasterData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a4b8c] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-6 font-sans antialiased">
        <div className="flex items-center gap-3 rounded-lg border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-600 shadow-sm">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6 font-sans antialiased select-none bg-white">
      <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1a4b8c]">
            Hospital Command <span className="text-[#029352]">Center</span>
          </h1>

          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
            Real-time systemic auditing, employee performance, and revenue
            aggregation dashboard.
          </p>
        </div>

        <div className="shrink-0 rounded-lg border border-blue-100 bg-[#1a4b8c]/10 p-2.5 text-[#1a4b8c]">
          <Building className="h-5 w-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Registered Patients"
          value={metrics?.totalPatientsRegistered ?? 0}
          icon={Users}
          description="Permanent clinical demographics logs records inside database."
          isGreenTheme={false}
        />

        <MetricCard
          title="Active Hospital Staff"
          value={metrics?.totalHospitalStaffAccounts ?? 0}
          icon={UserCheck}
          description="Doctors, Front Desk executives and Financial Officers."
          isGreenTheme={true}
        />

        <MetricCard
          title="Completed Appointments"
          value={metrics?.completedConsultationsCount ?? 0}
          icon={Activity}
          description="OPD checkup tokens successfully completed and cleared."
          isGreenTheme={true}
        />

        <MetricCard
          title="Net Hospital Sales"
          value={`Rs. ${metrics?.netFinancialRevenueCollected ?? 0}`}
          icon={DollarSign}
          description="Centralized hospital billing invoices settled paid successfully."
          isGreenTheme={false}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="group min-h-60 rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-[#1a4b8c]/30 lg:col-span-2">
          <div className="mb-3 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2 text-[#1a4b8c]">
              <ActivitySquare className="h-4 w-4" />

              <h4 className="text-sm font-bold tracking-tight text-slate-800">
                Active Operation Feeds
              </h4>
            </div>

            <p className="mt-0.5 text-xs font-medium text-slate-400">
              Clinical patient folders synchronized live from front desk
              registries.
            </p>
          </div>

          <div className="flex-1 overflow-x-auto">
            {liveQueue.length === 0 ? (
              <div className="py-10 text-center text-xs italic text-slate-400">
                No recent patients directories entries.
              </div>
            ) : (
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-3 py-2">Patient Code</th>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Contact</th>
                    <th className="px-3 py-2">Gender</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                  {liveQueue.map((patient: any) => (
                    <tr
                      key={patient._id}
                      className="transition-colors hover:bg-slate-50/50"
                    >
                      <td className="px-3 py-2.5 font-mono text-sm font-bold text-[#1a4b8c]">
                        {patient.patientId}
                      </td>

                      <td className="px-3 py-2.5 font-bold text-slate-800">
                        {patient.name}
                      </td>

                      <td className="px-3 py-2.5 text-slate-500">
                        {patient.phone}
                      </td>

                      <td className="px-3 py-2.5">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                          {patient.gender}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="group min-h-60 rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-[#029352]/30">
          <div className="mb-3 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2 text-[#029352]">
              <Terminal className="h-4 w-4" />

              <h4 className="text-sm font-bold tracking-tight text-slate-800">
                Security Log Summary
              </h4>
            </div>

            <p className="mt-0.5 text-xs font-medium text-slate-400">
              Cryptographic access authorization audits matrix live transaction
              feed.
            </p>
          </div>

          <div className="flex-1 space-y-2">
            {securityLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50/50 p-2.5 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-2">
                  <div className="rounded bg-[#029352]/10 px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#029352]">
                    {log.id}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      {log.event}
                    </p>

                    <p className="text-[10px] text-slate-500">By: {log.user}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                  <Clock className="h-3 w-3" />
                  <span>{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
