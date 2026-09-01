import React from "react";
import { LayoutDashboard, Users, ShieldAlert, Layers } from "lucide-react";

interface MainSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const MainSidebar: React.FC<MainSidebarProps> = ({
  currentTab,
  setCurrentTab,
}) => {
  const tabs = [
    { id: "dashboard", name: "Analytics Monitor", icon: LayoutDashboard },
    { id: "staff_crud", name: "Manage Hospital Staff", icon: Users },
    { id: "financial_ledger", name: "Financial Billings", icon: Layers },
    { id: "system_security", name: "Audit Security Logs", icon: ShieldAlert },
  ];

  return (
    <aside className="w-66 bg-white border-r border-slate-200/80 flex flex-col font-sans shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none antialiased">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
          Access Framework
        </span>
        <h3 className="font-bold text-sm tracking-normal mt-0.5 text-[#1a4b8c]">
          SUPER ADMIN <span className="text-[#029352]">LEVEL</span>
        </h3>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`relative w-full flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 text-left cursor-pointer focus:outline-none group ${
                isActive
                  ? "bg-[#1a4b8c] text-white shadow-md shadow-blue-900/10 font-bold"
                  : "text-slate-600 hover:text-[#1a4b8c] hover:bg-slate-50"
              }`}
            >
              {/* Dynamic Left Green Accent Strip - Visible only on Active State */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-[#029352] rounded-r-md" />
              )}

              {/* Icon Color: White when active, changes to Brand Green on Hover */}
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors duration-150 ${
                  isActive
                    ? "text-white"
                    : "text-slate-400 group-hover:text-[#029352]"
                }`}
              />
              <span className="truncate">{tab.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer System Version Block */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/30 text-center shrink-0">
        <span className="text-[10px] font-semibold text-slate-400 tracking-wide block uppercase">
          HMS Node v1.0.0 Stable
        </span>
      </div>
    </aside>
  );
};
