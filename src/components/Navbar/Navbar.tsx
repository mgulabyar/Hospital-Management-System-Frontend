/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext, useEffect, useRef, useState } from "react";
import { LogIn, Menu, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { ProfileCard } from "./ProfileCard";

interface TopNavbarProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onMenuToggle,
  isMenuOpen = false,
}) => {
  const authContext = useContext(AuthContext);

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  if (!authContext) {
    return null;
  }

  const { user, logout } = authContext;

  const toggleDropdown = () => {
    setDropdownOpen((previous) => !previous);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-3 font-sans antialiased select-none sm:px-5 lg:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        {user && onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-[#1a4b8c] transition-colors hover:bg-[#1a4b8c]/5 focus:outline-none focus:ring-2 focus:ring-[#029352]/30 lg:hidden"
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        )}

        <img
          src="/logo.png"
          alt="HMS Logo"
          className="h-9 w-auto shrink-0 object-contain sm:h-10"
        />

        <div className="min-w-0">
          <span className="block truncate text-sm font-bold uppercase text-[#1a4b8c] sm:text-base">
            Medical <span className="text-[#029352]">Center</span>
          </span>

          {user && (
            <span className="hidden truncate text-[9px] font-semibold uppercase tracking-wide text-slate-400 sm:block">
              {user.role.replace(/_/g, " ")}
            </span>
          )}
        </div>
      </div>

      <div
        ref={dropdownRef}
        className="relative flex shrink-0 items-center font-sans antialiased"
      >
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden max-w-40 text-right md:block">
              <p className="truncate text-xs font-bold text-[#1a4b8c]">
                {user.name}
              </p>

              <p className="mt-0.5 truncate text-[10px] font-medium text-slate-400">
                {user.email}
              </p>
            </div>

            <button
              type="button"
              onClick={toggleDropdown}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#029352] text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#029352]/90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30 active:scale-95"
              aria-label="Open user profile menu"
              aria-expanded={dropdownOpen}
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
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-md bg-[#1a4b8c] px-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all duration-200 hover:bg-[#1a4b8c]/90 hover:shadow-md focus:outline-none sm:px-4"
          >
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
