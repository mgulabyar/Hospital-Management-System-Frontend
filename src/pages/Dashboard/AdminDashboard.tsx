// /* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable @typescript-eslint/no-explicit-any */

// import React, { useCallback, useEffect, useState } from "react";
// import {
//   AlertTriangle,
//   Building2,
//   DollarSign,
//   RefreshCw,
//   Stethoscope,
//   UserCheck,
//   Users,
// } from "lucide-react";

// import { hmsServices } from "../../services/apiService";

// const getTodayDate = () => new Date().toISOString().split("T")[0];

// const formatCurrency = (amount?: number) =>
//   new Intl.NumberFormat("en-PK", {
//     style: "currency",
//     currency: "PKR",
//     maximumFractionDigits: 0,
//   }).format(Number(amount || 0));

// export const AdminDashboard: React.FC = () => {
//   const [metrics, setMetrics] = useState<any | null>(null);
//   const [selectedDate] = useState<string>(getTodayDate());
//   const [loading, setLoading] = useState<boolean>(true);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");

//   const fetchDashboardData = useCallback(
//     async (isManualRefresh = false) => {
//       if (isManualRefresh) {
//         setRefreshing(true);
//       } else {
//         setLoading(true);
//       }

//       setError("");

//       try {
//         const analyticsResponse = await hmsServices.billing.getDashboardAnalytics(selectedDate);

//         if (analyticsResponse.success) {
//           setMetrics(analyticsResponse.data || null);
//         } else {
//           setMetrics(null);
//         }
//       } catch (err: any) {
//         setError(err?.response?.data?.message || "Failed to fetch dashboard analytics");
//       } finally {
//         setLoading(false);
//         setRefreshing(false);
//       }
//     },
//     [selectedDate],
//   );

//   useEffect(() => {
//     fetchDashboardData();
//   }, [fetchDashboardData]);

//   if (loading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a4b8c] border-t-[#029352]" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="mx-auto max-w-7xl p-6 font-sans antialiased">
//         <div className="flex items-center gap-3 rounded-lg border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-600 shadow-sm">
//           <AlertTriangle className="h-5 w-5 shrink-0" />
//           <span>{error}</span>
//         </div>
//       </div>
//     );
//   }

//   const revenue = metrics?.revenueBreakdown || {};

//   const statCards = [
//     {
//       title: "Registered Patients",
//       value: metrics?.totalPatientsRegistered ?? 0,
//       icon: Users,
//       accent: "blue",
//     },
//     {
//       title: "Active Staff",
//       value: metrics?.activeHospitalStaffAccounts ?? 0,
//       icon: UserCheck,
//       accent: "green",
//     },
//     {
//       title: "Completed Consultations",
//       value: metrics?.completedConsultationsCount ?? 0,
//       icon: Stethoscope,
//       accent: "blue",
//     },
//     {
//       title: "Revenue Collected",
//       value: formatCurrency(metrics?.netFinancialRevenueCollected),
//       icon: DollarSign,
//       accent: "green",
//     },
//   ];

//   return (
//     <div className="mx-auto max-w-7xl bg-white p-6 font-sans antialiased text-slate-700">
//       <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm">
//         <div>
//           <h1 className="text-xl font-bold tracking-tight text-[#1a4b8c]">
//             Hospital <span className="text-[#029352]">Dashboard</span>
//           </h1>
//           <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
//             Key metrics and financial overview
//           </p>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             type="button"
//             onClick={() => fetchDashboardData(true)}
//             disabled={refreshing}
//             className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-400 transition-colors hover:bg-[#1a4b8c]/5 hover:text-[#1a4b8c] disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
//           </button>

//           <div className="shrink-0 rounded-lg border border-emerald-100 bg-[#029352]/10 p-2.5 text-[#029352]">
//             <Building2 className="h-5 w-5" />
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
//         {statCards.map((stat) => {
//           const Icon = stat.icon;
//           const isGreen = stat.accent === "green";
//           return (
//             <div key={stat.title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
//               <div className="flex items-center justify-between">
//                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                   {stat.title}
//                 </p>
//                 <Icon className={`h-4 w-4 ${isGreen ? "text-[#029352]" : "text-[#1a4b8c]"}`} />
//               </div>
//               <p className="mt-2 text-lg font-semibold text-slate-800">{stat.value}</p>
//             </div>
//           );
//         })}
//       </div>

