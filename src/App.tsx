/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/rules-of-hooks */
// /* eslint-disable no-useless-catch */
// /* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable react-hooks/rules-of-hooks */
// /* eslint-disable @typescript-eslint/no-explicit-any */

// import React, { useCallback, useContext, useEffect, useState } from "react";
// import {
//   UserPlus,
//   ToggleLeft,
//   ToggleRight,
//   Trash2,
//   RefreshCw,
//   Users,
//   ShieldCheck,
// } from "lucide-react";

// import { AuthProvider, AuthContext } from "./context/AuthContext";
// import { Login } from "./pages/Auth/Login";
// import { TopNavbar } from "./components/Navbar/Navbar";
// import { MainSidebar } from "./components/Sidebar/MainSidebar";
// import { hmsServices } from "./services/apiService";
// import { AdminDashboard } from "./pages/Dashboard/AdminDashboard";
// import { AddStaffModal } from "./components/Staff/AddStaffModal";

// const MainAppContent: React.FC = () => {
//   const authContext = useContext(AuthContext);

//   const [activeTab, setActiveTab] = useState<string>("dashboard");
//   const [staffData, setStaffData] = useState<any[]>([]);
//   const [staffLoading, setStaffLoading] = useState<boolean>(false);
//   const [staffError, setStaffError] = useState<string>("");
//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

//   if (!authContext) {
//     return null;
//   }

//   const { isAuthenticated } = authContext;

//   const fetchStaffRegistry = useCallback(async () => {
//     setStaffLoading(true);
//     setStaffError("");

//     try {
//       const response = await hmsServices.staff.getAllStaff();

//       if (response.success && response.data) {
//         setStaffData(response.data);
//       } else {
//         setStaffData([]);
//         setStaffError("Failed to aggregate staff registry parameters.");
//       }
//     } catch (err: any) {
//       setStaffError(
//         err?.response?.data?.message ||
//           "Network error connecting to Express database pipeline.",
//       );
//     } finally {
//       setStaffLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (isAuthenticated && activeTab === "staff_crud") {
//       fetchStaffRegistry();
//     }
//   }, [isAuthenticated, activeTab, fetchStaffRegistry]);

//   const handleCreateStaffSubmit = async (payload: any) => {
//     try {
//       const response = await hmsServices.staff.createStaffAccount(payload);

//       if (response.success) {
//         setIsModalOpen(false);
//         await fetchStaffRegistry();
//       }
//     } catch (error) {
//       throw error;
//     }
//   };

//   const handleToggleDutyState = async (id: string) => {
//     try {
//       const response = await hmsServices.staff.toggleStaffStatus(id);

//       if (response.success) {
//         setStaffData((previousData) =>
//           previousData.map((worker) =>
//             worker._id === id
//               ? {
//                   ...worker,
//                   isActive: !worker.isActive,
//                 }
//               : worker,
//           ),
//         );
//       }
//     } catch (err: any) {
//       alert(
//         err?.response?.data?.message ||
//           "Failed to modify account authorization settings.",
//       );
//     }
//   };

//   const handleAccountEviction = async (id: string) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to permanently delete this practitioner account?",
//     );

//     if (!confirmed) {
//       return;
//     }

//     try {
//       const response = await hmsServices.staff.deleteStaffAccount(id);

//       if (response.success) {
//         setStaffData((previousData) =>
//           previousData.filter((worker) => worker._id !== id),
//         );
//       }
//     } catch (err: any) {
//       alert(
//         err?.response?.data?.message ||
//           "Failed to execute account database deletion.",
//       );
//     }
//   };

//   if (!isAuthenticated) {
//     return <Login />;
//   }

//   return (
//     <div className="flex h-screen flex-col overflow-hidden bg-slate-50 font-sans antialiased">
//       <TopNavbar />

//       <div className="flex flex-1 overflow-hidden">
//         <MainSidebar currentTab={activeTab} setCurrentTab={setActiveTab} />

