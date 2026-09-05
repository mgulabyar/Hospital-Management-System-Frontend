/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  BedDouble,
  Building2,
  CheckCircle2,
  ClipboardPlus,
  DoorOpen,
  Hospital,
  Plus,
  RefreshCw,
  UsersRound,
  Wrench,
  X,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { hmsIPDServices } from "../../services/ipdService";
import { hmsReceptionServices } from "../../services/receptionService";
import { hmsServices } from "../../services/apiService";

const formatDateTime = (dateValue?: string) => {
  if (!dateValue) {
    return "N/A";
  }

  return new Date(dateValue).toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getAdmissionStatusClass = (status: string) => {
  if (status === "Admitted") {
    return "border-emerald-100 bg-emerald-50 text-[#029352]";
  }

  if (status === "Discharged") {
    return "border-slate-200 bg-slate-100 text-slate-600";
  }

  if (status === "Transferred") {
    return "border-blue-100 bg-blue-50 text-[#1a4b8c]";
  }

  return "border-rose-100 bg-rose-50 text-rose-600";
};

const getBedStatusClass = (status: string) => {
  if (status === "Available") {
    return "border-emerald-100 bg-emerald-50 text-[#029352]";
  }

  if (status === "Occupied") {
    return "border-rose-100 bg-rose-50 text-rose-600";
  }

  return "border-amber-100 bg-amber-50 text-amber-700";
};

export const IPDWorkspace: React.FC = () => {
  const authContext = useContext(AuthContext);

  const [dashboard, setDashboard] = useState<any | null>(null);
  const [wards, setWards] = useState<any[]>([]);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [admissionLoading, setAdmissionLoading] = useState<boolean>(false);
  const [wardLoading, setWardLoading] = useState<boolean>(false);
  const [actionLoadingId, setActionLoadingId] = useState<string>("");

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [admissionFilter, setAdmissionFilter] = useState<string>("Admitted");

  const [patientId, setPatientId] = useState<string>("");
  const [wardId, setWardId] = useState<string>("");
  const [bedId, setBedId] = useState<string>("");
  const [doctorId, setDoctorId] = useState<string>("");
  const [admissionReason, setAdmissionReason] = useState<string>("");
  const [initialNotes, setInitialNotes] = useState<string>("");

  const [showWardModal, setShowWardModal] = useState<boolean>(false);
  const [wardName, setWardName] = useState<string>("");
  const [wardCode, setWardCode] = useState<string>("");
  const [wardType, setWardType] = useState<string>("General");
  const [wardFloor, setWardFloor] = useState<string>("Ground Floor");
  const [bedsInput, setBedsInput] = useState<string>("");

  const [showDischargeModal, setShowDischargeModal] = useState<any | null>(
    null,
  );
  const [dischargeSummary, setDischargeSummary] = useState<string>("");

  if (!authContext) {
    return null;
  }

  const { user } = authContext;

  const canManageWards = user?.role === "super_admin";

  const canManageAdmissions =
    user?.role === "super_admin" || user?.role === "receptionist";

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

  const fetchIPDData = useCallback(async () => {
    setLoading(true);

    try {
      const [dashboardResponse, wardsResponse, admissionsResponse] =
        await Promise.all([
          hmsIPDServices.getIPDDashboard(),
          hmsIPDServices.getWards(),
          hmsIPDServices.getIPDAdmissions({
            status: admissionFilter || undefined,
          }),
        ]);

      if (dashboardResponse.success) {
        setDashboard(dashboardResponse.data || null);
      }

      if (wardsResponse.success) {
        setWards(wardsResponse.data || []);
      }

      if (admissionsResponse.success) {
        setAdmissions(admissionsResponse.data || []);
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ||
          "Failed to synchronize inpatient department data.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [admissionFilter, showToast]);

  const fetchAdmissionFormData = useCallback(async () => {
    if (!canManageAdmissions) {
      return;
    }

    try {
      const [patientsResponse, doctorsResponse] = await Promise.all([
        hmsReceptionServices.getRegisteredPatients(),
        hmsServices.staff.getAllStaff("doctor", undefined, true),
      ]);

      if (patientsResponse.success) {
        setPatients(patientsResponse.data || []);
      }

      if (doctorsResponse.success) {
        setDoctors(doctorsResponse.data || []);
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ||
          "Failed to load patient and doctor admission details.",
        "error",
      );
    }
  }, [canManageAdmissions, showToast]);

  useEffect(() => {
    fetchIPDData();
  }, [fetchIPDData]);

  useEffect(() => {
    fetchAdmissionFormData();
  }, [fetchAdmissionFormData]);

  const selectedWard = wards.find((ward) => ward._id === wardId);

  const availableBeds =
    selectedWard?.beds?.filter((bed: any) => bed.status === "Available") || [];

  const handleWardChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setWardId(event.target.value);
    setBedId("");
  };

  const resetAdmissionForm = () => {
    setPatientId("");
    setWardId("");
    setBedId("");
    setDoctorId("");
    setAdmissionReason("");
    setInitialNotes("");
  };

  const handleCreateAdmission = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!patientId || !wardId || !bedId || !admissionReason.trim()) {
      showToast(
        "Please select patient, ward, bed, and provide an admission reason.",
        "error",
      );
      return;
    }

    setAdmissionLoading(true);

    try {
      const response = await hmsIPDServices.createIPDAdmission({
        patient: patientId,
        ward: wardId,
        bedId,
        attendingDoctor: doctorId || undefined,
        admissionReason: admissionReason.trim(),
        initialNotes: initialNotes.trim(),
      });

      if (response.success) {
        showToast(
          `Patient admitted successfully under ${response.data.admissionNumber}.`,
          "success",
        );

        resetAdmissionForm();
        await fetchIPDData();
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ||
          "Patient IPD admission could not be completed.",
        "error",
      );
    } finally {
      setAdmissionLoading(false);
    }
  };

  const handleCreateWard = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!wardName.trim() || !wardCode.trim()) {
      showToast("Ward name and ward code are required.", "error");
      return;
    }

    setWardLoading(true);

    try {
      const beds = bedsInput
        .split(",")
        .map((bed) => bed.trim())
        .filter(Boolean);

      const response = await hmsIPDServices.createWard({
        name: wardName.trim(),
        code: wardCode.trim(),
        wardType,
        floor: wardFloor.trim() || "Ground Floor",
        beds,
      });

      if (response.success) {
        showToast(
          `Ward ${response.data.name} created with ${response.data.occupancy?.totalBeds || 0} beds.`,
          "success",
        );

        setWardName("");
        setWardCode("");
        setWardType("General");
        setWardFloor("Ground Floor");
        setBedsInput("");
        setShowWardModal(false);

        await fetchIPDData();
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || "Failed to create ward.",
        "error",
      );
    } finally {
      setWardLoading(false);
    }
  };

  const handleBedStatusUpdate = async (
    ward: any,
    bed: any,
    status: "Available" | "Maintenance",
  ) => {
    setActionLoadingId(bed._id);

    try {
      const response = await hmsIPDServices.updateBedStatus(
        ward._id,
        bed._id,
        status,
      );

      if (response.success) {
        showToast(`Bed ${bed.bedNumber} marked as ${status}.`, "success");

        await fetchIPDData();
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || "Failed to update bed status.",
        "error",
      );
    } finally {
      setActionLoadingId("");
    }
  };

  const handleDischarge = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!showDischargeModal) {
      return;
    }

    setActionLoadingId(showDischargeModal._id);

    try {
      const response = await hmsIPDServices.dischargePatient(
        showDischargeModal._id,
        dischargeSummary.trim(),
      );

      if (response.success) {
        showToast(
          `Patient discharged successfully. Bed ${showDischargeModal.bedNumber} is available again.`,
          "success",
        );

        setShowDischargeModal(null);
        setDischargeSummary("");

        await fetchIPDData();
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ||
          "IPD discharge process could not be completed.",
        "error",
      );
    } finally {
      setActionLoadingId("");
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
              <X className="mt-0.5 h-4 w-4 shrink-0" />
            )}

            <p className="pr-3 leading-relaxed">{successMsg || errorMsg}</p>

            <button
              type="button"
              onClick={() => {
                setSuccessMsg("");
                setErrorMsg("");
              }}
              className="ml-auto rounded p-0.5 transition-colors hover:bg-black/5"
              aria-label="Close IPD notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1a4b8c]">
            IPD <span className="text-[#029352]">Management</span>
          </h1>

          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
            Manage wards, bed occupancy, patient admissions, and inpatient
            discharge records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchIPDData}
            disabled={loading}
            className="rounded-md border border-slate-200 bg-white p-2 text-slate-400 transition-colors hover:bg-[#1a4b8c]/5 hover:text-[#1a4b8c] disabled:cursor-not-allowed disabled:opacity-50"
            title="Refresh IPD Data"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          </button>

          {canManageWards && (
            <button
              type="button"
              onClick={() => setShowWardModal(true)}
              className="flex items-center gap-2 rounded-md bg-[#1a4b8c] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#143b6e]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Ward</span>
            </button>
          )}

          <div className="shrink-0 rounded-lg border border-emerald-100 bg-[#029352]/10 p-2.5 text-[#029352]">
            <BedDouble className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Wards
            </span>
            <Building2 className="h-4 w-4 text-[#1a4b8c]" />
          </div>

          <p className="mt-2 text-2xl font-bold text-[#1a4b8c]">
            {dashboard?.totalWards || 0}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Total Beds
            </span>
            <BedDouble className="h-4 w-4 text-slate-500" />
          </div>

          <p className="mt-2 text-2xl font-bold text-slate-700">
            {dashboard?.totalBeds || 0}
          </p>
        </div>

        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#029352]">
              Available Beds
            </span>
            <CheckCircle2 className="h-4 w-4 text-[#029352]" />
          </div>

          <p className="mt-2 text-2xl font-bold text-[#029352]">
            {dashboard?.availableBeds || 0}
          </p>
        </div>

        <div className="rounded-lg border border-rose-100 bg-rose-50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
              Occupied Beds
            </span>
            <UsersRound className="h-4 w-4 text-rose-600" />
          </div>

          <p className="mt-2 text-2xl font-bold text-rose-700">
            {dashboard?.occupiedBeds || 0}
          </p>
        </div>

        <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
              Active Admissions
            </span>
            <Hospital className="h-4 w-4 text-amber-700" />
          </div>

          <p className="mt-2 text-2xl font-bold text-amber-800">
            {dashboard?.activeAdmissions || 0}
          </p>
        </div>
      </div>

      {canManageAdmissions && (
        <div className="mb-6 rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="rounded-md bg-[#1a4b8c]/10 p-2 text-[#1a4b8c]">
              <ClipboardPlus className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a4b8c]">
                Patient IPD <span className="text-[#029352]">Admission</span>
              </h3>

              <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                Assign a registered patient to an available inpatient ward bed.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateAdmission} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Patient Profile
                </label>
                <div className="relative w-full">
                  <select
                    required
                    value={patientId}
                    onChange={(event) => setPatientId(event.target.value)}
                    className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 pl-3 pr-10 py-2.5 text-[11px] font-bold uppercase text-slate-500 outline-none transition-all focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10 appearance-none"
                  >
                    <option value="">SELECT PATIENT</option>
                    {patients.map((patient: any) => (
                      <option key={patient._id} value={patient._id}>
                        {(patient.name || "Unknown Patient").toUpperCase()}
                        {patient.patientId ? ` (${patient.patientId})` : ""}
                      </option>
                    ))}
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

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Ward
                </label>
                <div className="relative w-full">
                  <select
                    required
                    value={wardId}
                    onChange={handleWardChange}
                    className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 pl-3 pr-10 py-2.5 text-[11px] font-bold uppercase text-slate-500 outline-none transition-all focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10 appearance-none"
                  >
                    <option value="">SELECT WARD</option>
                    {wards
                      .filter(
                        (ward) =>
                          ward.isActive &&
                          Number(ward.occupancy?.availableBeds || 0) > 0,
                      )
                      .map((ward) => (
                        <option key={ward._id} value={ward._id}>
                          {ward.name} ({ward.occupancy?.availableBeds || 0} BEDS
                          FREE)
                        </option>
                      ))}
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

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Available Bed
                </label>
                <div className="relative w-full">
                  <select
                    required
                    value={bedId}
                    onChange={(event) => setBedId(event.target.value)}
                    disabled={!wardId}
                    className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 pl-3 pr-10 py-2.5 text-[11px] font-bold uppercase text-slate-500 outline-none transition-all focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10 disabled:cursor-not-allowed disabled:opacity-60 appearance-none"
                  >
                    <option value="">
                      {wardId ? "SELECT BED" : "SELECT WARD FIRST"}
                    </option>
                    {availableBeds.map((bed: any) => (
                      <option key={bed._id} value={bed._id}>
                        BED {bed.bedNumber}
                      </option>
                    ))}
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

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Attending Doctor
                </label>
                <div className="relative w-full">
                  <select
                    value={doctorId}
                    onChange={(event) => setDoctorId(event.target.value)}
                    className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 pl-3 pr-10 py-2.5 text-[11px] font-bold uppercase text-slate-500 outline-none transition-all focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10 appearance-none"
                  >
                    <option value="">NO DOCTOR ASSIGNED</option>
                    {doctors.map((doctor: any) => (
                      <option key={doctor._id} value={doctor._id}>
                        {(doctor.name || "Unknown Doctor").toUpperCase()}
                        {doctor.department?.name
                          ? ` (${doctor.department.name})`
                          : ""}
                      </option>
                    ))}
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

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr_auto]">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Admission Reason
                </label>

                <input
                  type="text"
                  required
                  value={admissionReason}
                  onChange={(event) => setAdmissionReason(event.target.value)}
                  placeholder="Observation, inpatient treatment, post-operative care..."
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-[11px] font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Initial Notes
                </label>

                <input
                  type="text"
                  value={initialNotes}
                  onChange={(event) => setInitialNotes(event.target.value)}
                  placeholder="Initial observation notes..."
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-[11px] font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={admissionLoading}
                  className="flex w-full items-center cursor-pointer justify-center gap-2 rounded-md bg-[#1a4b8c] px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#143b6e] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {admissionLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>Admitting...</span>
                    </>
                  ) : (
                    <>
                      <ClipboardPlus className="h-4 w-4" />
                      <span>Admit Patient</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6 rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-[#1a4b8c]/10 p-2 text-[#1a4b8c]">
              <BedDouble className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a4b8c]">
                Ward & Bed <span className="text-[#029352]">Availability</span>
              </h3>

              <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                Track available, occupied, and maintenance bed status.
              </p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex min-h-40 items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-[#1a4b8c] border-t-[#029352]" />
          </div>
        )}

        {!loading && wards.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
            <BedDouble className="mx-auto mb-3 h-7 w-7 text-slate-400" />

            <p className="text-xs font-semibold text-slate-400">
              No wards have been created yet.
            </p>

            {canManageWards && (
              <p className="mt-1 text-[10px] font-medium text-slate-400">
                Use the Add Ward button to create wards and beds.
              </p>
            )}
          </div>
        )}

        {!loading && wards.length > 0 && (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {wards.map((ward) => (
              <div
                key={ward._id}
                className="rounded-lg border border-slate-200 bg-slate-50/40 p-4"
              >
                <div className="mb-3 flex items-start justify-between border-b border-slate-200/70 pb-3">
                  <div>
                    <p className="text-xs font-bold text-[#1a4b8c]">
                      {ward.name}
                    </p>

                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-[#029352]">
                      {ward.code} · {ward.wardType} · {ward.floor}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-bold text-[#029352]">
                      {ward.occupancy?.availableBeds || 0} Available
                    </p>

                    <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                      {ward.occupancy?.occupiedBeds || 0} Occupied /{" "}
                      {ward.occupancy?.totalBeds || 0} Total
                    </p>
                  </div>
                </div>

                {ward.beds?.length === 0 && (
                  <p className="py-4 text-center text-[10px] font-medium italic text-slate-400">
                    No beds configured in this ward.
                  </p>
                )}

                {ward.beds?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {ward.beds.map((bed: any) => (
                      <div
                        key={bed._id}
                        className={`group flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[10px] font-bold ${getBedStatusClass(
                          bed.status,
                        )}`}
                      >
                        <BedDouble className="h-3.5 w-3.5" />

                        <span>{bed.bedNumber}</span>

                        {canManageWards && bed.status !== "Occupied" && (
                          <button
                            type="button"
                            disabled={actionLoadingId === bed._id}
                            onClick={() =>
                              handleBedStatusUpdate(
                                ward,
                                bed,
                                bed.status === "Maintenance"
                                  ? "Available"
                                  : "Maintenance",
                              )
                            }
                            className="ml-0.5 rounded p-0.5 opacity-70 transition-opacity hover:bg-black/10 hover:opacity-100 disabled:cursor-not-allowed"
                            title={
                              bed.status === "Maintenance"
                                ? "Mark Available"
                                : "Set Maintenance"
                            }
                          >
                            {actionLoadingId === bed._id ? (
                              <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                              <Wrench className="h-3 w-3" />
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-[#029352]/10 p-2 text-[#029352]">
              <Hospital className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a4b8c]">
                IPD Admission <span className="text-[#029352]">Registry</span>
              </h3>

              <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                Active and historical inpatient admission records.
              </p>
            </div>
          </div>
          <div className="relative">
            <select
              value={admissionFilter}
              onChange={(event) => setAdmissionFilter(event.target.value)}
              className="cursor-pointer rounded-md border border-slate-200 bg-slate-50 pl-3 pr-10 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-600 outline-none focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10 appearance-none"
            >
              <option value="">ALL ADMISSIONS</option>
              <option value="Admitted">ACTIVE ADMISSIONS</option>
              <option value="Discharged">DISCHARGED</option>
              <option value="Transferred">TRANSFERRED</option>
              <option value="Cancelled">CANCELLED</option>
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

        {loading && (
          <div className="flex min-h-45 items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-[#1a4b8c] border-t-[#029352]" />
          </div>
        )}

        {!loading && admissions.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
            <Hospital className="mx-auto mb-3 h-7 w-7 text-slate-400" />

            <p className="text-xs font-semibold text-slate-400">
              No IPD admission records match the selected filter.
            </p>
          </div>
        )}

        {!loading && admissions.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-slate-200/60 shadow-sm scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-50">
            <table className="w-full min-w-265 border-collapse text-left table-fixed">
              <thead>
                <tr className="border-b border-slate-200/60 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="w-40 px-4 py-3 whitespace-nowrap">
                    Admission
                  </th>
                  <th className="w-37.5 px-4 py-3 whitespace-nowrap">
                    Patient
                  </th>
                  <th className="w-37.5 px-4 py-3 whitespace-nowrap">
                    Ward / Bed
                  </th>
                  <th className="w-45 px-4 py-3 whitespace-nowrap">
                    Attending Doctor
                  </th>
                  <th className="w-50 px-4 py-3 whitespace-nowrap">
                    Admission Reason
                  </th>
                  <th className="w-25 px-4 py-3 whitespace-nowrap">
                    Status
                  </th>
                  <th className="w-35 px-4 py-3 whitespace-nowrap">
                    Admitted At
                  </th>
                  {(canManageAdmissions || user?.role === "doctor") && (
                    <th className="w-17.5 px-4 py-3 text-center whitespace-nowrap">
                      Action
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white text-[11px] font-semibold text-slate-600">
                {admissions.map((admission) => (
                  <tr
                    key={admission._id}
                    className="transition-colors hover:bg-[#1a4b8c]/2.5"
                  >
                    <td className="px-4 py-3.5 align-middle">
                      <p className="font-bold text-[#1a4b8c] whitespace-nowrap truncate max-w-37.5">
                        {admission.admissionNumber}
                      </p>
                      <p className="mt-0.5 text-slate-400 font-medium whitespace-nowrap truncate max-w-37.5">
                        {admission.initialNotes || "No initial notes"}
                      </p>
                    </td>

                    <td className="px-4 py-3.5 align-middle">
                      <p className="font-bold text-slate-800 whitespace-nowrap truncate max-w-35">
                        {admission.patient?.name || "Unknown Patient"}
                      </p>
                      <p className="mt-0.5 text-slate-400 font-medium whitespace-nowrap truncate max-w-35">
                        {admission.patient?.patientId || "No UHID"} ·{" "}
                        {admission.patient?.phone || "No phone"}
                      </p>
                    </td>

                    <td className="px-4 py-3.5 align-middle">
                      <p className="font-bold text-slate-700 whitespace-nowrap truncate max-w-35">
                        {admission.ward?.name || "Unknown Ward"}
                      </p>
                      <p className="mt-0.5 font-bold uppercase tracking-wide text-[#029352] whitespace-nowrap truncate max-w-35">
                        {admission.ward?.code || "WARD"} · Bed{" "}
                        {admission.bedNumber}
                      </p>
                    </td>

                    <td className="px-4 py-3.5 align-middle">
                      <p className="font-bold text-slate-700 whitespace-nowrap truncate max-w-42.5">
                        {admission.attendingDoctor?.name || "Not Assigned"}
                      </p>
                      <p className="mt-0.5 text-slate-400 font-medium whitespace-nowrap truncate max-w-42.5">
                        {admission.attendingDoctor?.email || ""}
                      </p>
                    </td>

                    <td className="px-4 py-3.5 align-middle">
                      <p
                        className="text-slate-500 font-medium whitespace-nowrap truncate max-w-47.5"
                        title={admission.admissionReason}
                      >
                        {admission.admissionReason}
                      </p>
                    </td>

                    <td className="px-4 py-3.5 align-middle">
                      <span
                        className={`inline-block rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide whitespace-nowrap ${getAdmissionStatusClass(
                          admission.status,
                        )}`}
                      >
                        {admission.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 align-middle text-slate-500 font-medium whitespace-nowrap truncate max-w-32.5">
                      {formatDateTime(admission.admissionDate)}
                    </td>

                    {(canManageAdmissions || user?.role === "doctor") && (
                      <td className="px-4 py-3.5 text-center align-middle whitespace-nowrap">
                        {admission.status === "Admitted" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setShowDischargeModal(admission);
                              setDischargeSummary("");
                            }}
                            disabled={actionLoadingId === admission._id}
                            title="Discharge Patient"
                            className="inline-flex items-center justify-center rounded-md p-1.5 text-[#029352] hover:bg-[#029352]/10 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <DoorOpen className="h-4 w-4 shrink-0" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">
                            -
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showWardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 font-sans antialiased backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
            <div className="flex items-center justify-between border-b border-slate-200/60 bg-slate-50 px-5 py-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a4b8c]">
                  Create Inpatient <span className="text-[#029352]">Ward</span>
                </h3>

                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                  Configure a ward and optionally add comma-separated bed
                  numbers.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowWardModal(false)}
                disabled={wardLoading}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#1a4b8c]/5 hover:text-[#1a4b8c] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close ward modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWard} className="space-y-4 p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Ward Name
                  </label>

                  <input
                    type="text"
                    required
                    value={wardName}
                    onChange={(event) => setWardName(event.target.value)}
                    placeholder="General Ward A"
                    className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Ward Code
                  </label>

                  <input
                    type="text"
                    required
                    value={wardCode}
                    onChange={(event) => setWardCode(event.target.value)}
                    placeholder="GWA"
                    className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium uppercase text-slate-700 outline-none placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Ward Type
                  </label>

                  <select
                    value={wardType}
                    onChange={(event) => setWardType(event.target.value)}
                    className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold uppercase text-slate-600 outline-none focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
                  >
                    <option value="General">GENERAL</option>
                    <option value="Private">PRIVATE</option>
                    <option value="Semi-Private">SEMI-PRIVATE</option>
                    <option value="ICU">ICU</option>
                    <option value="Emergency">EMERGENCY</option>
                    <option value="Maternity">MATERNITY</option>
                    <option value="Pediatric">PEDIATRIC</option>
                    <option value="Isolation">ISOLATION</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Floor
                  </label>

                  <input
                    type="text"
                    value={wardFloor}
                    onChange={(event) => setWardFloor(event.target.value)}
                    placeholder="First Floor"
                    className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Initial Bed Numbers
                </label>

                <input
                  type="text"
                  value={bedsInput}
                  onChange={(event) => setBedsInput(event.target.value)}
                  placeholder="A-01, A-02, A-03, A-04"
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
                />

                <p className="mt-1 text-[10px] font-medium text-slate-400">
                  Separate multiple beds using commas.
                </p>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowWardModal(false)}
                  disabled={wardLoading}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={wardLoading}
                  className="flex min-w-32.5 items-center justify-center gap-2 rounded-lg bg-[#1a4b8c] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#143b6e] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {wardLoading ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5" />
                      <span>Create Ward</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDischargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 font-sans antialiased backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
            <div className="flex items-center justify-between border-b border-slate-200/60 bg-slate-50 px-5 py-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a4b8c]">
                  Discharge <span className="text-[#029352]">Patient</span>
                </h3>

                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                  {showDischargeModal.patient?.name || "Unknown Patient"} · Bed{" "}
                  {showDischargeModal.bedNumber}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDischargeModal(null)}
                disabled={actionLoadingId === showDischargeModal._id}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#1a4b8c]/5 hover:text-[#1a4b8c]"
                aria-label="Close discharge modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleDischarge} className="space-y-4 p-5">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Discharge Summary
                </label>

                <textarea
                  rows={4}
                  value={dischargeSummary}
                  onChange={(event) => setDischargeSummary(event.target.value)}
                  placeholder="Patient condition, treatment outcome, follow-up advice..."
                  className="w-full resize-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none placeholder:text-slate-300 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
                />
              </div>

              <p className="rounded-md border border-amber-100 bg-amber-50 p-3 text-[10px] font-medium leading-relaxed text-amber-700">
                Confirming discharge will mark this admission as discharged and
                release bed {showDischargeModal.bedNumber} for a new patient.
              </p>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDischargeModal(null)}
                  disabled={actionLoadingId === showDischargeModal._id}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={actionLoadingId === showDischargeModal._id}
                  className="flex min-w-32.5 items-center justify-center gap-2 rounded-lg bg-[#029352] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#017542] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {actionLoadingId === showDischargeModal._id ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>Discharging...</span>
                    </>
                  ) : (
                    <>
                      <DoorOpen className="h-3.5 w-3.5" />
                      <span>Confirm Discharge</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
