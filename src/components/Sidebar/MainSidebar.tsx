import React, { useContext } from "react";
import {
  BedDouble,
  Beaker,
  CalendarDays,
  LayoutDashboard,
  Layers,
  Pill,
  Receipt,
  ShieldAlert,
  Stethoscope,
  UserRoundCheck,
  Users,
  X,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

interface MainSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const MainSidebar: React.FC<MainSidebarProps> = ({
  currentTab,
  setCurrentTab,
  isMobileOpen,
  onMobileClose,
}) => {
  const authContext = useContext(AuthContext);

  const userRole = authContext?.user?.role || "";

  const allTabs = [
    {
      id: "dashboard",
      name: "Analytics Monitor",
      icon: LayoutDashboard,
      allowedRoles: ["super_admin"],
    },
    {
      id: "receptionist",
      name: "Receptionist Workspace",
      icon: UserRoundCheck,
      allowedRoles: ["super_admin", "receptionist"],
    },
    {
      id: "appointments",
      name: "Appointments",
      icon: CalendarDays,
      allowedRoles: ["super_admin", "receptionist", "doctor"],
    },
    {
      id: "doctor",
      name: "Doctor Workspace",
      icon: Stethoscope,
      allowedRoles: ["super_admin", "doctor"],
    },
    {
      id: "lab",
      name: "Laboratory Workspace",
      icon: Beaker,
      allowedRoles: ["super_admin", "laboratorian"],
    },
    {
      id: "pharmacy",
      name: "Pharmacy Workspace",
      icon: Pill,
      allowedRoles: ["super_admin", "pharmacist"],
    },
    {
      id: "billing",
      name: "Billing Workspace",
      icon: Receipt,
      allowedRoles: ["super_admin", "accountant"],
    },
    {
      id: "financial_ledger",
      name: "Financial Ledger",
      icon: Layers,
      allowedRoles: ["super_admin", "accountant"],
    },
    {
      id: "ipd",
      name: "IPD Management",
      icon: BedDouble,
      allowedRoles: ["super_admin", "receptionist", "doctor"],
    },
    {
      id: "staff_crud",
      name: "Manage Hospital Staff",
      icon: Users,
      allowedRoles: ["super_admin"],
    },
    {
      id: "system_security",
      name: "Audit Security Logs",
      icon: ShieldAlert,
      allowedRoles: ["super_admin"],
    },
  ];

  const tabs = allTabs.filter((tab) => tab.allowedRoles.includes(userRole));

  const roleLabel = userRole
    ? userRole.replace(/_/g, " ").toUpperCase()
    : "AUTHORIZED USER";

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    onMobileClose();
  };

  return (
    <>
      <button
        type="button"
        onClick={onMobileClose}
        aria-label="Close navigation overlay"
        className={`fixed inset-0 z-40 bg-[#1a4b8c]/30 backdrop-blur-[1px] transition-opacity duration-300 lg:hidden ${
          isMobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-70 max-w-[82vw] flex-col border-r border-slate-200/80 bg-white font-sans antialiased shadow-xl transition-transform duration-300 ease-out lg:sticky lg:top-16 lg:z-30 lg:h-[calc(100vh-4rem)] lg:w-66 lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:shadow-none ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Hospital management sidebar"
      >
        <div className="flex items-start justify-between border-b border-slate-100 bg-slate-50/50 p-4 select-none">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wide text-slate-400">
              Access Framework
            </span>

            <h3 className="mt-0.5 text-sm font-bold tracking-normal text-[#1a4b8c]">
              {roleLabel} <span className="text-[#029352]">LEVEL</span>
            </h3>
          </div>

          <button
            type="button"
            onClick={onMobileClose}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-[#1a4b8c] transition-colors hover:bg-[#1a4b8c]/5 focus:outline-none focus:ring-2 focus:ring-[#029352]/30 lg:hidden"
            aria-label="Close navigation menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav
          className="custom-scrollbar flex-1 space-y-2 overflow-y-auto px-3 py-3"
          aria-label="Hospital management navigation"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex w-full cursor-pointer items-center gap-3 rounded-md px-4 py-3 text-left text-xs transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#029352]/30 ${
                  isActive
                    ? "bg-[#1a4b8c] font-bold text-white shadow-md shadow-[#1a4b8c]/15"
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
    </>
  );
};
