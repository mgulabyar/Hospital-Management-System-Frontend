/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useCallback, useEffect, useState } from "react";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clipboard,
  FileClock,
  History,
  PlayCircle,
  Plus,
  RefreshCw,
  Stethoscope,
  Ticket,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { hmsDoctorServices } from "../../services/doctorService";

const getTodayDate = () => new Date().toISOString().split("T")[0];

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

const getTokenStatusStyle = (status: string) => {
  if (status === "Pending") {
    return "border-blue-100 bg-blue-50 text-[#1a4b8c]";
  }

  if (status === "In-Consultation") {
    return "border-amber-100 bg-amber-50 text-amber-700";
  }

  if (status === "Completed") {
    return "border-emerald-100 bg-emerald-50 text-[#029352]";
  }

  return "border-slate-200 bg-slate-100 text-slate-600";
};

export const DoctorWorkspace: React.FC = () => {
  const [queue, setQueue] = useState<any[]>([]);
  const [activeEncounter, setActiveEncounter] = useState<any | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [startingConsultation, setStartingConsultation] =
    useState<boolean>(false);
  const [submittingEncounter, setSubmittingEncounter] =
    useState<boolean>(false);

  const [selectedQueueStatus, setSelectedQueueStatus] =
    useState<string>("Active");
  const [queueDate, setQueueDate] = useState<string>(getTodayDate());

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [chiefComplaints, setChiefComplaints] = useState<string>("");
  const [diagnosis, setDiagnosis] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const [medicinesList, setMedicinesList] = useState<any[]>([]);
  const [medName, setMedName] = useState<string>("");
  const [medDosage, setMedDosage] = useState<string>("500mg");
  const [medFreq, setMedFreq] = useState<string>("1-0-1");
  const [medDuration, setMedDuration] = useState<string>("5 Days");

  const [labInput, setLabInput] = useState<string>("");
  const [advisedLabs, setAdvisedLabs] = useState<string[]>([]);

  const [historyTarget, setHistoryTarget] = useState<any | null>(null);
  const [historyRecords, setHistoryRecords] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);

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

    const timeoutId = window.setTimeout(() => {
      setSuccessMsg("");
      setErrorMsg("");
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [successMsg, errorMsg]);

  const fetchActiveDoctorQueueList = useCallback(async () => {
    setLoading(true);

    try {
      const statusQuery =
        selectedQueueStatus === "Active"
          ? "Pending,In-Consultation"
          : selectedQueueStatus;

      const response = await hmsDoctorServices.getDoctorQueue(
        statusQuery,
        undefined,
        undefined,
        queueDate || undefined,
      );

      if (response.success) {
        const nextQueue = response.data || [];
        setQueue(nextQueue);

        if (activeEncounter) {
          const refreshedActiveEncounter = nextQueue.find(
            (token: any) => token._id === activeEncounter._id,
          );

          if (refreshedActiveEncounter) {
            setActiveEncounter(refreshedActiveEncounter);
          } else {
            setActiveEncounter(null);
          }
        }
      } else {
        setQueue([]);
      }
    } catch (err: any) {
      setQueue([]);
      showToast(
        err?.response?.data?.message ||
          "Failed to synchronize clinical queue parameters.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [activeEncounter, queueDate, selectedQueueStatus, showToast]);

  useEffect(() => {
    fetchActiveDoctorQueueList();
  }, [fetchActiveDoctorQueueList]);

  const resetEncounterForm = () => {
    setChiefComplaints("");
    setDiagnosis("");
    setNotes("");
    setMedicinesList([]);
    setMedName("");
    setMedDosage("500mg");
    setMedFreq("1-0-1");
    setMedDuration("5 Days");
    setLabInput("");
    setAdvisedLabs([]);
  };

  const selectQueueToken = (token: any) => {
    setActiveEncounter(token);
    resetEncounterForm();
  };

  const addMedicineRowItem = () => {
    if (
      !medName.trim() ||
      !medDosage.trim() ||
      !medFreq.trim() ||
      !medDuration.trim()
    ) {
      showToast(
        "Please provide medicine name, dosage, frequency, and duration.",
        "error",
      );
      return;
    }

    setMedicinesList((previousList) => [
      ...previousList,
      {
        name: medName.trim(),
        dosage: medDosage.trim(),
        frequency: medFreq.trim(),
        duration: medDuration.trim(),
      },
    ]);

    setMedName("");
    setMedDosage("500mg");
    setMedFreq("1-0-1");
    setMedDuration("5 Days");
  };

  const removeMedicineRowItem = (index: number) => {
    setMedicinesList((previousList) =>
      previousList.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const addLabTestTagItem = () => {
    const normalizedLab = labInput.trim();

    if (!normalizedLab) {
      return;
    }

    const labAlreadyExists = advisedLabs.some(
      (lab) => lab.toLowerCase() === normalizedLab.toLowerCase(),
    );

    if (labAlreadyExists) {
      showToast("This laboratory test is already added.", "error");
      return;
    }

    setAdvisedLabs((previousLabs) => [...previousLabs, normalizedLab]);
    setLabInput("");
  };

  const removeLabTestTagItem = (index: number) => {
    setAdvisedLabs((previousLabs) =>
      previousLabs.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const handleStartConsultation = async () => {
    if (!activeEncounter) {
      return;
    }

    if (activeEncounter.status === "In-Consultation") {
      return;
    }

    setStartingConsultation(true);

    try {
      const response = await hmsDoctorServices.startConsultation(
        activeEncounter._id,
      );

      if (response.success && response.data) {
        setActiveEncounter(response.data);

        setQueue((previousQueue) =>
          previousQueue.map((token) =>
            token._id === response.data._id ? response.data : token,
          ),
        );

        showToast(
          "Consultation started. Complete the EMR to close this patient visit.",
          "success",
        );
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ||
          "Failed to start the patient consultation.",
        "error",
      );
    } finally {
      setStartingConsultation(false);
    }
  };

  const handleSubmitEncounterForm = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!activeEncounter) {
      return;
    }

    if (activeEncounter.status !== "In-Consultation") {
      showToast(
        "Please start the consultation before saving the medical record.",
        "error",
      );
      return;
    }

    setSubmittingEncounter(true);

    try {
      const response = await hmsDoctorServices.submitMedicalRecordPrescription(
        {
          token: activeEncounter._id,
          patient: activeEncounter.patient?._id,
          chiefComplaints: chiefComplaints.trim(),
          diagnosis: diagnosis.trim(),
          medicines: medicinesList,
          advisedLabTests: advisedLabs,
          notes: notes.trim(),
        },
      );

      if (response.success) {
        showToast(
          "Electronic medical record saved and patient visit completed successfully.",
          "success",
        );

        setActiveEncounter(null);
        resetEncounterForm();

        await fetchActiveDoctorQueueList();
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ||
          "Failed to submit clinical transaction record entry.",
        "error",
      );
    } finally {
      setSubmittingEncounter(false);
    }
  };

  const openPatientHistory = async (token: any) => {
    if (!token.patient?._id) {
      showToast("Patient details are not available for this visit.", "error");
      return;
    }

    setHistoryTarget(token);
    setHistoryRecords([]);
    setHistoryLoading(true);

    try {
      const response = await hmsDoctorServices.getPatientHistoryLogs(
        token.patient._id,
      );

      if (response.success) {
        setHistoryRecords(response.data || []);
      } else {
        setHistoryRecords([]);
      }
    } catch (err: any) {
      setHistoryRecords([]);
      showToast(
        err?.response?.data?.message ||
          "Failed to load patient medical history.",
        "error",
      );
    } finally {
      setHistoryLoading(false);
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
            Doctor <span className="text-[#029352]">Workspace</span>
          </h1>

          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
            Manage patient visits, clinical consultations, and electronic
            prescriptions.
          </p>
        </div>

        <div className="shrink-0 rounded-lg border border-emerald-100 bg-[#029352]/10 p-2.5 text-[#029352]">
          <Stethoscope className="h-5 w-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-1">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-[#1a4b8c]/10 p-2 text-[#1a4b8c]">
                <Activity className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase text-[#1a4b8c]">
                  Patient <span className="text-[#029352]">Visits</span>
                </h3>

                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                  Your live OPD and checked-in appointment queue.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchActiveDoctorQueueList}
              disabled={loading}
              className="rounded-lg border border-slate-200 p-2 text-slate-400 transition-colors hover:bg-[#1a4b8c]/5 hover:text-[#1a4b8c] disabled:cursor-not-allowed disabled:opacity-50"
              title="Refresh Queue"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2">
            <select
              value={selectedQueueStatus}
              onChange={(event) => setSelectedQueueStatus(event.target.value)}
              className="cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-2.5 py-2 text-[10px] font-bold uppercase tracking-wide text-slate-600 outline-none transition-all focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
            >
              <option value="Active">ACTIVE VISITS</option>
              <option value="Pending">PENDING</option>
              <option value="In-Consultation">IN CONSULTATION</option>
              <option value="Completed">COMPLETED</option>
              <option value="Cancelled">CANCELLED</option>
            </select>

            <input
              type="date"
              value={queueDate}
              onChange={(event) => setQueueDate(event.target.value)}
              className="rounded-md border border-slate-200 bg-slate-50 px-2 py-2 text-[10px] font-semibold text-slate-600 outline-none transition-all focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
            />
          </div>

          {loading && (
            <p className="py-8 text-center text-xs font-medium text-slate-400">
              Loading patient visits...
            </p>
          )}

          {!loading && queue.length === 0 && (
            <p className="py-10 text-center text-xs font-medium text-slate-400">
              No patient visits found for the selected queue filter.
            </p>
          )}

          {!loading && queue.length > 0 && (
            <div className="max-h-130 space-y-2 overflow-y-auto pr-1">
              {queue.map((token: any) => (
                <button
                  key={token._id}
                  type="button"
                  onClick={() => selectQueueToken(token)}
                  className={`w-full rounded-lg border p-3 text-left transition-all ${
                    activeEncounter?._id === token._id
                      ? "border-[#1a4b8c] bg-slate-50 shadow-sm"
                      : "border-slate-100 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="rounded bg-[#1a4b8c]/10 px-2 py-0.5 text-[10px] font-extrabold text-[#1a4b8c]">
                      {token.displayToken || `TOKEN #${token.tokenNumber}`}
                    </span>

                    <span
                      className={`rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide ${getTokenStatusStyle(
                        token.status,
                      )}`}
                    >
                      {token.status}
                    </span>
                  </div>

                  <p className="mb-1.5 text-xs font-bold text-slate-800">
                    {token.patient?.name?.toUpperCase() || "UNKNOWN PATIENT"}
                  </p>

                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#029352]">
                    {token.departmentRef?.name || token.department}
                    {token.departmentRef?.code
                      ? ` (${token.departmentRef.code})`
                      : ""}
                  </p>

                  <div className="flex items-center justify-between gap-2 text-[10px] font-medium text-slate-500">
                    <span>BP: {token.vitals?.bp || "N/A"}</span>
                    <span>Temp: {token.vitals?.temperature ?? "N/A"}°F</span>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5">
                    {token.appointment ? (
                      <>
                        <CalendarDays className="h-3 w-3 text-[#1a4b8c]" />
                        <span className="text-[9px] font-bold uppercase tracking-wide text-[#1a4b8c]">
                          Scheduled Appointment
                        </span>
                      </>
                    ) : (
                      <>
                        <Ticket className="h-3 w-3 text-slate-400" />
                        <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                          Walk-In OPD Visit
                        </span>
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-2">
          {activeEncounter ? (
            <form onSubmit={handleSubmitEncounterForm} className="space-y-5">
              <div className="flex flex-col gap-3 rounded-lg border border-[#029352]/20 bg-[#029352]/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a4b8c]">
                      Active Clinical{" "}
                      <span className="text-[#029352]">Consultation</span>
                    </h3>

                    <span
                      className={`rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide ${getTokenStatusStyle(
                        activeEncounter.status,
                      )}`}
                    >
                      {activeEncounter.status}
                    </span>
                  </div>

                  <p className="mt-1 text-xs font-medium text-slate-600">
                    {activeEncounter.patient?.name?.toUpperCase()}
                  </p>

                  <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                    UHID: {activeEncounter.patient?.patientId || "N/A"} | Age:{" "}
                    {activeEncounter.patient?.age ?? "N/A"} Yrs | Gender:{" "}
                    {activeEncounter.patient?.gender || "N/A"} | Blood Group:{" "}
                    {activeEncounter.patient?.bloodGroup || "N/A"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openPatientHistory(activeEncounter)}
                    className="flex items-center gap-1.5 rounded-md border border-[#1a4b8c]/15 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-[#1a4b8c] transition-colors hover:bg-[#1a4b8c]/5"
                  >
                    <History className="h-3.5 w-3.5" />
                    <span>History</span>
                  </button>

                  <div className="rounded-md bg-[#1a4b8c]/10 px-3 py-1.5 text-center">
                    <p className="text-[9px] font-bold uppercase tracking-wide text-[#1a4b8c]">
                      Visit Token
                    </p>

                    <p className="text-sm font-black text-[#1a4b8c]">
                      {activeEncounter.displayToken ||
                        `#${activeEncounter.tokenNumber}`}
                    </p>
                  </div>
                </div>
              </div>

              {activeEncounter.status === "Pending" && (
                <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-amber-100 bg-amber-50 p-3 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-bold text-amber-800">
                      Consultation has not started yet.
                    </p>

                    <p className="mt-0.5 text-[10px] font-medium text-amber-700">
                      Start the consultation before completing the electronic
                      medical record.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleStartConsultation}
                    disabled={startingConsultation}
                    className="flex shrink-0 items-center gap-1.5 rounded-md bg-amber-600 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {startingConsultation ? (
                      <>
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        <span>Starting...</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-3.5 w-3.5" />
                        <span>Start Consultation</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {activeEncounter.status === "In-Consultation" && (
                <>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Chief Complaints / Symptoms
                      </label>

                      <textarea
                        required
                        rows={4}
                        value={chiefComplaints}
                        onChange={(event) =>
                          setChiefComplaints(event.target.value)
                        }
                        placeholder="High BP since morning, chest pain, fever, weakness..."
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Diagnosis Assessment
                      </label>

                      <textarea
                        required
                        rows={4}
                        value={diagnosis}
                        onChange={(event) => setDiagnosis(event.target.value)}
                        placeholder="Clinical diagnosis, provisional assessment..."
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-[#1a4b8c]/10 bg-[#1a4b8c]/2.5 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="rounded-md bg-[#1a4b8c]/10 p-1.5 text-[#1a4b8c]">
                        <Clipboard className="h-3.5 w-3.5" />
                      </div>

                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#1a4b8c]">
                        e-Prescription{" "}
                        <span className="text-[#029352]">Medicine Builder</span>
                      </h4>
                    </div>

                    <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      <div>
                        <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Drug Name
                        </label>

                        <input
                          type="text"
                          value={medName}
                          onChange={(event) => setMedName(event.target.value)}
                          placeholder="Tab Loprin"
                          className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352]"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Dosage
                        </label>

                        <input
                          type="text"
                          value={medDosage}
                          onChange={(event) =>
                            setMedDosage(event.target.value)
                          }
                          placeholder="500mg / 1 tab"
                          className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352]"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Frequency
                        </label>

                        <input
                          type="text"
                          value={medFreq}
                          onChange={(event) => setMedFreq(event.target.value)}
                          placeholder="1-0-1"
                          className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352]"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Duration
                        </label>

                        <input
                          type="text"
                          value={medDuration}
                          onChange={(event) =>
                            setMedDuration(event.target.value)
                          }
                          placeholder="5 Days"
                          className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352]"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={addMedicineRowItem}
                      className="mb-3 flex cursor-pointer items-center gap-1.5 rounded-md bg-[#1a4b8c] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#143b6e]"
                    >
                      <Plus className="h-3.5 w-3.5 text-white" />
                      <span>Add Medicine</span>
                    </button>

                    {medicinesList.length > 0 && (
                      <div className="overflow-x-auto rounded-md border border-slate-200">
                        <table className="w-full min-w-145 text-left">
                          <thead className="bg-slate-50 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            <tr>
                              <th className="px-3 py-2">
                                Medicine Formulation
                              </th>
                              <th className="px-3 py-2">Dosage</th>
                              <th className="px-3 py-2">Frequency</th>
                              <th className="px-3 py-2">Duration</th>
                              <th className="px-3 py-2 text-center">Action</th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-slate-100 bg-white text-xs font-medium text-slate-600">
                            {medicinesList.map((med, index) => (
                              <tr key={`${med.name}-${index}`}>
                                <td className="px-3 py-2.5">{med.name}</td>
                                <td className="px-3 py-2.5">{med.dosage}</td>
                                <td className="px-3 py-2.5">
                                  {med.frequency}
                                </td>
                                <td className="px-3 py-2.5">{med.duration}</td>
                                <td className="px-3 py-2.5 text-center">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeMedicineRowItem(index)
                                    }
                                    className="rounded-md p-1 text-rose-500 transition-colors hover:bg-rose-50"
                                    aria-label="Remove medicine"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="rounded-lg border border-[#029352]/10 bg-[#029352]/2.5 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="rounded-md bg-[#029352]/10 p-1.5 text-[#029352]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>

                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#1a4b8c]">
                        Advise Pathology{" "}
                        <span className="text-[#029352]">Lab Tests</span>
                      </h4>
                    </div>

                    <div className="mb-3 flex items-center gap-2">
                      <input
                        type="text"
                        value={labInput}
                        onChange={(event) => setLabInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addLabTestTagItem();
                          }
                        }}
                        placeholder="CBC, ECG, Lipid Profile..."
                        className="flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352]"
                      />

                      <button
                        type="button"
                        onClick={addLabTestTagItem}
                        className="flex items-center gap-1.5 rounded-md bg-[#029352] px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#017542]"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add</span>
                      </button>
                    </div>

                    {advisedLabs.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {advisedLabs.map((lab, index) => (
                          <div
                            key={`${lab}-${index}`}
                            className="flex items-center gap-2 rounded-full border border-[#029352]/20 bg-[#029352]/10 px-3 py-1"
                          >
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#029352]">
                              {lab}
                            </span>

                            <button
                              type="button"
                              onClick={() => removeLabTestTagItem(index)}
                              className="rounded-full p-0.5 text-[#029352] transition-colors hover:bg-[#029352]/20"
                              aria-label={`Remove ${lab}`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Clinical Notes / Special Guidance
                    </label>

                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Advice, diet restrictions, follow-up guidance..."
                      className="w-full resize-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingEncounter}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[#029352] px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#017542] focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submittingEncounter ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        <span>Saving EMR...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Save EMR & Complete Visit</span>
                      </>
                    )}
                  </button>
                </>
              )}

              {activeEncounter.status !== "Pending" &&
                activeEncounter.status !== "In-Consultation" && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
                    <FileClock className="mx-auto mb-3 h-7 w-7 text-slate-400" />

                    <p className="text-sm font-bold text-slate-600">
                      This patient visit is {activeEncounter.status}.
                    </p>

                    <p className="mt-1 text-xs font-medium text-slate-400">
                      Select an active pending or in-consultation visit to
                      continue clinical documentation.
                    </p>
                  </div>
                )}
            </form>
          ) : (
            <div className="flex h-full min-h-130 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
              <div className="mb-3 rounded-full bg-[#1a4b8c]/10 p-3 text-[#1a4b8c]">
                <Stethoscope className="h-6 w-6" />
              </div>

              <p className="text-sm font-bold text-[#1a4b8c]">
                No Active Patient Visit Selected
              </p>

              <p className="mt-1.5 max-w-sm text-xs font-medium leading-relaxed text-slate-500">
                Select a pending patient visit from the queue, start the
                consultation, then document diagnosis, prescription, lab
                advice, and clinical guidance.
              </p>
            </div>
          )}
        </div>
      </div>

      {historyTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 font-sans antialiased backdrop-blur-sm">
          <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
            <div className="flex items-center justify-between border-b border-slate-200/60 bg-slate-50 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-[#1a4b8c]/10 bg-[#1a4b8c]/10 p-2 text-[#1a4b8c]">
                  <History className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a4b8c]">
                    Patient Medical{" "}
                    <span className="text-[#029352]">History</span>
                  </h3>

                  <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                    {historyTarget.patient?.name || "Unknown Patient"} · UHID:{" "}
                    {historyTarget.patient?.patientId || "N/A"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setHistoryTarget(null);
                  setHistoryRecords([]);
                }}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#1a4b8c]/5 hover:text-[#1a4b8c]"
                aria-label="Close patient history"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="custom-scrollbar flex-1 overflow-y-auto p-5">
              {historyLoading && (
                <div className="flex min-h-48 items-center justify-center">
                  <div className="h-7 w-7 animate-spin rounded-full border-4 border-[#1a4b8c] border-t-[#029352]" />
                </div>
              )}

              {!historyLoading && historyRecords.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
                  <UserRound className="mx-auto mb-3 h-7 w-7 text-slate-400" />

                  <p className="text-xs font-semibold text-slate-400">
                    No previous medical records found for this patient.
                  </p>
                </div>
              )}

              {!historyLoading && historyRecords.length > 0 && (
                <div className="space-y-3">
                  {historyRecords.map((record: any) => (
                    <div
                      key={record._id}
                      className="rounded-lg border border-slate-200 bg-white p-4"
                    >
                      <div className="mb-3 flex flex-col justify-between gap-2 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
                        <div>
                          <p className="text-xs font-bold text-[#1a4b8c]">
                            {record.token?.displayToken || "Clinical Record"}
                          </p>

                          <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                            {formatDateTime(record.createdAt)} · Dr.{" "}
                            {record.doctor?.name || "Unknown"}
                          </p>
                        </div>

                        <span className="w-fit rounded-full border border-[#029352]/20 bg-[#029352]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#029352]">
                          {record.token?.department || "OPD"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Chief Complaints
                          </p>

                          <p className="mt-1 text-xs leading-relaxed text-slate-600">
                            {record.chiefComplaints}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Diagnosis
                          </p>

                          <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-700">
                            {record.diagnosis}
                          </p>
                        </div>
                      </div>

                      {record.medicines?.length > 0 && (
                        <div className="mt-3 border-t border-slate-100 pt-3">
                          <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Prescription
                          </p>

                          <div className="flex flex-wrap gap-1.5">
                            {record.medicines.map(
                              (medicine: any, index: number) => (
                                <span
                                  key={`${medicine.name}-${index}`}
                                  className="rounded-md border border-[#1a4b8c]/10 bg-[#1a4b8c]/2.5 px-2 py-1 text-[10px] font-semibold text-[#1a4b8c]"
                                >
                                  {medicine.name} · {medicine.dosage} ·{" "}
                                  {medicine.frequency} · {medicine.duration}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      {record.advisedLabTests?.length > 0 && (
                        <div className="mt-3 border-t border-slate-100 pt-3">
                          <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Advised Lab Tests
                          </p>

                          <div className="flex flex-wrap gap-1.5">
                            {record.advisedLabTests.map(
                              (lab: string, index: number) => (
                                <span
                                  key={`${lab}-${index}`}
                                  className="rounded-full border border-[#029352]/20 bg-[#029352]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#029352]"
                                >
                                  {lab}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      {record.notes && (
                        <div className="mt-3 border-t border-slate-100 pt-3">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            Clinical Notes
                          </p>

                          <p className="mt-1 text-xs italic leading-relaxed text-slate-500">
                            {record.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};