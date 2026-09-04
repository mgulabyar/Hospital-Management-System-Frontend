/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { Login } from "./pages/Auth/Login";
import { TopNavbar } from "./components/Navbar/Navbar";
import { MainSidebar } from "./components/Sidebar/MainSidebar";
import { AdminDashboard } from "./pages/Dashboard/AdminDashboard";
import { ReceptionistWorkspace } from "./components/Receptionist/ReceptionistWorkspace";
import { AppointmentWorkspace } from "./components/Appointments/AppointmentWorkspace";
import { DoctorWorkspace } from "./components/Doctor/DoctorWorkspace";
import { LabWorkspace } from "./components/Lab/LabWorkspace";
import { PharmacyWorkspace } from "./components/Pharmacy/PharmacyWorkspace";
import { BillingWorkspace } from "./components/Billing/BillingWorkspace";
import { SecurityLogsWorkspace } from "./components/Security/SecurityLogsWorkspace";
import { StaffRegistry } from "./components/Staff/StaffRegistry";
import { FinancialLedger } from "./components/FinancialLedger/FinancialLedger";

const MainAppContent: React.FC = () => {
  const authContext = useContext(AuthContext);

  const [activeTab, setActiveTab] = React.useState<string>("dashboard");

  if (!authContext) {
    return null;
  }

  const { isAuthenticated, user } = authContext;

  const roleTabAccess: Record<string, string[]> = {
    super_admin: [
      "dashboard",
      "receptionist",
      "appointments",
      "doctor",
      "lab",
      "pharmacy",
      "billing",
      "staff_crud",
      "financial_ledger",
      "system_security",
    ],
    receptionist: ["dashboard", "receptionist", "appointments"],
    doctor: ["dashboard", "appointments", "doctor"],
    laboratorian: ["dashboard", "lab"],
    pharmacist: ["dashboard", "pharmacy"],
    accountant: ["dashboard", "billing", "financial_ledger"],
    patient: ["dashboard"],
  };

  const allowedTabs = roleTabAccess[user?.role || "patient"] || ["dashboard"];

  useEffect(() => {
    if (!allowedTabs.includes(activeTab)) {
      setActiveTab("dashboard");
    }
  }, [activeTab, allowedTabs]);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 font-sans antialiased">
      <TopNavbar />

      <div className="flex flex-1 overflow-hidden">
        <MainSidebar currentTab={activeTab} setCurrentTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto bg-white">
          {activeTab === "dashboard" && <AdminDashboard />}

          {activeTab === "receptionist" && <ReceptionistWorkspace />}

          {activeTab === "appointments" && <AppointmentWorkspace />}

          {activeTab === "doctor" && <DoctorWorkspace />}

          {activeTab === "lab" && <LabWorkspace />}

          {activeTab === "pharmacy" && <PharmacyWorkspace />}

          {activeTab === "billing" && <BillingWorkspace />}

          {activeTab === "staff_crud" && <StaffRegistry />}

          {activeTab === "financial_ledger" && <FinancialLedger />}

          {activeTab === "system_security" && <SecurityLogsWorkspace />}
        </main>
      </div>
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