//         <main className="flex-1 overflow-y-auto bg-white">
//           {activeTab === "dashboard" && <AdminDashboard />}

//           {activeTab === "staff_crud" && (
//             <div className="mx-auto max-w-7xl p-6 font-sans antialiased">
//               <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm">
//                 <div>
//                   <h1 className="text-xl uppercase font-bold tracking-tight text-[#1a4b8c]">
//                     Staff Registry{" "}
//                     <span className="text-[#029352]">Center</span>
//                   </h1>

//                   <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
//                     Manage hospital practitioners, front desk executives and
//                     authorized staff accounts.
//                   </p>
//                 </div>

//                 <div className="shrink-0 rounded-lg border border-emerald-100 bg-[#029352]/10 p-2.5 text-[#029352]">
//                   <Users className="h-5 w-5" />
//                 </div>
//               </div>

//               <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
//                 <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
//                   <div>
//                     <h2 className="text-lg font-bold tracking-tight text-[#1a4b8c]">
//                       Hospital Staff{" "}
//                       <span className="text-[#029352]">Accounts</span>
//                     </h2>

//                     <p className="mt-0.5 text-xs font-medium text-slate-400">
//                       Central database registry for hospital team members.
//                     </p>
//                   </div>

//                   <div className="flex shrink-0 items-center gap-3">
//                     <button
//                       type="button"
//                       onClick={fetchStaffRegistry}
//                       disabled={staffLoading}
//                       className="rounded-lg border border-slate-200 p-2 text-slate-400 transition-colors hover:bg-[#1a4b8c]/5 hover:text-[#1a4b8c] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
//                       title="Refresh Staff Registry"
//                     >
//                       <RefreshCw
//                         className={`h-4.5 w-4.5 ${
//                           staffLoading ? "animate-spin" : ""
//                         }`}
//                       />
//                     </button>

//                     <button
//                       type="button"
//                       onClick={() => setIsModalOpen(true)}
//                       className="flex items-center gap-2 rounded-md cursor-pointer bg-[#029352] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#017542] focus:outline-none"
//                     >
//                       <UserPlus className="h-3.5 w-3.5" />
//                       <span>Add New Practitioner</span>
//                     </button>
//                   </div>
//                 </div>

//                 {staffLoading && (
//                   <div className="flex min-h-65 items-center justify-center">
//                     <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a4b8c] border-t-[#029352]" />
//                   </div>
//                 )}

//                 {staffError && !staffLoading && (
//                   <div className="rounded-lg border border-rose-100 bg-rose-50 p-4 text-center text-sm font-semibold text-rose-600 shadow-sm">
//                     {staffError}
//                   </div>
//                 )}

//                 {!staffLoading && !staffError && staffData.length === 0 && (
//                   <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-14 text-center">
//                     <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-[#029352]" />

//                     <p className="text-xs font-semibold text-slate-400">
//                       No medical staff accounts found.
//                     </p>

//                     <p className="mt-1 text-xs font-medium text-slate-400">
//                       Click &quot;Add New Practitioner&quot; to create a staff
//                       account.
//                     </p>
//                   </div>
//                 )}

//                 {!staffLoading && !staffError && staffData.length > 0 && (
//                   <div className="overflow-x-auto rounded-lg border border-slate-200/60 shadow-inner">
//                     <table className="w-full border-collapse text-left">
//                       <thead>
//                         <tr className="border-b border-slate-200/60 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                           <th className="px-4 py-3">Practitioner Name</th>
//                           <th className="px-4 py-3">System Workplace Email</th>
//                           <th className="px-4 py-3">Designated Role</th>
//                           <th className="px-4 py-3">Account Status</th>
//                           <th className="px-4 py-3 text-center">Actions</th>
//                         </tr>
//                       </thead>

//                       <tbody className="divide-y divide-slate-100 bg-white text-xs font-medium text-slate-600">
//                         {staffData.map((worker: any) => (
//                           <tr
//                             key={worker._id}
//                             className="transition-colors hover:bg-[#1a4b8c]/2.5"
//                           >
//                             <td className="px-4 py-3.5 font-bold text-slate-800">
//                               {worker.name}
//                             </td>

