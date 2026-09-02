import React from "react";
import { Layers } from "lucide-react";

export const FinancialLedger: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl p-6 font-sans antialiased">
      <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1a4b8c]">
            Central Ledger <span className="text-[#029352]">Sheets</span>
          </h1>

          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
            Database monitoring and revenue audits mapped inside the API layer.
          </p>
        </div>

        <div className="shrink-0 rounded-lg border border-emerald-100 bg-[#029352]/10 p-2.5 text-[#029352]">
          <Layers className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};
