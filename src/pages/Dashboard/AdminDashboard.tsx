/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useCallback, useEffect, useState } from "react";
import {
  Activity,
  ActivitySquare,
  AlertTriangle,
  Building,
  CalendarDays,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  DollarSign,
  PackageCheck,
  Pill,
  RefreshCw,
  Stethoscope,
  TestTube2,
  UserCheck,
  Users,
} from "lucide-react";

import { hmsServices } from "../../services/apiService";
import { hmsReceptionServices } from "../../services/receptionService";
import { MetricCard } from "../../components/UI/MetricCard";

const getTodayDate = () => new Date().toISOString().split("T")[0];

const formatCurrency = (amount?: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const getPercentage = (value: number, total: number) => {
  if (!total) {
    return 0;
  }

  return Math.round((value / total) * 100);
};

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any | null>(null);
  const [recentPatients, setRecentPatients] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchDashboardData = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const [analyticsResponse, patientResponse] = await Promise.all([
          hmsServices.billing.getDashboardAnalytics(selectedDate),
          hmsReceptionServices.getRegisteredPatients(),
        ]);

        if (analyticsResponse.success) {
          setMetrics(analyticsResponse.data || null);
        } else {
          setMetrics(null);
        }

        if (patientResponse.success) {
          const sortedPatients = [...(patientResponse.data || [])].sort(
            (firstPatient: any, secondPatient: any) =>
              new Date(secondPatient.createdAt).getTime() -
              new Date(firstPatient.createdAt).getTime(),
          );

          setRecentPatients(sortedPatients.slice(0, 5));
        } else {
          setRecentPatients([]);
        }
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Network error connecting to hospital analytics services.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedDate],
  );

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    const refreshInterval = window.setInterval(() => {
      fetchDashboardData(true);
    }, 60000);

    return () => window.clearInterval(refreshInterval);
  }, [fetchDashboardData]);

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

  const dailyOperations = metrics?.dailyOperations || {};
  const appointmentStatus = metrics?.appointmentStatusCounts || {};
  const departmentVisitSummary = metrics?.departmentVisitSummary || [];
  const doctorWorkloadSummary = metrics?.doctorWorkloadSummary || [];
  const revenueBreakdown = metrics?.revenueBreakdown || {};

  const totalAppointments =
    Number(appointmentStatus.scheduled || 0) +
    Number(appointmentStatus.checkedIn || 0) +
    Number(appointmentStatus.completed || 0) +
    Number(appointmentStatus.cancelled || 0) +
    Number(appointmentStatus.noShow || 0);

  const appointmentCards = [
    {
      label: "Scheduled",
      value: Number(appointmentStatus.scheduled || 0),
      className: "border-blue-100 bg-blue-50 text-[#1a4b8c]",
    },
    {
      label: "Checked-In",
      value: Number(appointmentStatus.checkedIn || 0),
      className: "border-amber-100 bg-amber-50 text-amber-700",
    },
    {
      label: "Completed",
      value: Number(appointmentStatus.completed || 0),
      className: "border-emerald-100 bg-emerald-50 text-[#029352]",
    },
    {
      label: "Cancelled",
      value: Number(appointmentStatus.cancelled || 0),
      className: "border-rose-100 bg-rose-50 text-rose-600",
    },
    {
      label: "No Show",
      value: Number(appointmentStatus.noShow || 0),
      className: "border-slate-200 bg-slate-100 text-slate-600",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl select-none bg-white p-6 font-sans antialiased text-slate-700">
      <div className="mb-6 flex flex-col gap-4 rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1a4b8c]">
            Hospital Command <span className="text-[#029352]">Center</span>
          </h1>

          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
            Operations, visits, appointments, workload, pharmacy alerts, and
            financial reporting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs font-semibold text-slate-600 outline-none transition-all focus:border-[#1a4b8c] focus:ring-2 focus:ring-[#1a4b8c]/10"
            />
          </div>

          <button
            type="button"
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-400 transition-colors hover:bg-[#1a4b8c]/5 hover:text-[#1a4b8c] disabled:cursor-not-allowed disabled:opacity-50"
            title="Refresh Dashboard"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>

          <div className="shrink-0 rounded-lg border border-blue-100 bg-[#1a4b8c]/10 p-2.5 text-[#1a4b8c]">
            <Building className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Registered Patients"
          value={metrics?.totalPatientsRegistered ?? 0}
          icon={Users}
          description="Total permanent patient profiles."
          isGreenTheme={false}
        />

        <MetricCard
          title="Active Hospital Staff"
          value={metrics?.activeHospitalStaffAccounts ?? 0}
          icon={UserCheck}
          description={`${metrics?.totalHospitalStaffAccounts ?? 0} staff accounts registered.`}
          isGreenTheme={true}
        />

        <MetricCard
          title="Completed Consultations"
          value={metrics?.completedConsultationsCount ?? 0}
          icon={Activity}
          description="All-time completed clinical visits."
          isGreenTheme={true}
        />

        <MetricCard
          title="Revenue Collected"
          value={formatCurrency(metrics?.netFinancialRevenueCollected)}
          icon={DollarSign}
          description="Actual payments received against invoices."
          isGreenTheme={false}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
              Outstanding Balance
            </p>
            <CircleDollarSign className="h-4 w-4 text-amber-700" />
          </div>

          <p className="mt-2 text-xl font-black text-amber-800">
            {formatCurrency(metrics?.outstandingBalance)}
          </p>

          <p className="mt-1 text-[10px] font-medium text-amber-700/80">
            Unpaid and partially paid invoices.
          </p>
        </div>

        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#1a4b8c]">
              Pending Visits
            </p>
            <Clock3 className="h-4 w-4 text-[#1a4b8c]" />
          </div>

          <p className="mt-2 text-xl font-black text-[#1a4b8c]">
            {dailyOperations.pendingVisits || 0}
          </p>

          <p className="mt-1 text-[10px] font-medium text-[#1a4b8c]/70">
            Waiting for consultation on selected date.
          </p>
        </div>

        <div className="rounded-lg border border-rose-100 bg-rose-50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
              Pending Lab Tests
            </p>
            <TestTube2 className="h-4 w-4 text-rose-600" />
          </div>

          <p className="mt-2 text-xl font-black text-rose-700">
            {dailyOperations.pendingLabTests || 0}
          </p>

          <p className="mt-1 text-[10px] font-medium text-rose-600/80">
            Laboratory tests awaiting result analysis.
          </p>
        </div>

        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#029352]">
              Low Stock Medicines
            </p>
            <PackageCheck className="h-4 w-4 text-[#029352]" />
          </div>

          <p className="mt-2 text-xl font-black text-[#029352]">
            {dailyOperations.lowStockMedicines || 0}
          </p>

          <p className="mt-1 text-[10px] font-medium text-[#029352]/80">
            Inventory entries at or below reorder level.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 text-[#1a4b8c]">
            <CalendarDays className="h-4 w-4" />

            <div>
              <h4 className="text-sm font-bold tracking-tight text-slate-800">
                Appointment Status Overview
              </h4>

              <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                Scheduled appointment activity for the selected date.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {appointmentCards.map((appointmentCard) => (
              <div
                key={appointmentCard.label}
                className={`rounded-lg border p-3 ${appointmentCard.className}`}
              >
                <p className="text-[9px] font-bold uppercase tracking-wider">
                  {appointmentCard.label}
                </p>

                <p className="mt-1 text-xl font-black">
                  {appointmentCard.value}
                </p>

                <p className="mt-1 text-[9px] font-medium opacity-70">
                  {getPercentage(appointmentCard.value, totalAppointments)}% of
                  appointments
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3">
            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                In Consultation
              </p>

              <p className="mt-1 text-lg font-black text-[#1a4b8c]">
                {dailyOperations.inConsultationVisits || 0}
              </p>
            </div>

            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Completed Visits Today
              </p>

              <p className="mt-1 text-lg font-black text-[#029352]">
                {dailyOperations.completedVisits || 0}
              </p>
            </div>

            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Pharmacy Sales
              </p>

              <p className="mt-1 text-lg font-black text-[#1a4b8c]">
                {formatCurrency(metrics?.pharmacySalesTotal)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 text-[#029352]">
            <DollarSign className="h-4 w-4" />

            <div>
              <h4 className="text-sm font-bold tracking-tight text-slate-800">
                Revenue Breakdown
              </h4>

              <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                All generated invoice charge categories.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                label: "Consultation",
                value: revenueBreakdown.consultationRevenue,
                icon: Stethoscope,
                color: "text-[#1a4b8c]",
              },
              {
                label: "Laboratory",
                value: revenueBreakdown.labRevenue,
                icon: TestTube2,
                color: "text-[#029352]",
              },
              {
                label: "Pharmacy",
                value: revenueBreakdown.pharmacyRevenue,
                icon: Pill,
                color: "text-amber-700",
              },
            ].map((revenueItem) => {
              const Icon = revenueItem.icon;

              return (
                <div
                  key={revenueItem.label}
                  className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50/60 p-3"
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${revenueItem.color}`} />

                    <span className="text-xs font-semibold text-slate-600">
                      {revenueItem.label}
                    </span>
                  </div>

                  <span className="font-mono text-xs font-bold text-slate-800">
                    {formatCurrency(revenueItem.value)}
                  </span>
                </div>
              );
            })}

            <div className="border-t border-slate-200 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Invoice Gross Total
                </span>

                <span className="text-sm font-black text-[#1a4b8c]">
                  {formatCurrency(revenueBreakdown.invoiceGrossTotal)}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Actual Collected
                </span>

                <span className="text-sm font-black text-[#029352]">
                  {formatCurrency(revenueBreakdown.collectedRevenue)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 text-[#1a4b8c]">
            <ActivitySquare className="h-4 w-4" />

            <div>
              <h4 className="text-sm font-bold tracking-tight text-slate-800">
                Department Visit Load
              </h4>

              <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                OPD visits and completed consultations by department.
              </p>
            </div>
          </div>

          {departmentVisitSummary.length === 0 ? (
            <div className="py-10 text-center text-xs italic text-slate-400">
              No visit activity found for the selected date.
            </div>
          ) : (
            <div className="space-y-2">
              {departmentVisitSummary.map((department: any) => (
                <div
                  key={department.departmentId || department.departmentName}
                  className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50/60 p-3"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      {department.departmentName}
                    </p>

                    <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-[#029352]">
                      {department.departmentCode}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-black text-[#1a4b8c]">
                      {department.visits} Visits
                    </p>

                    <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                      {department.completedVisits} completed
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 text-[#029352]">
            <Stethoscope className="h-4 w-4" />

            <div>
              <h4 className="text-sm font-bold tracking-tight text-slate-800">
                Doctor Workload
              </h4>

              <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                Assigned visits and completed consultations today.
              </p>
            </div>
          </div>

          {doctorWorkloadSummary.length === 0 ? (
            <div className="py-10 text-center text-xs italic text-slate-400">
              No doctor visit workload found for the selected date.
            </div>
          ) : (
            <div className="space-y-2">
              {doctorWorkloadSummary.map((doctor: any) => (
                <div
                  key={doctor.doctorId || doctor.doctorName}
                  className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50/60 p-3"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      {doctor.doctorName}
                    </p>

                    <p className="mt-0.5 text-[9px] font-medium text-slate-400">
                      Clinical workload
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-black text-[#1a4b8c]">
                      {doctor.visits} Visits
                    </p>

                    <p className="mt-0.5 text-[10px] font-medium text-[#029352]">
                      {doctor.completedVisits} completed
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 text-[#1a4b8c]">
          <ClipboardCheck className="h-4 w-4" />

          <div>
            <h4 className="text-sm font-bold tracking-tight text-slate-800">
              Recent Patient Registrations
            </h4>

            <p className="mt-0.5 text-[10px] font-medium text-slate-400">
              Latest patient profile records from reception.
            </p>
          </div>
        </div>

        {recentPatients.length === 0 ? (
          <div className="py-10 text-center text-xs italic text-slate-400">
            No recent patient registrations found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200/60">
            <table className="w-full min-w-180 border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-3 py-2.5">Patient Code</th>
                  <th className="px-3 py-2.5">Name</th>
                  <th className="px-3 py-2.5">Contact</th>
                  <th className="px-3 py-2.5">Gender</th>
                  <th className="px-3 py-2.5">Registration Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                {recentPatients.map((patient: any) => (
                  <tr
                    key={patient._id}
                    className="transition-colors hover:bg-slate-50/50"
                  >
                    <td className="px-3 py-3 font-mono text-sm font-bold text-[#1a4b8c]">
                      {patient.patientId}
                    </td>

                    <td className="px-3 py-3 font-bold text-slate-800">
                      {patient.name}
                    </td>

                    <td className="px-3 py-3 text-slate-500">
                      {patient.phone}
                    </td>

                    <td className="px-3 py-3">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        {patient.gender}
                      </span>
                    </td>

                    <td className="px-3 py-3 text-[11px] text-slate-500">
                      {patient.createdAt
                        ? new Date(patient.createdAt).toLocaleDateString(
                            "en-PK",
                          )
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
