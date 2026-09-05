/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext, useEffect, useMemo, useState } from "react";
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
import { IPDWorkspace } from "./components/IPD/IPDWorkspace";

const roleTabAccess: Record<string, string[]> = {
  super_admin: [
    "dashboard",
    "receptionist",
    "appointments",
    "doctor",
    "lab",
    "pharmacy",
    "billing",
    "financial_ledger",
    "staff_crud",
    "system_security",
    "ipd",
  ],
  receptionist: ["receptionist", "appointments", "ipd"],
  doctor: ["doctor", "appointments", "ipd"],
  laboratorian: ["lab"],
  pharmacist: ["pharmacy"],
  accountant: ["billing", "financial_ledger"],
  patient: [],
};

const roleDefaultTab: Record<string, string> = {
  super_admin: "dashboard",
  receptionist: "receptionist",
  doctor: "doctor",
  laboratorian: "lab",
  pharmacist: "pharmacy",
  accountant: "billing",
  patient: "dashboard",
};

const MainAppContent: React.FC = () => {
  const authContext = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState<boolean>(false);

  if (!authContext) {
    return null;
  }

  const { isAuthenticated, user } = authContext;

  const userRole = user?.role || "patient";

  const allowedTabs = useMemo(() => roleTabAccess[userRole] || [], [userRole]);

  const defaultTab = roleDefaultTab[userRole] || "dashboard";

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (!allowedTabs.includes(activeTab)) {
      setActiveTab(defaultTab);
    }
  }, [activeTab, allowedTabs, defaultTab, isAuthenticated]);

  useEffect(() => {
    const handleDesktopResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleDesktopResize);

    return () => window.removeEventListener("resize", handleDesktopResize);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  

  return (
    <div className="flex min-h-screen flex-col  bg-slate-50 font-sans antialiased">
      <TopNavbar
        onMenuToggle={() => setIsMobileSidebarOpen((previous) => !previous)}
        isMenuOpen={isMobileSidebarOpen}
      />

      <div className="flex min-h-0 flex-1">
        <MainSidebar
          currentTab={activeTab}
          setCurrentTab={handleTabChange}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />

        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-white">
          {activeTab === "dashboard" && userRole === "super_admin" && (
            <AdminDashboard />
          )}

          {activeTab === "receptionist" && <ReceptionistWorkspace />}

          {activeTab === "appointments" && <AppointmentWorkspace />}

          {activeTab === "doctor" && <DoctorWorkspace />}

          {activeTab === "lab" && <LabWorkspace />}

          {activeTab === "pharmacy" && <PharmacyWorkspace />}

          {activeTab === "billing" && <BillingWorkspace />}

          {activeTab === "financial_ledger" && <FinancialLedger />}

          {activeTab === "staff_crud" && <StaffRegistry />}

          {activeTab === "system_security" && <SecurityLogsWorkspace />}

          {activeTab === "ipd" && <IPDWorkspace />}
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
