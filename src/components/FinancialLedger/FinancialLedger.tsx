/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useCallback, useEffect, useState } from "react";
import {
  Banknote,
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  Layers,
  RefreshCw,
  Search,
  Wallet,
} from "lucide-react";
import { hmsBillingServices } from "../../services/billingService";

const formatCurrency = (amount?: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

const formatDate = (dateValue?: string) => {
  if (!dateValue) {
    return "N/A";
  }

  return new Date(dateValue).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusStyle = (status: string) => {
  if (status === "Paid") {
    return "border-emerald-100 bg-emerald-50 text-[#029352]";
  }

  if (status === "Partial") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-rose-100 bg-rose-50 text-rose-600";
};

export const FinancialLedger: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const fetchLedgerData = useCallback(async () => {
    setLoading(true);

    try {
      const [invoiceResponse, analyticsResponse] = await Promise.all([
        hmsBillingServices.getInvoices({
          paymentStatus: paymentStatus || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        }),
        hmsBillingServices.getDashboardAnalytics(),
      ]);

      if (invoiceResponse.success) {
        setInvoices(invoiceResponse.data || []);
      } else {
        setInvoices([]);
      }

      if (analyticsResponse.success) {
        setAnalytics(analyticsResponse.data || null);
      } else {
        setAnalytics(null);
      }
    } catch {
      setInvoices([]);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, [endDate, paymentStatus, startDate]);

  useEffect(() => {
    fetchLedgerData();
  }, [fetchLedgerData]);

  const periodInvoiceTotal = invoices.reduce(
    (total, invoice) => total + Number(invoice.grossTotal || 0),
    0,
  );

  const periodCollectedTotal = invoices.reduce(
    (total, invoice) => total + Number(invoice.amountPaid || 0),
    0,
  );

  const periodOutstandingTotal = invoices.reduce(
    (total, invoice) => total + Number(invoice.remainingBalance || 0),
    0,
  );

  return (
    <div className="mx-auto max-w-7xl p-6 font-sans antialiased text-slate-700">
      <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1a4b8c]">
            Central Ledger <span className="text-[#029352]">Sheets</span>
          </h1>

          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
            Review invoices, collected revenue, pending balances, and hospital
            financial activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchLedgerData}
            disabled={loading}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-400 transition-colors hover:bg-[#1a4b8c]/5 hover:text-[#1a4b8c] disabled:cursor-not-allowed disabled:opacity-50"
            title="Refresh Financial Ledger"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
          </button>

          <div className="shrink-0 rounded-lg border border-emerald-100 bg-[#029352]/10 p-2.5 text-[#029352]">
            <Layers className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Revenue Collected
            </p>
            <Wallet className="h-4 w-4 text-[#029352]" />
          </div>

          <p className="mt-2 text-xl font-black text-[#029352]">
            {formatCurrency(analytics?.netFinancialRevenueCollected)}
          </p>

          <p className="mt-1 text-[10px] font-medium text-slate-400">
            Paid invoice settlements
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Outstanding Balance
            </p>
            <CircleDollarSign className="h-4 w-4 text-amber-600" />
          </div>

          <p className="mt-2 text-xl font-black text-amber-700">
            {formatCurrency(analytics?.outstandingBalance)}
          </p>

          <p className="mt-1 text-[10px] font-medium text-slate-400">
            Unpaid and partial invoices
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Pharmacy Sales
            </p>
            <CreditCard className="h-4 w-4 text-[#1a4b8c]" />
          </div>

          <p className="mt-2 text-xl font-black text-[#1a4b8c]">
            {formatCurrency(analytics?.pharmacySalesTotal)}
          </p>

          <p className="mt-1 text-[10px] font-medium text-slate-400">
            Pharmacy receipt total
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Completed Visits
            </p>
            <Banknote className="h-4 w-4 text-[#029352]" />
          </div>

          <p className="mt-2 text-xl font-black text-slate-700">
            {analytics?.completedConsultationsCount || 0}
          </p>

          <p className="mt-1 text-[10px] font-medium text-slate-400">
            Medical records completed
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#1a4b8c]">
              Invoice <span className="text-[#029352]">Ledger</span>
            </h2>

            <p className="mt-0.5 text-xs font-medium text-slate-400">
              Centralized invoice and payment history.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <select
              value={paymentStatus}
              onChange={(event) => setPaymentStatus(event.target.value)}
              className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold uppercase text-slate-600 outline-none transition-all focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
            >
              <option value="">ALL PAYMENT STATUS</option>
              <option value="Paid">PAID</option>
              <option value="Partial">PARTIAL</option>
              <option value="Unpaid">UNPAID</option>
            </select>

            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-600 outline-none transition-all focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
              />
            </div>

            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-600 outline-none transition-all focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setPaymentStatus("");
                setStartDate("");
                setEndDate("");
              }}
              className="flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-500 transition-colors hover:bg-slate-100"
            >
              <Search className="h-3.5 w-3.5" />
              Clear Filters
            </button>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Filtered Invoice Value
            </p>
            <p className="mt-1 text-sm font-bold text-[#1a4b8c]">
              {formatCurrency(periodInvoiceTotal)}
            </p>
          </div>

          <div className="rounded-md border border-emerald-100 bg-emerald-50 p-3">
            <p className="text-[9px] font-bold uppercase tracking-wider text-[#029352]">
              Filtered Collected
            </p>
            <p className="mt-1 text-sm font-bold text-[#029352]">
              {formatCurrency(periodCollectedTotal)}
            </p>
          </div>

          <div className="rounded-md border border-amber-100 bg-amber-50 p-3">
            <p className="text-[9px] font-bold uppercase tracking-wider text-amber-700">
              Filtered Outstanding
            </p>
            <p className="mt-1 text-sm font-bold text-amber-800">
              {formatCurrency(periodOutstandingTotal)}
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex min-h-60 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a4b8c] border-t-[#029352]" />
          </div>
        )}

        {!loading && invoices.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 py-14 text-center">
            <Layers className="mx-auto mb-3 h-8 w-8 text-slate-400" />

            <p className="text-xs font-semibold text-slate-400">
              No invoices found for the selected ledger filters.
            </p>
          </div>
        )}

        {!loading && invoices.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-slate-200/60">
            <table className="w-full min-w-245 border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200/60 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Visit</th>
                  <th className="px-4 py-3">Gross Total</th>
                  <th className="px-4 py-3">Paid</th>
                  <th className="px-4 py-3">Balance</th>
                  <th className="px-4 py-3">Payment Status</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white text-xs font-medium text-slate-600">
                {invoices.map((invoice: any) => (
                  <tr
                    key={invoice._id}
                    className="transition-colors hover:bg-[#1a4b8c]/2.5"
                  >
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-[#1a4b8c]">
                        {invoice.invoiceNumber}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {invoice.paymentMethod}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-800">
                        {invoice.patient?.name || "Unknown Patient"}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {invoice.patient?.patientId || "No UHID"}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-700">
                        {invoice.token?.displayToken || "OPD"}
                      </p>
                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {invoice.token?.department || "General OPD"}
                      </p>
                    </td>

                    <td className="px-4 py-3.5 font-bold text-slate-700">
                      {formatCurrency(invoice.grossTotal)}
                    </td>

                    <td className="px-4 py-3.5 font-bold text-[#029352]">
                      {formatCurrency(invoice.amountPaid)}
                    </td>

                    <td className="px-4 py-3.5 font-bold text-amber-700">
                      {formatCurrency(invoice.remainingBalance)}
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${getStatusStyle(
                          invoice.paymentStatus,
                        )}`}
                      >
                        {invoice.paymentStatus}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-[11px] text-slate-500">
                      {formatDate(invoice.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};