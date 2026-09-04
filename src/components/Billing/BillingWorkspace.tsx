/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  CreditCard,
  FileText,
  Landmark,
  Receipt,
  RefreshCw,
  Smartphone,
  UserSearch,
  Wallet,
  X,
} from "lucide-react";
import {
  hmsBillingServices,
  type PaymentMethod,
} from "../../services/billingService";

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

const getBillingStatusClass = (billingStage: string) => {
  if (billingStage === "Paid") {
    return "border-emerald-100 bg-emerald-50 text-[#029352]";
  }

  if (
    billingStage === "Ready for Billing" ||
    billingStage === "Invoice Unpaid" ||
    billingStage === "Partial Payment"
  ) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (billingStage === "Cancelled") {
    return "border-rose-100 bg-rose-50 text-rose-600";
  }

  return "border-slate-200 bg-slate-100 text-slate-500";
};

const getPaymentStatusClass = (paymentStatus: string) => {
  if (paymentStatus === "Paid") {
    return "border-emerald-100 bg-emerald-50 text-[#029352]";
  }

  if (paymentStatus === "Partial") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (paymentStatus === "Unpaid") {
    return "border-rose-100 bg-rose-50 text-rose-600";
  }

  return "border-slate-200 bg-slate-100 text-slate-500";
};

