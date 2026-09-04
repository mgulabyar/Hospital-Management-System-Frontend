/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  BadgeDollarSign,
  CheckCircle2,
  ClipboardList,
  PackagePlus,
  Pill,
  Plus,
  RefreshCw,
  Search,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import { hmsPharmacyServices } from "../../services/pharmacyService";

const getTodayDate = () => new Date().toISOString().split("T")[0];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

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

const isExpired = (dateValue?: string) => {
  if (!dateValue) {
    return false;
  }

  const expiryDate = new Date(dateValue);
  expiryDate.setHours(23, 59, 59, 999);

  return expiryDate < new Date();
};

export const PharmacyWorkspace: React.FC = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [pendingPrescriptions, setPendingPrescriptions] = useState<any[]>([]);
  const [salesHistory, setSalesHistory] = useState<any[]>([]);

  const [medName, setMedName] = useState<string>("");
  const [category, setCategory] = useState<string>("Tablet");
  const [stockQty, setStockQty] = useState<string>("");
  const [pricePerUnit, setPricePerUnit] = useState<string>("");
  const [expiry, setExpiry] = useState<string>("2028-12-31");
  const [reorderLevel, setReorderLevel] = useState<string>("10");
  const [batchNumber, setBatchNumber] = useState<string>("");

  const [inventorySearch, setInventorySearch] = useState<string>("");
  const [showLowStockOnly, setShowLowStockOnly] = useState<boolean>(false);

  const [selectedPrescription, setSelectedPrescription] = useState<any | null>(
    null,
  );

  const [dispenseItems, setDispenseItems] = useState<
    Array<{
      medicineId: string;
      quantity: string;
    }>
  >([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [inventoryLoading, setInventoryLoading] = useState<boolean>(false);
  const [prescriptionLoading, setPrescriptionLoading] =
    useState<boolean>(false);
  const [salesLoading, setSalesLoading] = useState<boolean>(false);
  const [stockSaving, setStockSaving] = useState<boolean>(false);
  const [dispensing, setDispensing] = useState<boolean>(false);

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

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

  const fetchInventory = useCallback(async () => {
    setInventoryLoading(true);

    try {
      const response = await hmsPharmacyServices.getMedicineInventory({
        search: inventorySearch,
        lowStock: showLowStockOnly,
        activeOnly: true,
      });

      if (response.success) {
        setInventory(response.data || []);
      } else {
        setInventory([]);
      }
    } catch (err: any) {
      setInventory([]);
      showToast(
        err?.response?.data?.message ||
          "Failed to fetch medicine inventory catalog.",
        "error",
      );
    } finally {
      setInventoryLoading(false);
    }
  }, [inventorySearch, showLowStockOnly, showToast]);

  const fetchPendingPrescriptions = useCallback(async () => {
    setPrescriptionLoading(true);

    try {
      const response = await hmsPharmacyServices.getPendingPrescriptions();

      if (response.success) {
        setPendingPrescriptions(response.data || []);
      } else {
        setPendingPrescriptions([]);
      }
    } catch (err: any) {
      setPendingPrescriptions([]);
      showToast(
        err?.response?.data?.message ||
          "Failed to fetch pending electronic prescriptions.",
        "error",
      );
    } finally {
      setPrescriptionLoading(false);
    }
  }, [showToast]);

  const fetchSalesHistory = useCallback(async () => {
    setSalesLoading(true);

    try {
      const response = await hmsPharmacyServices.getPharmacySales();

      if (response.success) {
        setSalesHistory(response.data || []);
      } else {
        setSalesHistory([]);
      }
    } catch (err: any) {
      setSalesHistory([]);
      showToast(
        err?.response?.data?.message ||
          "Failed to fetch pharmacy sales history.",
        "error",
      );
    } finally {
      setSalesLoading(false);
    }
  }, [showToast]);

  const syncPharmacyData = useCallback(async () => {
    setLoading(true);

    try {
      await Promise.all([
        fetchInventory(),
        fetchPendingPrescriptions(),
        fetchSalesHistory(),
      ]);
    } finally {
      setLoading(false);
    }
  }, [fetchInventory, fetchPendingPrescriptions, fetchSalesHistory]);

  useEffect(() => {
    syncPharmacyData();
  }, [syncPharmacyData]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchInventory();
    }, 350);

    return () => window.clearTimeout(timer);
  }, [fetchInventory]);

  const handleAddStockSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setStockSaving(true);

    try {
      const response = await hmsPharmacyServices.addMedicineToStock({
        name: medName.trim(),
        category,
        availableStock: Number(stockQty),
        pricePerUnit: Number(pricePerUnit),
        expiryDate: expiry,
        reorderLevel: Number(reorderLevel),
        batchNumber: batchNumber.trim(),
      });

      if (response.success && response.data) {
        showToast(
          `${response.data.name} inventory updated. Current stock: ${response.data.availableStock} units.`,
          "success",
        );

        setMedName("");
        setCategory("Tablet");
        setStockQty("");
        setPricePerUnit("");
        setExpiry("2028-12-31");
        setReorderLevel("10");
        setBatchNumber("");

        await fetchInventory();
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ||
          "Failed to update medicine inventory stock levels.",
        "error",
      );
    } finally {
      setStockSaving(false);
    }
  };

  const getSuggestedInventoryMedicine = (prescribedName: string) => {
    const normalizedPrescription = prescribedName.trim().toLowerCase();

    return inventory.find((medicine) =>
      medicine.name?.toLowerCase().includes(normalizedPrescription),
    );
  };

  const openPrescriptionForDispensing = (prescription: any) => {
    const initialItems = (prescription.medicines || []).map((medicine: any) => {
      const suggestedMedicine = getSuggestedInventoryMedicine(medicine.name);

      return {
        medicineId: suggestedMedicine?._id || "",
        quantity: "1",
      };
    });

    setSelectedPrescription(prescription);
    setDispenseItems(
      initialItems.length > 0
        ? initialItems
        : [
            {
              medicineId: "",
              quantity: "1",
            },
          ],
    );
  };

  const closeDispenseModal = () => {
    if (dispensing) {
      return;
    }

    setSelectedPrescription(null);
    setDispenseItems([]);
  };

  const updateDispenseItem = (
    index: number,
    key: "medicineId" | "quantity",
    value: string,
  ) => {
    setDispenseItems((previousItems) =>
      previousItems.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [key]: value,
            }
          : item,
      ),
    );
  };

  const addDispenseItem = () => {
    setDispenseItems((previousItems) => [
      ...previousItems,
      {
        medicineId: "",
        quantity: "1",
      },
    ]);
  };

  const removeDispenseItem = (index: number) => {
    setDispenseItems((previousItems) =>
      previousItems.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const calculateEstimatedTotal = () => {
    return dispenseItems.reduce((total, item) => {
      const inventoryItem = inventory.find(
        (medicine) => medicine._id === item.medicineId,
      );

      return (
        total +
        (inventoryItem?.pricePerUnit || 0) * (Number(item.quantity) || 0)
      );
    }, 0);
  };

  const handleDispensePrescription = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!selectedPrescription) {
      return;
    }

    const normalizedItems = dispenseItems
      .filter((item) => item.medicineId && Number(item.quantity) > 0)
      .map((item) => ({
        medicineId: item.medicineId,
        quantity: Number(item.quantity),
      }));

    if (normalizedItems.length === 0) {
      showToast(
        "Select at least one inventory medicine and a valid quantity.",
        "error",
      );
      return;
    }

    const selectedMedicineIds = normalizedItems.map((item) => item.medicineId);

    if (new Set(selectedMedicineIds).size !== selectedMedicineIds.length) {
      showToast(
        "The same inventory medicine cannot be selected twice in one receipt.",
        "error",
      );
      return;
    }

    setDispensing(true);

    try {
      const response = await hmsPharmacyServices.dispenseMedicinesReceipt({
        patientId: selectedPrescription.patient?._id,
        medicalRecordId: selectedPrescription._id,
        items: normalizedItems,
      });

      if (response.success && response.data) {
        showToast(
          `Prescription dispensed successfully. Receipt ${response.data.saleNumber} total: ${formatCurrency(
            response.data.totalAmount,
          )}.`,
          "success",
        );

        closeDispenseModal();

        await Promise.all([
          fetchInventory(),
          fetchPendingPrescriptions(),
          fetchSalesHistory(),
        ]);
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ||
          "Medicine dispensing transaction could not be completed.",
        "error",
      );
    } finally {
      setDispensing(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6 font-sans antialiased text-slate-700">
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
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
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
            Pharmacy <span className="text-[#029352]">Workspace</span>
          </h1>

          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
            Manage medicine inventory, process pending prescriptions, and track
            dispensing receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={syncPharmacyData}
            disabled={loading}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-400 transition-colors hover:bg-[#1a4b8c]/5 hover:text-[#1a4b8c] disabled:cursor-not-allowed disabled:opacity-50"
            title="Refresh Pharmacy Data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <div className="shrink-0 rounded-lg border border-emerald-100 bg-[#029352]/10 p-2.5 text-[#029352]">
            <Pill className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[390px_1fr]">
        <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="rounded-lg bg-[#1a4b8c]/10 p-2 text-[#1a4b8c]">
              <PackagePlus className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a4b8c]">
                Add Medicine <span className="text-[#029352]">Stock</span>
              </h3>

              <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                Add or replenish active inventory medicine stock.
              </p>
            </div>
          </div>

          <form onSubmit={handleAddStockSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Medicine Brand Name
              </label>

              <input
                type="text"
                required
                value={medName}
                onChange={(event) => setMedName(event.target.value)}
                placeholder="Panadol 500mg"
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Formulation
                </label>

                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 outline-none transition-all focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
                >
                  <option value="Tablet">TABLET</option>
                  <option value="Capsule">CAPSULE</option>
                  <option value="Syrup">SYRUP</option>
                  <option value="Injection">INJECTION</option>
                  <option value="Drops">DROPS</option>
                  <option value="Cream">CREAM</option>
                  <option value="Ointment">OINTMENT</option>
                  <option value="Other">OTHER</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Batch Number
                </label>

                <input
                  type="text"
                  value={batchNumber}
                  onChange={(event) => setBatchNumber(event.target.value)}
                  placeholder="B-2026-001"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Stock Qty
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
                  Unit Price
                </label>

                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={pricePerUnit}
                  onChange={(event) => setPricePerUnit(event.target.value)}
                  placeholder="12"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Reorder At
                </label>

                <input
                  type="number"
                  required
                  min="0"
                  value={reorderLevel}
                  onChange={(event) => setReorderLevel(event.target.value)}
                  placeholder="10"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Batch Expiry Date
              </label>

              <input
                type="date"
                required
                min={getTodayDate()}
                value={expiry}
                onChange={(event) => setExpiry(event.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 outline-none transition-all focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
              />
            </div>

            <button
              type="submit"
              disabled={stockSaving}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#1a4b8c] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#143b6e] focus:outline-none focus:ring-2 focus:ring-[#029352]/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {stockSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Saving Stock...</span>
                </>
              ) : (
                <>
                  <PackagePlus className="h-4 w-4" />
                  <span>Commit Stock Level</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-[#029352]/10 p-2 text-[#029352]">
                <ClipboardList className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a4b8c]">
                  Pending <span className="text-[#029352]">Prescriptions</span>
                </h3>

                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                  Doctor-issued prescriptions awaiting pharmacy dispensing.
                </p>
              </div>
            </div>

            <span className="w-fit rounded-full border border-[#029352]/20 bg-[#029352]/10 px-2.5 py-1 text-[10px] font-bold text-[#029352]">
              {pendingPrescriptions.length} Pending
            </span>
          </div>

          {prescriptionLoading && (
            <div className="flex min-h-45 items-center justify-center">
              <div className="h-7 w-7 animate-spin rounded-full border-4 border-[#1a4b8c] border-t-[#029352]" />
            </div>
          )}

          {!prescriptionLoading && pendingPrescriptions.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
              <ClipboardList className="mx-auto mb-3 h-7 w-7 text-[#029352]" />

              <p className="text-xs font-semibold text-slate-400">
                No pending prescriptions available for dispensing.
              </p>
            </div>
          )}

          {!prescriptionLoading && pendingPrescriptions.length > 0 && (
            <div className="max-h-117.5 space-y-3 overflow-y-auto pr-1">
              {pendingPrescriptions.map((prescription: any) => (
                <div
                  key={prescription._id}
                  className="rounded-lg border border-slate-200 bg-slate-50/40 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {prescription.patient?.name || "Unknown Patient"}
                      </p>

                      <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                        UHID: {prescription.patient?.patientId || "N/A"} · Dr.{" "}
                        {prescription.doctor?.name || "Unknown"}
                      </p>

                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-[#1a4b8c]">
                        {prescription.token?.displayToken || "Clinical EMR"} ·{" "}
                        {prescription.token?.department || "OPD"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        openPrescriptionForDispensing(prescription)
                      }
                      className="flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-[#029352] px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#017542]"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      <span>Dispense</span>
                    </button>
                  </div>

                  <div className="mt-3 border-t border-slate-200/70 pt-3">
                    <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Prescribed Medicines
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {prescription.medicines?.map(
                        (medicine: any, index: number) => (
                          <span
                            key={`${medicine.name}-${index}`}
                            className="rounded-md border border-[#1a4b8c]/10 bg-white px-2 py-1 text-[10px] font-semibold text-[#1a4b8c]"
                          >
                            {medicine.name} · {medicine.dosage} ·{" "}
                            {medicine.frequency} · {medicine.duration}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 border-b border-slate-100 pb-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a4b8c]">
              Medicine <span className="text-[#029352]">Inventory</span>
            </h3>

            <p className="mt-0.5 text-[10px] font-medium text-slate-400">
              Live stock catalog, expiry information, and reorder alerts.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={inventorySearch}
                onChange={(event) => setInventorySearch(event.target.value)}
                placeholder="Search medicine..."
                className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10 sm:w-56"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowLowStockOnly((previous) => !previous)}
              className={`flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-[10px] font-bold uppercase tracking-wide transition-colors ${
                showLowStockOnly
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Low Stock</span>
            </button>
          </div>
        </div>

        {inventoryLoading && (
          <div className="flex min-h-45 items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-[#1a4b8c] border-t-[#029352]" />
          </div>
        )}

        {!inventoryLoading && inventory.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
            <Pill className="mx-auto mb-3 h-7 w-7 text-slate-400" />

            <p className="text-xs font-semibold text-slate-400">
              No inventory medicine records found.
            </p>
          </div>
        )}

        {!inventoryLoading && inventory.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-slate-200/60">
            <table className="w-full min-w-215 border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200/60 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Medicine</th>
                  <th className="px-4 py-3">Batch / Expiry</th>
                  <th className="px-4 py-3">Unit Price</th>
                  <th className="px-4 py-3">Available Stock</th>
                  <th className="px-4 py-3">Reorder Level</th>
                  <th className="px-4 py-3">Availability</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white text-xs font-medium text-slate-600">
                {inventory.map((medicine: any) => {
                  const lowStock =
                    medicine.isLowStock ||
                    medicine.availableStock <= medicine.reorderLevel;

                  const expired = isExpired(medicine.expiryDate);

                  return (
                    <tr
                      key={medicine._id}
                      className="transition-colors hover:bg-[#1a4b8c]/2.5"
                    >
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-slate-800">
                          {medicine.name}
                        </p>

                        <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-[#1a4b8c]">
                          {medicine.category}
                        </p>
                      </td>

                      <td className="px-4 py-3.5">
                        <p className="font-mono text-[10px] text-slate-600">
                          {medicine.batchNumber || "No Batch"}
                        </p>

                        <p
                          className={`mt-0.5 text-[10px] font-semibold ${
                            expired ? "text-rose-600" : "text-slate-400"
                          }`}
                        >
                          Exp: {formatDate(medicine.expiryDate)}
                        </p>
                      </td>

                      <td className="px-4 py-3.5 font-semibold text-slate-700">
                        {formatCurrency(medicine.pricePerUnit)}
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`font-bold ${
                            medicine.availableStock === 0
                              ? "text-rose-600"
                              : lowStock
                                ? "text-amber-600"
                                : "text-[#029352]"
                          }`}
                        >
                          {medicine.availableStock} Units
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-slate-500">
                        {medicine.reorderLevel} Units
                      </td>

                      <td className="px-4 py-3.5">
                        {expired ? (
                          <span className="rounded-full border border-rose-100 bg-rose-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-rose-600">
                            Expired
                          </span>
                        ) : medicine.availableStock === 0 ? (
                          <span className="rounded-full border border-rose-100 bg-rose-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-rose-600">
                            Out of Stock
                          </span>
                        ) : lowStock ? (
                          <span className="rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700">
                            Reorder Soon
                          </span>
                        ) : (
                          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#029352]">
                            Available
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a4b8c]">
              Dispensing <span className="text-[#029352]">History</span>
            </h3>

            <p className="mt-0.5 text-[10px] font-medium text-slate-400">
              Completed pharmacy receipts and patient dispensing records.
            </p>
          </div>

          <span className="rounded-full border border-[#1a4b8c]/15 bg-[#1a4b8c]/5 px-2.5 py-1 text-[10px] font-bold text-[#1a4b8c]">
            {salesHistory.length} Receipts
          </span>
        </div>

        {salesLoading && (
          <div className="flex min-h-40 items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-[#1a4b8c] border-t-[#029352]" />
          </div>
        )}

        {!salesLoading && salesHistory.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
            <ShoppingCart className="mx-auto mb-3 h-7 w-7 text-slate-400" />

            <p className="text-xs font-semibold text-slate-400">
              No pharmacy dispensing receipts have been generated yet.
            </p>
          </div>
        )}

        {!salesLoading && salesHistory.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-slate-200/60">
            <table className="w-full min-w-212.5 border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200/60 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Receipt</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Items Dispensed</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Pharmacist</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white text-xs font-medium text-slate-600">
                {salesHistory.map((sale: any) => (
                  <tr
                    key={sale._id}
                    className="transition-colors hover:bg-[#1a4b8c]/2.5"
                  >
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-[#1a4b8c]">
                        {sale.saleNumber}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {sale.medicalRecord
                          ? "Prescription Sale"
                          : "Counter Sale"}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-800">
                        {sale.patient?.name || "Unknown Patient"}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {sale.patient?.patientId || "No UHID"}
                      </p>
                    </td>

                    <td className="max-w-70 px-4 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {sale.itemsSold?.map((item: any, index: number) => (
                          <span
                            key={`${item.medicineName}-${index}`}
                            className="rounded-md border border-[#1a4b8c]/10 bg-[#1a4b8c]/2.5 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#1a4b8c]"
                          >
                            {item.medicineName} × {item.quantity}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-bold text-[#029352]">
                      {formatCurrency(sale.totalAmount)}
                    </td>

                    <td className="px-4 py-3.5 text-slate-600">
                      {sale.pharmacist?.name || "N/A"}
                    </td>

                    <td className="px-4 py-3.5 text-[11px] text-slate-500">
                      {formatDate(sale.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 font-sans antialiased backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
            <div className="flex items-center justify-between border-b border-slate-200/60 bg-slate-50 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-emerald-100 bg-[#029352]/10 p-2 text-[#029352]">
                  <ShoppingCart className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a4b8c]">
                    Dispense{" "}
                    <span className="text-[#029352]">Prescription</span>
                  </h3>

                  <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                    {selectedPrescription.patient?.name || "Unknown Patient"} ·{" "}
                    UHID: {selectedPrescription.patient?.patientId || "N/A"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeDispenseModal}
                disabled={dispensing}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#1a4b8c]/5 hover:text-[#1a4b8c] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close prescription dispensing modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={handleDispensePrescription}
              className="custom-scrollbar overflow-y-auto p-5"
            >
              <div className="mb-4 rounded-lg border border-[#1a4b8c]/10 bg-[#1a4b8c]/2.5 p-3">
                <p className="mb-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Doctor Prescription
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {selectedPrescription.medicines?.map(
                    (medicine: any, index: number) => (
                      <span
                        key={`${medicine.name}-${index}`}
                        className="rounded-md border border-[#1a4b8c]/10 bg-white px-2 py-1 text-[10px] font-semibold text-[#1a4b8c]"
                      >
                        {medicine.name} · {medicine.dosage} ·{" "}
                        {medicine.frequency} · {medicine.duration}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#1a4b8c]">
                    Inventory Medicine Selection
                  </h4>

                  <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                    Match prescription medicines with available inventory items.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addDispenseItem}
                  className="flex items-center gap-1 rounded-md border border-[#1a4b8c]/15 bg-[#1a4b8c]/5 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wide text-[#1a4b8c] transition-colors hover:bg-[#1a4b8c]/10"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="space-y-2">
                {dispenseItems.map((item, index) => {
                  const selectedMedicine = inventory.find(
                    (medicine) => medicine._id === item.medicineId,
                  );

                  const selectedMedicineUnavailable =
                    selectedMedicine &&
                    (selectedMedicine.availableStock <= 0 ||
                      isExpired(selectedMedicine.expiryDate));

                  return (
                    <div
                      key={`dispense-item-${index}`}
                      className="grid grid-cols-1 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_110px_36px]"
                    >
                      <select
                        required
                        value={item.medicineId}
                        onChange={(event) =>
                          updateDispenseItem(
                            index,
                            "medicineId",
                            event.target.value,
                          )
                        }
                        className="w-full cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#029352]"
                      >
                        <option value="">SELECT INVENTORY MEDICINE</option>

                        {inventory.map((medicine: any) => {
                          const unavailable =
                            medicine.availableStock <= 0 ||
                            isExpired(medicine.expiryDate);

                          return (
                            <option
                              key={medicine._id}
                              value={medicine._id}
                              disabled={unavailable}
                            >
                              {medicine.name} · Stock: {medicine.availableStock}{" "}
                              · {formatCurrency(medicine.pricePerUnit)}
                              {unavailable ? " · UNAVAILABLE" : ""}
                            </option>
                          );
                        })}
                      </select>

                      <input
                        type="number"
                        required
                        min="1"
                        max={selectedMedicine?.availableStock || undefined}
                        value={item.quantity}
                        onChange={(event) =>
                          updateDispenseItem(
                            index,
                            "quantity",
                            event.target.value,
                          )
                        }
                        placeholder="Qty"
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-center text-xs font-semibold text-slate-700 outline-none focus:border-[#029352]"
                      />

                      <button
                        type="button"
                        onClick={() => removeDispenseItem(index)}
                        disabled={dispenseItems.length === 1}
                        className="flex items-center justify-center rounded-md border border-rose-100 bg-rose-50 text-rose-500 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Remove dispensing item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      {selectedMedicine && (
                        <div className="sm:col-span-3">
                          <p
                            className={`text-[10px] font-medium ${
                              selectedMedicineUnavailable
                                ? "text-rose-600"
                                : Number(item.quantity) >
                                    selectedMedicine.availableStock
                                  ? "text-rose-600"
                                  : "text-slate-500"
                            }`}
                          >
                            {selectedMedicineUnavailable
                              ? "This medicine is expired or out of stock."
                              : `Available: ${selectedMedicine.availableStock} units · Unit price: ${formatCurrency(
                                  selectedMedicine.pricePerUnit,
                                )} · Line total: ${formatCurrency(
                                  selectedMedicine.pricePerUnit *
                                    (Number(item.quantity) || 0),
                                )}`}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Estimated Receipt Total
                  </p>

                  <p className="mt-0.5 text-lg font-black text-[#029352]">
                    {formatCurrency(calculateEstimatedTotal())}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeDispenseModal}
                    disabled={dispensing}
                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={dispensing || inventory.length === 0}
                    className="flex min-w-37.5 items-center justify-center gap-2 rounded-lg bg-[#029352] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#017542] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {dispensing ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        <span>Dispensing...</span>
                      </>
                    ) : (
                      <>
                        <BadgeDollarSign className="h-4 w-4" />
                        <span>Confirm Dispense</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
