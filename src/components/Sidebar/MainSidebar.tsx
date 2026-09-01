// import React from "react";
// import { LayoutDashboard, Users, ShieldAlert, Layers } from "lucide-react";

// interface MainSidebarProps {
//   currentTab: string;
//   setCurrentTab: (tab: string) => void;
// }

// export const MainSidebar: React.FC<MainSidebarProps> = ({
//   currentTab,
//   setCurrentTab,
// }) => {
//   const tabs = [
//     { id: "dashboard", name: "Analytics Monitor", icon: LayoutDashboard },
//     { id: "staff_crud", name: "Manage Hospital Staff", icon: Users },
//     { id: "financial_ledger", name: "Financial Billings", icon: Layers },
//     { id: "system_security", name: "Audit Security Logs", icon: ShieldAlert },
//   ];

//   return (
//     <aside className="w-66 bg-white border-r border-slate-200/80 flex flex-col font-sans shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none antialiased">
//       <div className="p-4 border-b border-slate-100 bg-slate-50/50">
//         <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
//           Access Framework
//         </span>
//         <h3 className="font-bold text-sm tracking-normal mt-0.5 text-[#1a4b8c]">
//           SUPER ADMIN <span className="text-[#029352]">LEVEL</span>
//         </h3>
//       </div>

//       <nav className="flex-1 px-3 py-2.5 space-y-2.5 overflow-y-auto custom-scrollbar">
//         {tabs.map((tab) => {
//           const Icon = tab.icon;
//           const isActive = currentTab === tab.id;
//           return (
//             <button
//               key={tab.id}
//               onClick={() => setCurrentTab(tab.id)}
//               className={`relative w-full flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-md text-xs font-semibold transition-all duration-150 text-left cursor-pointer focus:outline-none group ${
//                 isActive
//                   ? "bg-[#1a4b8c] text-white shadow-md shadow-blue-900/10 font-bold"
//                   : "text-slate-600 hover:text-[#1a4b8c] hover:bg-slate-50"
//               }`}
//             >
//               {isActive && (
//                 <div className="absolute left-0 top-2 bottom-2 w-0.75 bg-[#029352] rounded-r-md" />
//               )}

//               <Icon
//                 className={`w-4 h-4 shrink-0 transition-colors duration-150 ${
//                   isActive
//                     ? "text-white"
//                     : "text-slate-400 group-hover:text-[#029352]"
//                 }`}
//               />
//               <span className="truncate">{tab.name}</span>
//             </button>
//           );
//         })}
//       </nav>

//       <div className="p-3.5 border-t border-slate-100 bg-slate-50/30 text-center shrink-0">
//         <span className="text-[10px] font-semibold text-slate-400 tracking-wide block uppercase">
//           HMS Node v1.0.0 Stable
//         </span>
//       </div>
//     </aside>
//   );
// };


import React from "react";
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  Layers,
  UserRoundCheck,
} from "lucide-react";

interface MainSidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const MainSidebar: React.FC<MainSidebarProps> = ({
  currentTab,
  setCurrentTab,
}) => {
  const tabs = [
    {
      id: "dashboard",
      name: "Analytics Monitor",
      icon: LayoutDashboard,
    },
    {
      id: "receptionist",
      name: "Receptionist Workspace",
      icon: UserRoundCheck,
    },
    {
      id: "staff_crud",
      name: "Manage Hospital Staff",
      icon: Users,
    },
    {
      id: "financial_ledger",
      name: "Financial Billings",
      icon: Layers,
    },
    {
      id: "system_security",
      name: "Audit Security Logs",
      icon: ShieldAlert,
    },
  ];

  return (
    <aside className="sticky top-16 flex h-[calc(100vh-4rem)] w-66 shrink-0 flex-col border-r border-slate-200/80 bg-white font-sans antialiased">
      {/* Sidebar Header */}
      <div className="border-b border-slate-100 bg-slate-50/50 p-4">
        <span className="block text-[11px] font-bold uppercase tracking-wide text-slate-400">
          Access Framework
        </span>

        <h3 className="mt-0.5 text-sm font-bold tracking-normal text-[#1a4b8c]">
          SUPER ADMIN{" "}
          <span className="text-[#029352]">LEVEL</span>
        </h3>
      </div>

      {/* Navigation */}
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

              {tab.id === "receptionist" && !isActive && (
                <span className="ml-auto rounded-full bg-[#029352]/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-[#029352]">
                  OPD
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="shrink-0 border-t border-slate-100 bg-slate-50/30 p-3.5 text-center">
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