import React from "react";
import { motion } from "framer-motion";
import { Settings, RefreshCw, LogOut, ShieldAlert } from "lucide-react";
import type { UserSession } from "../../context/AuthContext";

interface ProfileCardProps {
  user: UserSession;
  onLogout: () => void;
  isOpen: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  onLogout,
  isOpen,
}) => {
  if (!isOpen) return null;

  const initialLetter = user.name.charAt(0).toUpperCase();

  const menuItems = [
    { label: "Workstation Settings", icon: Settings },
    { label: "RBAC Security Audits", icon: ShieldAlert },
    { label: "System Recovery Center", icon: RefreshCw },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200/80 p-4 z-50 font-sans antialiased"
    >
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100 select-none">
        <div className="w-10 h-10 rounded-full bg-[#1a4b8c] flex items-center justify-center text-white font-bold text-sm shrink-0">
          {initialLetter}
        </div>
        <div className="overflow-hidden">
          <h4 className="font-semibold text-[#1a4b8c] text-sm truncate leading-snug">
            {user.name}
          </h4>
          <p className="text-xs font-medium text-[#1a4b8c] truncate mt-0.5">
            {user.email}
          </p>
        </div>
      </div>

      <div className="py-3 flex flex-col">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <button
              key={index}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-slate-600 hover:text-[#1a4b8c] hover:bg-slate-50 rounded-md transition-all duration-150 text-left cursor-pointer focus:outline-none group"
            >
              <IconComponent className="w-3 h-3 text-slate-400 group-hover:text-[#1a4b8c] transition-colors shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Session Logout Section */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 w-full bg-rose-50 hover:bg-rose-100/80 text-rose-600 font-bold text-xs py-3 px-3 rounded-lg transition-all duration-150 cursor-pointer focus:outline-none active:scale-[0.99]"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="text-[14px] font-semibold">Logout</span>
        </button>
      </div>
    </motion.div>
  );
};
