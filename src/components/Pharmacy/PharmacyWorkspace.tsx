/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import {
  PlusCircle,
  ShoppingCart,
  Pill,
  BadgeDollarSign,
} from "lucide-react";
import { hmsPharmacyServices } from "../../services/pharmacyService";

export const PharmacyWorkspace: React.FC = () => {
  const [medName, setMedName] = useState<string>("");
  const [category, setCategory] = useState<string>("Tablet");
  const [stockQty, setStockQty] = useState<string>("");
  const [pricePerUnit, setPricePerUnit] = useState<string>("");
  const [expiry, setExpiry] = useState<string>("2028-12-31");

  const [patientId, setPatientId] = useState<string>("");
  const [medId, setMedId] = useState<string>("");
  const [saleQty, setSaleQty] = useState<string>("");

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddStockSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setSuccessMsg("");
    setErrorMsg("");
    setLoading(true);

    const payload = {
      name: medName.trim(),
      category,
      availableStock: Number(stockQty),
      pricePerUnit: Number(pricePerUnit),
      expiryDate: expiry,
    };

    try {
      const response =
        await hmsPharmacyServices.addMedicineToStock(payload);

      if (response.success && response.data) {
        setSuccessMsg(
          `Success: Inventory Balanced! "${medName}" stock count is currently at ${response.data.availableStock} units inside catalogs.`,
        );

        setMedName("");
        setStockQty("");
        setPricePerUnit("");
      }
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ||
          "Failed to update medicine stock levels.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSalesCheckoutSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setSuccessMsg("");
    setErrorMsg("");

    if (!patientId || !medId || !saleQty) {
      setErrorMsg(
        "Validation Error: Missing target patient profiles or inventory products links.",
      );
      return;
    }

    const payload = {
      patientId: patientId.trim(),
      items: [
        {
          medicineId: medId.trim(),
          quantity: Number(saleQty),
        },
      ],
    };

    try {
      const response =
        await hmsPharmacyServices.dispenseMedicinesReceipt(payload);

      if (response.success && response.data) {
        setSuccessMsg(
          `Success: Drug checkout completed! Total Calculated cost is Rs. ${response.data.totalAmount}. Inventory values balanced.`,
        );

        setPatientId("");
        setMedId("");
        setSaleQty("");
      }
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ||
          "Checkout Rejected: Insufficient stock levels or parameters fault.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6 font-sans antialiased text-slate-700">
      <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#1a4b8c]">
            Pharmacy{" "}
            <span className="text-[#029352]">Workspace</span>
          </h1>

          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
            Manage medicine inventory and process sales orders.
          </p>
        </div>

        <div className="shrink-0 rounded-lg border border-emerald-100 bg-[#029352]/10 p-2.5 text-[#029352]">
          <Pill className="h-5 w-5" />
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Stock Management Panel */}
        <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="rounded-lg bg-[#1a4b8c]/10 p-2 text-[#1a4b8c]">
              <PlusCircle className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a4b8c]">
                Manage Drug{" "}
                <span className="text-[#029352]">Inventory</span>
              </h3>

              <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                Add fresh medicine stock batches.
              </p>
            </div>
          </div>

          <form onSubmit={handleAddStockSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Medicine Brand Name
                </label>

                <input
                  type="text"
                  required
                  value={medName}
                  onChange={(event) => setMedName(event.target.value)}
                  placeholder="Tab Loprin 75mg"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
                />
              </div>

             <div className="font-sans antialiased">
  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-400 select-none">
    Formulation Category
  </label>

  <div className="relative w-full">
    <select
      value={category}
      onChange={(event) => setCategory(event.target.value)}
      className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 pl-3 pr-10 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-500 outline-none transition-all duration-200 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10 appearance-none shadow-sm"
    >
      <option value="Tablet">TABLET</option>
      <option value="Capsule">CAPSULE</option>
      <option value="Syrup">SYRUP</option>
      <option value="Injection">INJECTION</option>
    </select>

    <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
      <svg
        className="w-4 h-4"
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
</div>

            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Fresh Stock Quantity
                </label>

                <input
                  type="number"
                  required
                  min="1"
                  value={stockQty}
                  onChange={(event) => setStockQty(event.target.value)}
                  placeholder="500"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Price Per Unit (Rs)
                </label>

                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={pricePerUnit}
                  onChange={(event) => setPricePerUnit(event.target.value)}
                  placeholder="5"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Batch Expiry Target Date
              </label>

              <input
                type="date"
                required
                value={expiry}
                onChange={(event) => setExpiry(event.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 outline-none transition-all focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#1a4b8c] cursor-pointer px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#143b6e] focus:outline-none focus:ring-2 focus:ring-[#029352]/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <PlusCircle className="h-4 w-4" />
              <span>
                {loading ? "Processing..." : "Commit Catalog Stock Level"}
              </span>
            </button>
          </form>
        </div>

        {/* Sales Checkout Panel */}
        <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="rounded-lg bg-[#029352]/10 p-2 text-[#029352]">
              <ShoppingCart className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a4b8c]">
                Dispense Sales{" "}
                <span className="text-[#029352]">Order</span>
              </h3>

              <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                Process checkout and deduct inventory.
              </p>
            </div>
          </div>

          <form onSubmit={handleSalesCheckoutSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Target Patient Database System ID
              </label>

              <input
                type="text"
                required
                value={patientId}
                onChange={(event) => setPatientId(event.target.value)}
                placeholder="e.g., 6a96f08826546ef46ef28276"
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Medicine Catalog Product Item ID
              </label>

              <input
                type="text"
                required
                value={medId}
                onChange={(event) => setMedId(event.target.value)}
                placeholder="e.g., 6a96faa53b3ea9859400e763"
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Sales Quantity
              </label>

              <input
                type="number"
                required
                min="1"
                value={saleQty}
                onChange={(event) => setSaleQty(event.target.value)}
                placeholder="30"
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-center text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#029352] px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#017542] focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
            >
              <BadgeDollarSign className="h-4 w-4" />
              <span>Process Dispense Sales Receipt</span>
            </button>

            <p className="text-center text-[10px] font-medium italic text-slate-400">
              Dispensing system auto calculates total row item prices and
              deducts quantities matching threshold bounds logs.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};