export const BillingWorkspace: React.FC = () => {
  const [billingCases, setBillingCases] = useState<any[]>([]);
  const [loadingQueue, setLoadingQueue] = useState<boolean>(false);

  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [activeInvoice, setActiveInvoice] = useState<any | null>(null);

  const [filterDate, setFilterDate] = useState<string>("");
  const [filterStage, setFilterStage] = useState<string>("");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>("");

  const [payMethod, setPayMethod] = useState<PaymentMethod>("Cash");
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentReference, setPaymentReference] = useState<string>("");

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      if (type === "success") {
        setErrorMsg("");
        setSuccessMsg(message);
      } else {
        setSuccessMsg("");
        setErrorMsg(message);
      }
    },
    [],
  );

  useEffect(() => {
    if (!successMsg && !errorMsg) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSuccessMsg("");
      setErrorMsg("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [successMsg, errorMsg]);

  const fetchBillingCases = useCallback(async () => {
    setLoadingQueue(true);

    try {
      const response = await hmsBillingServices.getAllBillingPatients({
        date: filterDate || undefined,
        billingStage: filterStage || undefined,
        paymentStatus: filterPaymentStatus || undefined,
      });

      if (response.success) {
        setBillingCases(response.data || []);

        if (selectedCase?.tokenId) {
          const refreshedSelectedCase = (response.data || []).find(
            (billingCase: any) => billingCase.tokenId === selectedCase.tokenId,
          );

          setSelectedCase(refreshedSelectedCase || null);
        }
      } else {
        setBillingCases([]);
      }
    } catch (err: any) {
      setBillingCases([]);
      showToast(
        err?.response?.data?.message ||
          "Failed to synchronize hospital billing records.",
        "error",
      );
    } finally {
      setLoadingQueue(false);
    }
  }, [
    filterDate,
    filterPaymentStatus,
    filterStage,
    selectedCase?.tokenId,
    showToast,
  ]);

  useEffect(() => {
    fetchBillingCases();
  }, [fetchBillingCases]);

  const handlePatientSelectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedTokenId = event.target.value;

    setActiveInvoice(null);
    setPayMethod("Cash");
    setPaymentAmount("");
    setPaymentReference("");

    if (!selectedTokenId) {
      setSelectedCase(null);
      return;
    }

    const matchedCase = billingCases.find(
      (billingCase: any) => billingCase.tokenId === selectedTokenId,
    );

    if (!matchedCase) {
      setSelectedCase(null);
      showToast("Selected patient billing case could not be located.", "error");
      return;
    }

    setSelectedCase(matchedCase);
  };

  const loadInvoice = async (refreshCharges = false) => {
    if (!selectedCase?.tokenId) {
      showToast("Please select a patient billing case first.", "error");
      return;
    }

    if (selectedCase.visitStatus !== "Completed") {
      showToast(
        `This patient visit is currently ${selectedCase.visitStatus}. An invoice can only be generated after consultation completion.`,
        "error",
      );
      return;
    }

    if (!selectedCase.medicalRecordId) {
      showToast(
        "Medical record is missing. Doctor must complete the electronic medical record before billing.",
        "error",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await hmsBillingServices.generateCentralizedBillSummary(
        selectedCase.tokenId,
        refreshCharges,
      );

      if (response.success && response.data) {
        setActiveInvoice(response.data);
        setPaymentAmount(
          String(
            response.data.remainingBalance ?? response.data.grossTotal ?? 0,
          ),
        );

        showToast(
          `Invoice ${response.data.invoiceNumber} loaded successfully.`,
          "success",
        );

        await fetchBillingCases();
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ||
          "Failed to compile centralized hospital invoice.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLedgerSettlePaymentForm = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!activeInvoice?._id) {
      showToast("No active invoice is available for settlement.", "error");
      return;
    }

    if (activeInvoice.paymentStatus === "Paid") {
      showToast("This invoice has already been settled.", "error");
      return;
    }

    const amount = Number(paymentAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      showToast("Enter a payment amount greater than zero.", "error");
      return;
    }

    if (amount > Number(activeInvoice.remainingBalance || 0)) {
      showToast("Payment amount cannot exceed the remaining balance.", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await hmsBillingServices.settleInvoicePaymentLedger(
        activeInvoice._id,
        {
          paymentMethod: payMethod,
          amount,
          paymentReference: paymentReference.trim(),
        },
      );

      if (response.success && response.data) {
        setActiveInvoice(response.data);
        setPaymentAmount(String(response.data.remainingBalance || 0));
        setPaymentReference("");

        showToast(
          response.data.paymentStatus === "Paid"
            ? `Invoice ${response.data.invoiceNumber} settled successfully.`
            : `Partial payment recorded. Remaining balance: ${formatCurrency(
                response.data.remainingBalance,
              )}.`,
          "success",
        );

        await fetchBillingCases();
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ||
          "Failed to authorize payment settlement.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const canGenerateInvoice =
    selectedCase?.visitStatus === "Completed" &&
    Boolean(selectedCase?.medicalRecordId);

  const paymentMethods: Array<{
    id: PaymentMethod;
    label: string;
    icon: React.ElementType;
  }> = [
    {
      id: "Cash",
      label: "Cash",
      icon: Wallet,
    },
    {
      id: "Card",
      label: "Card",
      icon: CreditCard,
    },
    {
      id: "Insurance",
      label: "Insurance",
      icon: Landmark,
    },
    {
      id: "Online",
      label: "Online",
      icon: Smartphone,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl bg-white p-6 font-sans antialiased text-slate-700">
      {(successMsg || errorMsg) && (
        <div className="fixed right-6 top-20 z-70 w-[calc(100%-3rem)] max-w-md">
          <div
            className={`flex items-start gap-3 rounded-lg border p-4 text-xs font-bold shadow-xl ${
              successMsg
                ? "border-emerald-100 bg-emerald-50 text-[#029352]"
                : "border-rose-100 bg-rose-50 text-rose-600"
            }`}
            role="alert"
          >
            {successMsg ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            )}

            <p className="pr-3 leading-relaxed">{successMsg || errorMsg}</p>

            <button
              type="button"
              onClick={() => {
                setSuccessMsg("");
                setErrorMsg("");
              }}
              className="ml-auto rounded p-0.5 transition-colors hover:bg-black/5"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1a4b8c]">
            Billing <span className="text-[#029352]">Workspace</span>
          </h1>

          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
            Generate encounter invoices, review charge breakdowns, and record
            full or partial patient payments.
          </p>
        </div>

        <div className="shrink-0 rounded-lg border border-emerald-100 bg-[#029352]/10 p-2.5 text-[#029352]">
          <Receipt className="h-5 w-5" />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[360px_1fr]">
        <div className="h-fit rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-[#1a4b8c]">
              <UserSearch className="h-5 w-5 shrink-0" />
              <h3 className="text-sm font-bold uppercase tracking-wide">
                Billing Cases
              </h3>
            </div>

            <button
              type="button"
              onClick={fetchBillingCases}
              disabled={loadingQueue || loading}
              className="rounded-lg border border-slate-200 p-2 text-slate-400 transition-colors hover:bg-[#1a4b8c]/5 hover:text-[#1a4b8c] disabled:cursor-not-allowed disabled:opacity-50"
              title="Refresh Billing Cases"
            >
              <RefreshCw
                className={`h-4 w-4 ${loadingQueue ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          <div className="mb-4 space-y-2.5">
            <select
              value={filterStage}
              onChange={(event) => setFilterStage(event.target.value)}
              className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-slate-600 outline-none focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
            >
              <option value="">ALL BILLING STAGES</option>
              <option value="Ready for Billing">READY FOR BILLING</option>
              <option value="Invoice Unpaid">INVOICE UNPAID</option>
              <option value="Partial Payment">PARTIAL PAYMENT</option>
              <option value="Paid">PAID</option>
              <option value="Awaiting Consultation">
                AWAITING CONSULTATION
              </option>
              <option value="Cancelled">CANCELLED</option>
            </select>

            <select
              value={filterPaymentStatus}
              onChange={(event) => setFilterPaymentStatus(event.target.value)}
              className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-slate-600 outline-none focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
            >
              <option value="">ALL PAYMENT STATES</option>
              <option value="Unpaid">UNPAID</option>
              <option value="Partial">PARTIAL</option>
              <option value="Paid">PAID</option>
            </select>

            <input
              type="date"
              value={filterDate}
              onChange={(event) => setFilterDate(event.target.value)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-semibold text-slate-600 outline-none focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
            />

            <button
              type="button"
              onClick={() => {
                setFilterDate("");
                setFilterStage("");
                setFilterPaymentStatus("");
              }}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[9px] font-bold uppercase tracking-wide text-slate-500 transition-colors hover:bg-slate-50"
            >
              Clear Case Filters
            </button>
          </div>

          <div className="relative w-full">
            <select
              value={selectedCase?.tokenId || ""}
              onChange={handlePatientSelectionChange}
              disabled={loadingQueue || loading}
              className="w-full cursor-pointer appearance-none rounded-md border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-10 text-xs font-bold uppercase tracking-wide text-slate-700 outline-none transition-all duration-200 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">CHOOSE PATIENT CASE</option>

              {billingCases.map((patientCase: any) => (
                <option key={patientCase.tokenId} value={patientCase.tokenId}>
                  {(patientCase.name || "Unknown Patient").toUpperCase()} ·{" "}
                  {patientCase.uhid || "N/A"} ·{" "}
                  {patientCase.displayToken || "OPD"}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-400">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {loadingQueue && (
            <p className="mt-3 text-center text-[10px] font-medium text-slate-400">
              Synchronizing billing records...
            </p>
          )}

          {!loadingQueue && billingCases.length === 0 && (
            <p className="mt-3 text-center text-[10px] font-medium italic text-slate-400">
              No billing cases were found.
            </p>
          )}

          {selectedCase && (
            <div className="mt-4 rounded-lg border border-[#1a4b8c]/10 bg-[#1a4b8c]/2.5 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Selected Case
                </span>

                <span
                  className={`rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide ${getBillingStatusClass(
                    selectedCase.billingStage,
                  )}`}
                >
                  {selectedCase.billingStage}
                </span>
              </div>

              <p className="text-xs font-bold text-[#1a4b8c]">
                {selectedCase.name}
              </p>

              <p className="mt-1 text-[10px] font-medium text-slate-500">
                UHID: {selectedCase.uhid} · {selectedCase.displayToken}
              </p>

              <p className="mt-1 text-[10px] font-medium text-slate-500">
                {selectedCase.department}
                {selectedCase.departmentCode
                  ? ` (${selectedCase.departmentCode})`
                  : ""}{" "}
                · Dr. {selectedCase.doctorName}
              </p>

              {selectedCase.invoiceNumber && (
                <p className="mt-2 text-[10px] font-bold text-[#029352]">
                  {selectedCase.invoiceNumber} · {selectedCase.paymentStatus}
                </p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => loadInvoice(false)}
            disabled={
              !selectedCase || loading || loadingQueue || !canGenerateInvoice
            }
            className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#1a4b8c] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#133a69] focus:outline-none focus:ring-2 focus:ring-[#029352]/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Loading Invoice...</span>
              </>
            ) : selectedCase?.invoiceId ? (
              <>
                <ClipboardList className="h-4 w-4" />
                <span>Load Existing Invoice</span>
              </>
            ) : (
              <>
                <Receipt className="h-4 w-4" />
                <span>Generate Bill Summary</span>
              </>
            )}
          </button>

          {selectedCase?.invoiceId && (
            <button
              type="button"
              onClick={() => loadInvoice(true)}
              disabled={loading || selectedCase.paymentStatus === "Paid"}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-[#029352]/20 bg-[#029352]/5 px-4 py-2.5 text-[9px] font-bold uppercase tracking-wide text-[#029352] transition-colors hover:bg-[#029352]/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh Unpaid Invoice Charges</span>
            </button>
          )}
        </div>

        <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
          {activeInvoice && selectedCase ? (
            <form
              onSubmit={handleLedgerSettlePaymentForm}
              className="space-y-5"
            >
              <div className="rounded-xl border border-slate-200/60 bg-slate-50 p-5 shadow-inner">
                <div className="mb-4 flex flex-col gap-3 border-b border-slate-200/60 pb-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-wider text-[#1a4b8c]">
                      Central Hospital Invoice
                    </span>

                    <h4 className="mt-1 font-mono text-sm font-extrabold tracking-tight text-slate-800">
                      {activeInvoice.invoiceNumber}
                    </h4>

                    <p className="mt-1 text-[10px] font-medium text-slate-500">
                      {selectedCase.name} · UHID: {selectedCase.uhid} ·{" "}
                      {selectedCase.displayToken}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${getPaymentStatusClass(
                      activeInvoice.paymentStatus,
                    )}`}
                  >
                    {activeInvoice.paymentStatus}
                  </span>
                </div>

                {activeInvoice.invoiceItems?.length > 0 && (
                  <div className="mb-4 overflow-x-auto rounded-md border border-slate-200 bg-white">
                    <table className="w-full min-w-137.5 text-left">
                      <thead className="border-b border-slate-200 bg-slate-50 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        <tr>
                          <th className="px-3 py-2">Charge</th>
                          <th className="px-3 py-2">Type</th>
                          <th className="px-3 py-2 text-center">Qty</th>
                          <th className="px-3 py-2 text-right">Amount</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
                        {activeInvoice.invoiceItems.map(
                          (item: any, index: number) => (
                            <tr key={`${item.title}-${index}`}>
                              <td className="px-3 py-2.5 text-slate-700">
                                {item.title}
                              </td>
                              <td className="px-3 py-2.5">
                                <span className="rounded border border-[#1a4b8c]/10 bg-[#1a4b8c]/2.5 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-[#1a4b8c]">
                                  {item.type}
                                </span>
                              </td>
                              <td className="px-3 py-2.5 text-center">
                                {item.quantity}
                              </td>
                              <td className="px-3 py-2.5 text-right font-bold text-slate-800">
                                {formatCurrency(item.amount)}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-2 text-xs font-medium text-slate-600 sm:grid-cols-3">
                  <div className="rounded-md border border-slate-200 bg-white p-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Gross Total
                    </p>
                    <p className="mt-1 font-mono text-sm font-bold text-slate-800">
                      {formatCurrency(activeInvoice.grossTotal)}
                    </p>
                  </div>

                  <div className="rounded-md border border-emerald-100 bg-emerald-50 p-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#029352]">
                      Amount Paid
                    </p>
                    <p className="mt-1 font-mono text-sm font-bold text-[#029352]">
                      {formatCurrency(activeInvoice.amountPaid)}
                    </p>
                  </div>

                  <div className="rounded-md border border-amber-100 bg-amber-50 p-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-amber-700">
                      Remaining Balance
                    </p>
                    <p className="mt-1 font-mono text-sm font-bold text-amber-800">
                      {formatCurrency(activeInvoice.remainingBalance)}
                    </p>
                  </div>
                </div>
              </div>

              {activeInvoice.paymentStatus === "Paid" ? (
                <div className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-[#029352]">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />

                  <div>
                    <p className="text-xs font-bold">
                      This invoice has been fully settled.
                    </p>

                    <p className="mt-0.5 text-[10px] font-medium">
                      Latest payment method: {activeInvoice.paymentMethod}
                      {activeInvoice.paymentReference
                        ? ` · Reference: ${activeInvoice.paymentReference}`
                        : ""}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="mb-3">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#1a4b8c]">
                      Record Payment
                    </h5>

                    <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                      Record full or partial payment against the outstanding
                      invoice balance.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Payment Amount
                      </label>

                      <input
                        type="number"
                        required
                        min="0.01"
                        max={activeInvoice.remainingBalance}
                        step="0.01"
                        value={paymentAmount}
                        onChange={(event) =>
                          setPaymentAmount(event.target.value)
                        }
                        className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        Payment Reference
                      </label>

                      <input
                        type="text"
                        value={paymentReference}
                        onChange={(event) =>
                          setPaymentReference(event.target.value)
                        }
                        placeholder="Card slip / online transaction ID"
                        className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none placeholder:text-slate-300 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      const selected = payMethod === method.id;

                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPayMethod(method.id)}
                          className={`flex flex-col items-center justify-center gap-1.5 rounded-md border p-3 text-center transition-all ${
                            selected
                              ? "border-[#029352] bg-emerald-50 text-[#029352]"
                              : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-[9px] font-bold uppercase tracking-wide">
                            {method.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#029352] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#017542] focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        <span>Recording Payment...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Record {payMethod} Payment</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {activeInvoice.payments?.length > 0 && (
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#1a4b8c]" />
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#1a4b8c]">
                      Payment History
                    </h5>
                  </div>

                  <div className="space-y-2">
                    {activeInvoice.payments.map(
                      (payment: any, index: number) => (
                        <div
                          key={`${payment.receivedAt}-${index}`}
                          className="flex flex-col gap-1 rounded-md border border-slate-100 bg-slate-50 p-2.5 text-[10px] sm:flex-row sm:items-center sm:justify-between"
                        >
                          <span className="font-bold text-slate-700">
                            {payment.paymentMethod} ·{" "}
                            {formatCurrency(payment.amount)}
                          </span>

                          <span className="text-slate-400">
                            {formatDate(payment.receivedAt)}
                            {payment.paymentReference
                              ? ` · ${payment.paymentReference}`
                              : ""}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </form>
          ) : (
            <div className="flex min-h-125 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
              <div className="mb-3 rounded-full bg-[#1a4b8c]/10 p-3 text-[#1a4b8c]">
                <Receipt className="h-6 w-6" />
              </div>

              <p className="text-sm font-bold text-[#1a4b8c]">
                No Invoice Selected
              </p>

              <p className="mt-1.5 max-w-md text-xs font-medium leading-relaxed text-slate-500">
                Choose a completed patient visit from the billing cases panel,
                then generate or load the encounter invoice to record payments.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
