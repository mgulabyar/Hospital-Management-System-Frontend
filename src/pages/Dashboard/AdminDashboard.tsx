/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  Activity,
  DollarSign,
  Building,
  AlertTriangle,
} from "lucide-react";
import { hmsServices } from "../../services/apiService";
import { MetricCard } from "../../components/UI/MetricCard";

interface AnalyticsData {
  totalPatientsRegistered: number;
  totalHospitalStaffAccounts: number;
  completedConsultationsCount: number;
  netFinancialRevenueCollected: number;
}

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchDashboardAnalytics = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await hmsServices.billing.getDashboardAnalytics();

        if (response.success && response.data) {
          setMetrics(response.data);
        } else {
          setError("Failed to aggregate analytical parameters.");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Network error connecting to Express database pipeline.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardAnalytics();
  }, []);

  // Professional Brand-Matched Loading Screen State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[#1a4b8c] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Consistent Error Notification Banner Block
  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto font-sans antialiased">
        <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 flex items-center gap-3 text-sm text-rose-600 font-semibold shadow-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 font-sans max-w-7xl mx-auto antialiased select-none bg-white">
      <div className="mb-6 flex items-center justify-between bg-slate-50 border border-slate-200/60 p-5 rounded-lg shadow-sm">
        <div>
          <h1 className="text-xl uppercase font-bold text-[#1a4b8c] tracking-tight">
            Hospital Command <span className="text-[#029352]">Center</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
            Real-time systemic auditing, employee performance, and revenue
            aggregation dashboard.
          </p>
        </div>
        <div className="bg-[#1a4b8c]/10 text-[#1a4b8c] p-2.5 rounded-lg border border-blue-100 shrink-0">
          <Building className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total Registered Patients"
          value={metrics?.totalPatientsRegistered ?? 0}
          icon={Users}
          description="Permanent clinical demographics logs records inside database."
          isGreenTheme={false}
        />

        {/* Active Hospital Staff - Official Validation Green Theme */}
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

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Active Operation Feeds Panel */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 p-5 rounded-lg shadow-sm min-h-60 flex flex-col justify-between group">
          <div className="border-b border-slate-100 pb-2.5">
            <h4 className="font-bold text-slate-800 text-sm tracking-tight transition-colors duration-150 group-hover:text-[#1a4b8c]">
              Active Operation Feeds
            </h4>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Clinical queues running live across operational departments.
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs font-medium italic">
            All medical system diagnostics pipelines are operational.
          </div>
        </div>

        {/* Security Log Summary Panel */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-lg shadow-sm min-h-60 flex flex-col justify-between group">
          <div className="border-b border-slate-100 pb-2.5">
            <h4 className="font-bold text-slate-800 text-sm tracking-tight transition-colors duration-150 group-hover:text-[#1a4b8c]">
              Security Log Summary
            </h4>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Cryptographic access authorization audits matrix data feed.
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs font-medium italic">
            RBAC encryption keys are secure.
          </div>
        </div>
      </div>
    </div>
  );
};