//                             <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">
//                               {worker.email}
//                             </td>

//                             <td className="px-4 py-3.5">
//                               <span className="rounded border border-[#1a4b8c]/20 bg-[#1a4b8c]/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#1a4b8c]">
//                                 {worker.role}
//                               </span>
//                             </td>

//                             <td className="px-4 py-3.5">
//                               <span
//                                 className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
//                                   worker.isActive
//                                     ? "bg-[#029352]/10 text-[#029352]"
//                                     : "bg-rose-50 text-rose-700"
//                                 }`}
//                               >
//                                 {worker.isActive ? "Active Duty" : "Suspended"}
//                               </span>
//                             </td>

//                             <td className="px-4 py-3.5">
//                               <div className="flex items-center justify-center gap-2">
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     handleToggleDutyState(worker._id)
//                                   }
//                                   className={`rounded-md p-1.5 transition-colors focus:outline-none ${
//                                     worker.isActive
//                                       ? "text-amber-500 hover:bg-amber-50"
//                                       : "text-[#029352] hover:bg-[#029352]/10"
//                                   }`}
//                                   title={
//                                     worker.isActive
//                                       ? "Suspend Account"
//                                       : "Activate Account"
//                                   }
//                                 >
//                                   {worker.isActive ? (
//                                     <ToggleRight className="h-4 w-4" />
//                                   ) : (
//                                     <ToggleLeft className="h-4 w-4" />
//                                   )}
//                                 </button>

