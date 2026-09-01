/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Users, UserCheck, Activity, DollarSign, Building, AlertTriangle } from 'lucide-react';
import { hmsServices } from '../../services/apiService';
import { MetricCard } from '../../components/UI/MetricCard';

interface AnalyticsData {
  totalPatientsRegistered: number;
  totalHospitalStaffAccounts: number;
  completedConsultationsCount: number;
  netFinancialRevenueCollected: number;
}

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDashboardAnalytics = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await hmsServices.billing.getDashboardAnalytics();
        
        if (response.success && response.data) {
          setMetrics(response.data);
        } else {
          setError('Failed to aggregate analytical parameters.');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Network error connecting to Express database pipeline.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto font-sans">
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 flex items-center gap-3 text-sm text-rose-600 font-semibold shadow-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 font-sans max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-2xl shadow-sm text-white">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Hospital Command Center</h1>
          <p className="text-xs text-slate-300 mt-1 font-medium">Real-time systemic auditing, employee performance, and revenue aggregation dashboard.</p>
        </div>
        <div className="bg-emerald-600/20 text-emerald-400 p-3 rounded-xl border border-emerald-500/20">
          <Building className="w-5 h-5" />
        </div>
      </div>

      {/* Dynamic 4 Grid Financial & Structural Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <MetricCard
          title="Total Registered Patients"
          value={metrics?.totalPatientsRegistered ?? 0}
          icon={Users}
          description="Permanent clinical demographics logs"
          iconColorClass="text-blue-600"
          badgeColorClass="bg-blue-50"
        />

        <MetricCard
          title="Active Hospital Staff"
          value={metrics?.totalHospitalStaffAccounts ?? 0}
          icon={UserCheck}
          description="Doctors, Front Desk & Financial Officers"
          iconColorClass="text-purple-600"
          badgeColorClass="bg-purple-50"
        />

        <MetricCard
          title="Completed Appointments"
          value={metrics?.completedConsultationsCount ?? 0}
          icon={Activity}
          description="OPD checkup tokens successfully completed"
          iconColorClass="text-emerald-600"
          badgeColorClass="bg-emerald-50"
        />

        <MetricCard
          title="Net Hospital Sales"
          value={`Rs. ${metrics?.netFinancialRevenueCollected ?? 0}`}
          icon={DollarSign}
          description="Centralized billing invoices settled paid"
          iconColorClass="text-amber-600"
          badgeColorClass="bg-amber-50"
        />

      </div>

      {/* Informational Analytical Feed Panels */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm min-h-[260px] flex flex-col justify-between">
          <div className="border-b border-slate-50 pb-3">
            <h4 className="font-extrabold text-slate-800 text-sm tracking-tight">Active Operation Feeds</h4>
            <p className="text-[11px] text-slate-400 font-medium">Clinical queues running live across operational departments.</p>
          </div>
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs font-semibold italic">
            All medical system diagnostics pipelines are operational.
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm min-h-[260px] flex flex-col justify-between">
          <div className="border-b border-slate-50 pb-3">
            <h4 className="font-extrabold text-slate-800 text-sm tracking-tight">Security Log Summary</h4>
            <p className="text-[11px] text-slate-400 font-medium">Cryptographic access authorization audits matrix data feed.</p>
          </div>
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs font-semibold italic">
            RBAC encryption keys are secure.
          </div>
        </div>
      </div>

    </div>
  );
};