//       <div className="mt-6 rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
//         <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">

/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  Building2,
  DollarSign,
  RefreshCw,
  Stethoscope,
  UserCheck,
  Users,
} from "lucide-react";

import { hmsServices } from "../../services/apiService";

const getTodayDate = () => new Date().toISOString().split("T")[0];

const formatCurrency = (amount?: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any | null>(null);
  const [selectedDate] = useState<string>(getTodayDate());
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
        const analyticsResponse =
          await hmsServices.billing.getDashboardAnalytics(selectedDate);

        if (analyticsResponse.success) {
          setMetrics(analyticsResponse.data || null);
        } else {
          setMetrics(null);
        }
      } catch (err: any) {
        setError(
          err?.response?.data?.message || "Failed to fetch dashboard analytics",
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

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a4b8c] border-t-[#029352]" />
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

  const revenue = metrics?.revenueBreakdown || {};

  const statCards = [
    {
      title: "Registered Patients",
      value: metrics?.totalPatientsRegistered ?? 0,
      icon: Users,
      accent: "blue",
    },
    {
      title: "Active Staff",
      value: metrics?.activeHospitalStaffAccounts ?? 0,
      icon: UserCheck,
      accent: "green",
    },
    {
      title: "Completed Consultations",
      value: metrics?.completedConsultationsCount ?? 0,
      icon: Stethoscope,
      accent: "blue",
    },
    {
      title: "Revenue Collected",
      value: formatCurrency(metrics?.netFinancialRevenueCollected),
      icon: DollarSign,
      accent: "green",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl bg-white p-6 font-sans antialiased text-slate-700">
      <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1a4b8c]">
            Hospital <span className="text-[#029352]">Dashboard</span>
          </h1>
          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
            Key metrics and financial overview
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-400 transition-colors hover:bg-[#1a4b8c]/5 hover:text-[#1a4b8c] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>

          <div className="shrink-0 rounded-lg border border-emerald-100 bg-[#029352]/10 p-2.5 text-[#029352]">
            <Building2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const isGreen = stat.accent === "green";
          return (
            <div
              key={stat.title}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {stat.title}
                </p>
                <Icon
                  className={`h-4 w-4 ${isGreen ? "text-[#029352]" : "text-[#1a4b8c]"}`}
                />
              </div>
              <p className="mt-2 text-base font-bold text-slate-800 font-sans">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="rounded-md bg-[#1a4b8c]/10 p-2 text-[#1a4b8c]">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase text-[#1a4b8c]">
              Revenue <span className="text-[#029352]">Breakdown</span>
            </h3>
            <p className="mt-0.5 text-[10px] font-medium text-slate-400">
              All generated invoice charge categories
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: "Consultation", value: revenue.consultationRevenue },
            { label: "Laboratory", value: revenue.labRevenue },
            { label: "Pharmacy", value: revenue.pharmacyRevenue },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50/60 p-3"
            >
              <span className="text-xs font-semibold text-slate-600">
                {item.label}
              </span>
              <span className="text-xs font-medium text-slate-800 font-sans">
                {formatCurrency(item.value)}
              </span>
            </div>
          ))}

          <div className="mt-1 space-y-2.5 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1a4b8c]" />
                <span className="text-xs font-semibold text-slate-500">
                  Invoice Gross Total
                </span>
              </div>
              <span className="text-sm font-semibold text-[#1a4b8c] font-sans">
                {formatCurrency(revenue.invoiceGrossTotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#029352]" />
                <span className="text-xs font-semibold text-slate-500">
                  Actual Collected
                </span>
              </div>
              <span className="text-sm font-semibold text-[#029352] font-sans">
                {formatCurrency(revenue.collectedRevenue)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
