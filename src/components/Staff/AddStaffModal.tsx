/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import {
  X,
  UserPlus,
  Mail,
  Lock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => Promise<void>;
}

export const AddStaffModal: React.FC<AddStaffModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("doctor");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      await onSave({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      setName("");
      setEmail("");
      setPassword("");
      setRole("doctor");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Database registration request could not be completed.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) {
      return;
    }

    setError("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 font-sans antialiased backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-staff-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 bg-slate-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-emerald-100 bg-[#029352]/10 p-2 text-[#029352]">
              <UserPlus className="h-4 w-4" />
            </div>

            <div>
              <h3
                id="register-staff-title"
                className="text-sm font-bold uppercase tracking-wide text-[#1a4b8c]"
              >
                Register Staff <span className="text-[#029352]">Profile</span>
              </h3>

              <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                Create an authorized hospital staff account.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#1a4b8c]/5 hover:text-[#1a4b8c] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close staff registration modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-rose-100 bg-rose-50 p-3 text-xs font-semibold text-rose-600">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label
              htmlFor="staff-name"
              className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400"
            >
              Full Name
            </label>

            <input
              id="staff-name"
              type="text"
              required
              minLength={2}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Dr. Shahzad Aslam"
              className="w-full rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="staff-email"
              className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400"
            >
              Workplace Email
            </label>

            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#1a4b8c]/60" />

              <input
                id="staff-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="dr.shahzad@hospital.com"
                className="w-full rounded-lg border border-slate-200/80 bg-slate-50 py-2.5 pl-9 pr-3 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="staff-password"
              className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400"
            >
              Secure Password
            </label>

            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#1a4b8c]/60" />

              <input
                id="staff-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-200/80 bg-slate-50 py-2.5 pl-9 pr-3 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
              />
            </div>

            <p className="mt-1.5 text-[10px] font-medium text-slate-400">
              Password must contain at least 6 characters.
            </p>
          </div>

          {/* Staff Role */}
          <div>
            <label
              htmlFor="staff-role"
              className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400"
            >
              Designated Staff Role
            </label>

            <div className="relative">
              <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#029352]" />

              <select
                id="staff-role"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200/80 bg-slate-50 py-2.5 pl-9 pr-3 text-xs font-bold uppercase tracking-wider text-slate-600 outline-none transition-all focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
              >
                <option value="doctor">DOCTOR</option>
                <option value="receptionist">RECEPTIONIST</option>
                <option value="pharmacist">PHARMACIST</option>
                <option value="laboratorian">LAB TECHNICIAN</option>
                <option value="accountant">ACCOUNTANT</option>
              </select>

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#1a4b8c]">
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* Form Footer */}
          <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <div className="hidden items-center gap-1.5 text-[10px] font-semibold text-[#029352] sm:flex">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Secure Registration</span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="rounded-lg border border-slate-200 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-colors hover:bg-slate-50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex min-w-28 items-center justify-center gap-2 rounded-lg bg-[#1a4b8c] px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#143b6e] focus:outline-none focus:ring-2 focus:ring-[#029352]/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>Saving</span>
                  </>
                ) : (
                  <span className="py-0.5 text-[10px]">Register</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
