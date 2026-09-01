/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { LogIn } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { ProfileCard } from "./ProfileCard";

export const TopNavbar: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (!authContext) return null;
  const { user, logout } = authContext;

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 left-0 right-0 h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between z-40 font-sans antialiased select-none">
      <div className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="HMS Logo"
          className="h-10 w-auto object-contain"
        />
        <div className="flex items-center">
          <span className="text-base font-bold text-[#1a4b8c] uppercase font-sans">
            MEDICAL <span className="text-[#029352]">CENTER</span>
          </span>
        </div>
      </div>

      <div ref={dropdownRef} className="relative flex items-center font-sans antialiased">
        {user ? (
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDropdown}
              className="w-10 h-10 rounded-full bg-[#029352] hover:bg-[#01693a] text-white font-semibold text-base transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md active:scale-95 focus:outline-none"
            >
              {user.name.charAt(0).toUpperCase()}
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <ProfileCard
                  user={user}
                  onLogout={logout}
                  isOpen={dropdownOpen}
                />
              )}
            </AnimatePresence>
          </div>
        ) : (
          <button className="flex items-center gap-2 bg-[#1a4b8c] hover:bg-[#0f3261] text-white font-bold text-xs uppercase tracking-wider h-10 px-4.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer focus:outline-none">
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
