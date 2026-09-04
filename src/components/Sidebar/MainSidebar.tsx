import React, { useContext } from "react";
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  UserRoundCheck,
  Stethoscope,
  Beaker,
  Pill,
  Receipt,
  CalendarDays,
  Layers,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

interface MainSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const MainSidebar: React.FC<MainSidebarProps> = ({
  currentTab,
  setCurrentTab,
}) => {
  const authContext = useContext(AuthContext);

  const userRole = authContext?.user?.role || "";

  const allTabs = [
    {
      id: "dashboard",
      name: "Analytics Monitor",
      icon: LayoutDashboard,
      allowedRoles: [
        "super_admin",
        "receptionist",
        "doctor",
        "laboratorian",
        "pharmacist",
        "accountant",
      ],
      badge: {
        text: "LIVE",
        color: "bg-[#1a4b8c]/10 text-[#1a4b8c]",
      },
    },
    {
      id: "receptionist",
      name: "Receptionist Workspace",
      icon: UserRoundCheck,
      allowedRoles: ["super_admin", "receptionist"],
      badge: {
        text: "OPD",
        color: "bg-[#029352]/10 text-[#029352]",
      },
    },
    {
      id: "appointments",
      name: "Appointments",
      icon: CalendarDays,
      allowedRoles: ["super_admin", "receptionist", "doctor"],
      badge: {
        text: "BOOK",
        color: "bg-[#1a4b8c]/10 text-[#1a4b8c]",
      },
    },
    {
      id: "doctor",
      name: "Doctor Workspace",
      icon: Stethoscope,
      allowedRoles: ["super_admin", "doctor"],
      badge: {
        text: "EMR",
        color: "bg-[#1a4b8c]/10 text-[#1a4b8c]",
      },
    },
    {
      id: "lab",
      name: "Laboratory Workspace",
      icon: Beaker,
      allowedRoles: ["super_admin", "laboratorian"],
      badge: {
        text: "TEST",
        color: "bg-[#029352]/10 text-[#029352]",
      },
    },
    {
      id: "pharmacy",
      name: "Pharmacy Workspace",
      icon: Pill,
      allowedRoles: ["super_admin", "pharmacist"],
      badge: {
        text: "RX",
        color: "bg-[#1a4b8c]/10 text-[#1a4b8c]",
      },
    },
    {
      id: "billing",
      name: "Billing Workspace",
      icon: Receipt,
      allowedRoles: ["super_admin", "accountant"],
      badge: {
        text: "PAY",
        color: "bg-[#029352]/10 text-[#029352]",
      },
    },
    {
      id: "financial_ledger",
      name: "Financial Ledger",
      icon: Layers,
      allowedRoles: ["super_admin", "accountant"],
      badge: {
        text: "LEDGER",
        color: "bg-slate-100 text-slate-600",
      },
    },
    {
      id: "staff_crud",
      name: "Manage Hospital Staff",
      icon: Users,
      allowedRoles: ["super_admin"],
      badge: {
        text: "CRUD",
        color: "bg-slate-100 text-slate-600",
      },
    },
    {
      id: "system_security",
      name: "Audit Security Logs",
      icon: ShieldAlert,
      allowedRoles: ["super_admin"],
      badge: {
        text: "SEC",
        color: "bg-rose-50 text-rose-600",
      },
    },
  ];

  const tabs = allTabs.filter((tab) => tab.allowedRoles.includes(userRole));

  const roleLabel = userRole
    ? userRole.replace(/_/g, " ").toUpperCase()
    : "AUTHORIZED USER";

  return (
    <aside className="sticky top-16 flex h-[calc(100vh-4rem)] w-66 shrink-0 flex-col border-r border-slate-200/80 bg-white font-sans antialiased">
      <div className="border-b border-slate-100 bg-slate-50/50 p-4 select-none">
        <span className="block text-[11px] font-bold uppercase tracking-wide text-slate-400">
          Access Framework
        </span>

        <h3 className="mt-0.5 text-sm font-bold tracking-normal text-[#1a4b8c]">
          {roleLabel} <span className="text-[#029352]">LEVEL</span>
        </h3>
      </div>

      <nav
        className="custom-scrollbar flex-1 space-y-2.5 overflow-y-auto px-3 py-3"
        aria-label="Hospital management navigation"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCurrentTab(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={`group relative flex w-full cursor-pointer items-center gap-3 rounded-md py-2.5 pl-4 pr-3 text-left text-xs transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#029352]/30 ${
                isActive
                  ? "bg-[#1a4b8c] font-bold text-white shadow-md shadow-blue-900/10"
                  : "font-semibold text-slate-600 hover:bg-[#029352]/5 hover:text-[#1a4b8c]"
              }`}
            >
              {isActive && (
                <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-md bg-[#029352]" />
              )}

              <Icon
                className={`h-4 w-4 shrink-0 transition-colors duration-150 ${
                  isActive
                    ? "text-[#029352]"
                    : "text-slate-400 group-hover:text-[#029352]"
                }`}
              />

              <span className="truncate">{tab.name}</span>

              <span
                className={`ml-auto rounded-full px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide transition-all ${
                  isActive ? "bg-white/20 text-white" : tab.badge.color
                }`}
              >
                {tab.badge.text}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-slate-100 bg-slate-50/30 p-3.5 text-center select-none">
        <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          HMS Node v1.0.0 Stable
        </span>

        <span className="mt-1 block text-[9px] font-medium text-[#029352]">
          Secure Medical Operations
        </span>
      </div>
    </aside>
  );
};
