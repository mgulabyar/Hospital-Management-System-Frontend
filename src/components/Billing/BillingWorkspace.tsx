/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import {
  Receipt,
  CreditCard,
  Wallet,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { hmsBillingServices } from "../../services/billingService";

export const BillingWorkspace: React.FC = () => {
  const [tokenId, setTokenId] = useState<string>("");
  const [patientId, setPatientId] = useState<string>("");
  const [medRecordId, setMedRecordId] = useState<string>("");

  const [activeInvoice, setActiveInvoice] = useState<any | null>(null);
  const [payMethod, setPayMethod] = useState<string>("Cash");

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleCompileInvoiceForm = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setSuccessMsg("");
    setErrorMsg("");
    setLoading(true);

    if (!tokenId || !patientId || !medRecordId) {
      setErrorMsg(
        "Validation Fault: Missing critical transaction index track keys parameters.",
      );
      setLoading(false);
      return;
    }

    const payload = {
      tokenId: tokenId.trim(),
      patientId: patientId.trim(),
      medicalRecordId: medRecordId.trim(),
    };

    try {
      const response =
        await hmsBillingServices.generateCentralizedBillSummary(payload);

      if (response.success && response.data) {
        setActiveInvoice(response.data);
        setSuccessMsg(
          "Centralized calculations matched! Serial invoice generated in Unpaid state.",
        );
      }
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ||
          "Failed to aggregate line item fees components.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSettlementForm = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!activeInvoice) {
      return;
    }

    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await hmsBillingServices.settleInvoicePaymentLedger(
        activeInvoice._id,
        payMethod,
      );

      if (response.success && response.data) {
        setSuccessMsg(
          `Transaction Settled: Bill completely cleared via [${payMethod}]. Invoice code status is locked Paid!`,
        );

        setActiveInvoice(null);
        setTokenId("");
        setPatientId("");
        setMedRecordId("");
      }
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ||
          "Failed to authorize accounts ledger clear payment.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6 font-sans antialiased text-slate-700">
      <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1a4b8c]">
            Billing <span className="text-[#029352]">Workspace</span>
          </h1>

          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
            Generate invoices and settle payment transactions.
          </p>
        </div>

        <div className="shrink-0 rounded-lg border border-emerald-100 bg-[#029352]/10 p-2.5 text-[#029352]">
          <Receipt className="h-5 w-5" />
        </div>
      </div>

      {successMsg && (
        <div className="mb-4 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-xs font-bold text-[#029352] shadow-sm">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 rounded-lg border border-rose-100 bg-rose-50 p-4 text-xs font-bold text-rose-600 shadow-sm">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Invoice Generation Panel */}
        <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-1">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="rounded-lg bg-[#1a4b8c]/10 p-2 text-[#1a4b8c]">
              <Layers className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a4b8c]">
                Compile Bill <span className="text-[#029352]">Records</span>
              </h3>

              <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                Generate centralized invoice.
              </p>
            </div>
          </div>

          <form onSubmit={handleCompileInvoiceForm} className="space-y-4">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Appointment Token ID
              </label>

              <input
                type="text"
                required
                value={tokenId}
                onChange={(event) => setTokenId(event.target.value)}
                placeholder="e.g., 6a96f361c076977b5f8ede2b"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Patient Demographic ID
              </label>

              <input
                type="text"
                required
                value={patientId}
                onChange={(event) => setPatientId(event.target.value)}
                placeholder="e.g., 6a96f08826546ef46ef28276"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Prescription Encounter ID
              </label>

              <input
                type="text"
                required
                value={medRecordId}
                onChange={(event) => setMedRecordId(event.target.value)}
                placeholder="e.g., 6a96f44ec076977b5f8ede2c"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full min-h-9.5 items-center justify-center rounded-lg bg-[#1a4b8c] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#133a69] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <span>Sum Ledger Accounts</span>
              )}
            </button>
          </form>
        </div>

        {/* Invoice Display & Payment Panel */}
        <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-2">
          {activeInvoice ? (
            <form onSubmit={handlePaymentSettlementForm} className="space-y-5">
              {/* Invoice Header */}
              <div className="rounded-xl border border-slate-200/60 bg-slate-50 p-5 shadow-inner">
                <div className="mb-4 flex items-center justify-between border-b border-slate-200/60 pb-3">
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-wider text-[#1a4b8c]">
                      Central Hospital Invoice Slip
                    </span>

                    <h4 className="mt-1 font-mono text-sm font-extrabold tracking-tight text-slate-800">
                      {activeInvoice.invoiceNumber}
                    </h4>
                  </div>

                  <span className="animate-pulse select-none rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-rose-600">
                    {activeInvoice.paymentStatus}
                  </span>
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-2 py-1 text-xs font-medium text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">
                      Practitioner Base Consultation Fee:
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-800">
                      Rs. {activeInvoice.consultationFee}.00
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">
                      Pathology Diagnostics Laboratory Fee:
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-800">
                      Rs. {activeInvoice.labFee}.00
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">
                      Pharmacy Prescription Medicines Fee:
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-800">
                      Rs. {activeInvoice.pharmacyFee}.00
                    </span>
                  </div>

                  <div className="mt-3 border-t border-slate-200 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold uppercase tracking-wide text-[#1a4b8c]">
                        Gross Combined Settled Total:
                      </span>
                      <span className="rounded-md border border-amber-200/60 bg-amber-50 px-3 py-1 font-mono text-base font-extrabold text-slate-900">
                        Rs. {activeInvoice.grossTotal}.00
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-2.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Settle Payment Framework Trigger
                </label>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Cash */}
                  <div
                    onClick={() => setPayMethod("Cash")}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                      payMethod === "Cash"
                        ? "border-[#029352] bg-emerald-50/20"
                        : "border-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Wallet
                        className={`h-5 w-5 ${
                          payMethod === "Cash"
                            ? "text-[#029352]"
                            : "text-slate-400"
                        }`}
                      />

                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Cash Payment
                      </span>
                    </div>

                    <div
                      className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 ${
                        payMethod === "Cash"
                          ? "border-[#029352]"
                          : "border-slate-300"
                      }`}
                    >
                      {payMethod === "Cash" && (
                        <div className="h-1.5 w-1.5 rounded-full bg-[#029352]" />
                      )}
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    onClick={() => setPayMethod("Card")}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                      payMethod === "Card"
                        ? "border-[#029352] bg-emerald-50/20"
                        : "border-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard
                        className={`h-5 w-5 ${
                          payMethod === "Card"
                            ? "text-[#029352]"
                            : "text-slate-400"
                        }`}
                      />

                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Card Terminal
                      </span>
                    </div>

                    <div
                      className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 ${
                        payMethod === "Card"
                          ? "border-[#029352]"
                          : "border-slate-300"
                      }`}
                    >
                      {payMethod === "Card" && (
                        <div className="h-1.5 w-1.5 rounded-full bg-[#029352]" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#029352] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#017542] focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Authorize Cash Settlement & Close Ledger</span>
              </button>
            </form>
          ) : (
            <div className="flex h-full min-h-100 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
              <div className="mb-3 rounded-full bg-[#1a4b8c]/10 p-3 text-[#1a4b8c]">
                <Receipt className="h-6 w-6" />
              </div>

              <p className="text-sm font-bold text-[#1a4b8c]">
                No Invoice Generated
              </p>

              <p className="mt-1.5 text-xs font-medium text-slate-500">
                Input transactional index mapping keys inside the left panel to
                load centralized line-breakdown pricing summary invoices.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