//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     handleAccountEviction(worker._id)
//                                   }
//                                   className="rounded-md p-1.5 text-rose-500 transition-colors hover:bg-rose-50 focus:outline-none"
//                                   title="Delete Account"
//                                 >
//                                   <Trash2 className="h-4 w-4" />
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {activeTab === "financial_ledger" && (
//             <div className="mx-auto max-w-7xl p-6 font-sans antialiased">
//               <div className="mb-6 rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm">
//                 <h1 className="text-xl font-bold tracking-tight text-[#1a4b8c]">
//                   Central Ledger <span className="text-[#029352]">Sheets</span>
//                 </h1>

//                 <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
//                   Database monitoring and revenue audits mapped inside the API
//                   layer.
//                 </p>
//               </div>
//             </div>
//           )}

//           {activeTab === "system_security" && (
//             <div className="mx-auto max-w-7xl p-6 font-sans antialiased">
//               <div className="mb-6 rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm">
//                 <h1 className="text-xl font-bold tracking-tight text-[#1a4b8c]">
//                   Security Log <span className="text-[#029352]">Summary</span>
//                 </h1>

//                 <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
//                   RBAC verification algorithms and authorization audit logs.
//                 </p>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>

//       <AddStaffModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSave={handleCreateStaffSubmit}
//       />
//     </div>
//   );
// };

// export default function App() {
//   return (
//     <AuthProvider>
//       <MainAppContent />
//     </AuthProvider>
//   );
// }


/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  UserPlus,
  ToggleLeft,
  ToggleRight,
  Trash2,
  RefreshCw,
  Users,
  ShieldCheck,
} from "lucide-react";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import { Login } from "./pages/Auth/Login";
import { TopNavbar } from "./components/Navbar/Navbar";
import { MainSidebar } from "./components/Sidebar/MainSidebar";
import { hmsServices } from "./services/apiService";
import { AdminDashboard } from "./pages/Dashboard/AdminDashboard";
import { AddStaffModal } from "./components/Staff/AddStaffModal";
import { ReceptionistWorkspace } from "./components/Receptionist/ReceptionistWorkspace";

const MainAppContent: React.FC = () => {
  const authContext = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [staffData, setStaffData] = useState<any[]>([]);
  const [staffLoading, setStaffLoading] = useState<boolean>(false);
  const [staffError, setStaffError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  if (!authContext) {
    return null;
  }

  const { isAuthenticated } = authContext;

  const fetchStaffRegistry = useCallback(async () => {
    setStaffLoading(true);
    setStaffError("");

    try {
      const response = await hmsServices.staff.getAllStaff();

      if (response.success && response.data) {
        setStaffData(response.data);
      } else {
        setStaffData([]);
        setStaffError("Failed to aggregate staff registry parameters.");
      }
    } catch (err: any) {
      setStaffError(
        err?.response?.data?.message ||
          "Network error connecting to Express database pipeline.",
      );
    } finally {
      setStaffLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && activeTab === "staff_crud") {
      fetchStaffRegistry();
    }
  }, [isAuthenticated, activeTab, fetchStaffRegistry]);

  const handleCreateStaffSubmit = async (payload: any) => {
    const response = await hmsServices.staff.createStaffAccount(payload);

    if (response.success) {
      setIsModalOpen(false);
      await fetchStaffRegistry();
    }
  };

  const handleToggleDutyState = async (id: string) => {
    try {
      const response = await hmsServices.staff.toggleStaffStatus(id);

      if (response.success) {
        setStaffData((previousData) =>
          previousData.map((worker) =>
            worker._id === id
              ? {
                  ...worker,
                  isActive: !worker.isActive,
                }
              : worker,
          ),
        );
      }
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          "Failed to modify account authorization settings.",
      );
    }
  };

  const handleAccountEviction = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this practitioner account?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await hmsServices.staff.deleteStaffAccount(id);

      if (response.success) {
        setStaffData((previousData) =>
          previousData.filter((worker) => worker._id !== id),
        );
      }
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          "Failed to execute account database deletion.",
      );
    }
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 font-sans antialiased">
      <TopNavbar />

      <div className="flex flex-1 overflow-hidden">
        <MainSidebar
          currentTab={activeTab}
          setCurrentTab={setActiveTab}
        />

        <main className="flex-1 overflow-y-auto bg-white">
          {/* Dashboard */}
          {activeTab === "dashboard" && <AdminDashboard />}

          {/* Receptionist Workspace */}
          {activeTab === "receptionist" && (
            <ReceptionistWorkspace />
          )}

          {/* Staff Registry */}
          {activeTab === "staff_crud" && (
            <div className="mx-auto max-w-7xl p-6 font-sans antialiased">
              <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm">
                <div>
                  <h1 className="text-xl font-bold uppercase tracking-tight text-[#1a4b8c]">
                    Staff Registry{" "}
                    <span className="text-[#029352]">Center</span>
                  </h1>

                  <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
                    Manage hospital practitioners, front desk executives and
                    authorized staff accounts.
                  </p>
                </div>

                <div className="shrink-0 rounded-lg border border-emerald-100 bg-[#029352]/10 p-2.5 text-[#029352]">
                  <Users className="h-5 w-5" />
                </div>
              </div>

              <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
                <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-[#1a4b8c]">
                      Hospital Staff{" "}
                      <span className="text-[#029352]">Accounts</span>
                    </h2>

                    <p className="mt-0.5 text-xs font-medium text-slate-400">
                      Central database registry for hospital team members.
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={fetchStaffRegistry}
                      disabled={staffLoading}
                      className="rounded-lg border border-slate-200 p-2 text-slate-400 transition-colors hover:bg-[#1a4b8c]/5 hover:text-[#1a4b8c] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      title="Refresh Staff Registry"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${
                          staffLoading ? "animate-spin" : ""
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="flex cursor-pointer items-center gap-2 rounded-md bg-[#029352] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#017542] focus:outline-none"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      <span>Add New Practitioner</span>
                    </button>
                  </div>
                </div>

                {staffLoading && (
                  <div className="flex min-h-65 items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a4b8c] border-t-[#029352]" />
                  </div>
                )}

                {staffError && !staffLoading && (
                  <div className="rounded-lg border border-rose-100 bg-rose-50 p-4 text-center text-sm font-semibold text-rose-600 shadow-sm">
                    {staffError}
                  </div>
                )}

                {!staffLoading &&
                  !staffError &&
                  staffData.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-14 text-center">
                      <ShieldCheck className="mx-auto mb-3 h-8 w-8 text-[#029352]" />

                      <p className="text-xs font-semibold text-slate-400">
                        No medical staff accounts found.
                      </p>

                      <p className="mt-1 text-xs font-medium text-slate-400">
                        Click &quot;Add New Practitioner&quot; to create a
                        staff account.
                      </p>
                    </div>
                  )}

                {!staffLoading &&
                  !staffError &&
                  staffData.length > 0 && (
                    <div className="overflow-x-auto rounded-lg border border-slate-200/60 shadow-inner">
                      <table className="w-full border-collapse text-left">
                        <thead>
                          <tr className="border-b border-slate-200/60 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <th className="px-4 py-3">
                              Practitioner Name
                            </th>
                            <th className="px-4 py-3">
                              System Workplace Email
                            </th>
                            <th className="px-4 py-3">Designated Role</th>
                            <th className="px-4 py-3">Account Status</th>
                            <th className="px-4 py-3 text-center">
                              Actions
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 bg-white text-xs font-medium text-slate-600">
                          {staffData.map((worker: any) => (
                            <tr
                              key={worker._id}
                              className="transition-colors hover:bg-[#1a4b8c]/2.5"
                            >
                              <td className="px-4 py-3.5 font-bold text-slate-800">
                                {worker.name}
                              </td>

                              <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">
                                {worker.email}
                              </td>

                              <td className="px-4 py-3.5">
                                <span className="rounded border border-[#1a4b8c]/20 bg-[#1a4b8c]/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#1a4b8c]">
                                  {worker.role}
                                </span>
                              </td>

                              <td className="px-4 py-3.5">
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                    worker.isActive
                                      ? "bg-[#029352]/10 text-[#029352]"
                                      : "bg-rose-50 text-rose-700"
                                  }`}
                                >
                                  {worker.isActive
                                    ? "Active Duty"
                                    : "Suspended"}
                                </span>
                              </td>

                              <td className="px-4 py-3.5">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleToggleDutyState(worker._id)
                                    }
                                    className={`rounded-md p-1.5 transition-colors focus:outline-none ${
                                      worker.isActive
                                        ? "text-amber-500 hover:bg-amber-50"
                                        : "text-[#029352] hover:bg-[#029352]/10"
                                    }`}
                                    title={
                                      worker.isActive
                                        ? "Suspend Account"
                                        : "Activate Account"
                                    }
                                  >
                                    {worker.isActive ? (
                                      <ToggleRight className="h-4 w-4" />
                                    ) : (
                                      <ToggleLeft className="h-4 w-4" />
                                    )}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAccountEviction(worker._id)
                                    }
                                    className="rounded-md p-1.5 text-rose-500 transition-colors hover:bg-rose-50 focus:outline-none"
                                    title="Delete Account"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Financial Ledger */}
          {activeTab === "financial_ledger" && (
            <div className="mx-auto max-w-7xl p-6 font-sans antialiased">
              <div className="mb-6 rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm">
                <h1 className="text-xl font-bold tracking-tight text-[#1a4b8c]">
                  Central Ledger{" "}
                  <span className="text-[#029352]">Sheets</span>
                </h1>

                <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
                  Database monitoring and revenue audits mapped inside the API
                  layer.
                </p>
              </div>
            </div>
          )}

          {/* System Security */}
          {activeTab === "system_security" && (
            <div className="mx-auto max-w-7xl p-6 font-sans antialiased">
              <div className="mb-6 rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm">
                <h1 className="text-xl font-bold tracking-tight text-[#1a4b8c]">
                  Security Log{" "}
                  <span className="text-[#029352]">Summary</span>
                </h1>

                <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
                  RBAC verification algorithms and authorization audit logs.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      <AddStaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateStaffSubmit}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
