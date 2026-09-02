import React from "react";
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  UserRoundCheck,
  Stethoscope,
  Beaker,
  Pill,
  Receipt,
} from "lucide-react";

interface MainSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const MainSidebar: React.FC<MainSidebarProps> = ({
  currentTab,
  setCurrentTab,
}) => {
  // FIXED: Removed the redundant 'financial_ledger' element object from the array loop
  const tabs = [
    {
      id: "dashboard",
      name: "Analytics Monitor",
      icon: LayoutDashboard,
      badge: {
        text: "LIVE",
        color: "bg-[#1a4b8c]/10 text-[#1a4b8c]",
      },
    },
    {
      id: "receptionist",
      name: "Receptionist Workspace",
      icon: UserRoundCheck,
      badge: {
        text: "OPD",
        color: "bg-[#029352]/10 text-[#029352]",
      },
    },
    {
      id: "doctor",
      name: "Doctor Workspace",
      icon: Stethoscope,
      badge: {
        text: "EMR",
        color: "bg-[#1a4b8c]/10 text-[#1a4b8c]",
      },
    },
    {
      id: "lab",
      name: "Laboratory Workspace",
      icon: Beaker,
      badge: {
        text: "TEST",
        color: "bg-[#029352]/10 text-[#029352]",
      },
    },
    {
      id: "pharmacy",
      name: "Pharmacy Workspace",
      icon: Pill,
      badge: {
        text: "RX",
        color: "bg-[#1a4b8c]/10 text-[#1a4b8c]",
      },
    },
    {
      id: "billing",
      name: "Billing Workspace",
      icon: Receipt,
      badge: {
        text: "PAY",
        color: "bg-[#029352]/10 text-[#029352]",
      },
    },
    {
      id: "staff_crud",
      name: "Manage Hospital Staff",
      icon: Users,
      badge: {
        text: "CRUD",
        color: "bg-slate-100 text-slate-600",
      },
    },
    {
      id: "system_security",
      name: "Audit Security Logs",
      icon: ShieldAlert,
      badge: {
        text: "SEC",
        color: "bg-rose-50 text-rose-600",
      },
    },
  ];

  return (
    <aside className="sticky top-16 flex h-[calc(100vh-4rem)] w-66 shrink-0 flex-col border-r border-slate-200/80 bg-white font-sans antialiased">
      {/* Access Authentication Branding Box */}
      <div className="border-b border-slate-100 bg-slate-50/50 p-4 select-none">
        <span className="block text-[11px] font-bold uppercase tracking-wide text-slate-400">
          Access Framework
        </span>
        <h3 className="mt-0.5 text-sm font-bold tracking-normal text-[#1a4b8c]">
          SUPER ADMIN <span className="text-[#029352]">LEVEL</span>
        </h3>
      </div>

      {/* Navigation Map Action Buttons Area Container */}
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

              {/* Dynamic Badges Container Overlay */}
              {tab.badge && (
                <span
                  className={`ml-auto rounded-full px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide transition-all ${
                    isActive ? "bg-white/20 text-white" : tab.badge.color
                  }`}
                >
                  {tab.badge.text}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Static Footer Brand Labels */}
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
