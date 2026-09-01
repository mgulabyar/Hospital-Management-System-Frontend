/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { hmsServices } from "../../services/apiService";
import { Lock, Mail, AlertCircle } from "lucide-react";

export const Login: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  if (!authContext) return null;
  const { login } = authContext;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await hmsServices.auth.login({ email, password });
      if (response.success && response.data) {
        login(response.data);
      } else {
        setError("Authentication verification failed.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Invalid credentials or network failure.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans antialiased select-none">
      <div className="max-w-sm w-full bg-white rounded-lg border border-slate-200/60 shadow-xl p-6 transition-all duration-300">
        {/* LOGO & HEADINGS */}
        <div className="text-center mb-6">
          <img
            src="/logo.png"
            alt="HMS Logo"
            className="mx-auto h-16 w-auto mb-3 hover:scale-105 transition-transform duration-300"
          />
          <h2 className="text-xl font-bold text-[#1a4b8c] tracking-tight">
            HMS Portal Login
          </h2>
          <p className="text-xs text-slate-600 font-semibold mt-1 leading-relaxed">
            Access your administrative clinical workstation dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 flex items-start gap-2 text-xs text-rose-600 font-semibold animate-pulse">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-[#1a4b8c] uppercase block mb-1 tracking-wide">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hospital.com"
                className="w-full h-11 pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#029352] focus:bg-white transition-all duration-200 font-medium text-slate-800 placeholder-slate-400 shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#1a4b8c] uppercase block mb-1 tracking-wide">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#029352] focus:bg-white transition-all duration-200 font-medium text-slate-800 placeholder-slate-400 shadow-sm"
              />
            </div>
          </div>

          <div className="relative flex py-1 items-center justify-center">
            <div className="grow border-t border-slate-300"></div>
            <span className="shrink mx-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
              OR
            </span>
            <div className="grow border-t border-slate-300"></div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 cursor-pointer bg-[#029352] hover:bg-[#027d45] text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
