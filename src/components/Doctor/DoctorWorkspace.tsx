/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useCallback, useEffect, useState } from "react";
import {
  Activity,
  Clipboard,
  Stethoscope,
  Plus,
  Trash2,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { hmsDoctorServices } from "../../services/doctorService";

export const DoctorWorkspace: React.FC = () => {
  const [queue, setQueue] = useState<any[]>([]);
  const [activeEncounter, setActiveEncounter] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

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

  const fetchActiveDoctorQueueList = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await hmsDoctorServices.getDoctorQueue("Pending");

      if (response.success) {
        setQueue(response.data || []);
      }
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ||
          "Failed to sync clinical queue parameters.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveDoctorQueueList();
  }, [fetchActiveDoctorQueueList]);

  const addMedicineRowItem = () => {
    if (!medName.trim()) {
      return;
    }

    setMedicinesList([
      ...medicinesList,
      {
        name: medName.trim(),
        dosage: medDosage.trim(),
        frequency: medFreq.trim(),
        duration: medDuration.trim(),
      },
    ]);

    setMedName("");
  };

  const removeMedicineRowItem = (index: number) => {
    setMedicinesList(medicinesList.filter((_, i) => i !== index));
  };

  const addLabTestTagItem = () => {
    if (!labInput.trim()) {
      return;
    }

    setAdvisedLabs([...advisedLabs, labInput.trim()]);
    setLabInput("");
  };

  const removeLabTestTagItem = (index: number) => {
    setAdvisedLabs(advisedLabs.filter((_, i) => i !== index));
  };

  const handleSubmitEncounterForm = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!activeEncounter) {
      return;
    }

    setSuccessMsg("");
    setErrorMsg("");

    const payload = {
      token: activeEncounter._id,
      patient: activeEncounter.patient?._id,
      chiefComplaints: chiefComplaints.trim(),
      diagnosis: diagnosis.trim(),
      medicines: medicinesList,
      advisedLabTests: advisedLabs,
      notes: notes.trim(),
    };

    try {
      const response =
        await hmsDoctorServices.submitMedicalRecordPrescription(payload);

      if (response.success) {
        setSuccessMsg(
          "Success: Electronic prescription generated and encounter marked completed successfully!",
        );

        setActiveEncounter(null);
        setChiefComplaints("");
        setDiagnosis("");
        setNotes("");
        setMedicinesList([]);
        setAdvisedLabs([]);

        await fetchActiveDoctorQueueList();
      }
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ||
          "Failed to submit clinical transaction record entry.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6 font-sans antialiased text-slate-700">
      <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#1a4b8c]">
            Doctor <span className="text-[#029352]">Workspace</span>
          </h1>

          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
            Manage OPD queue and generate electronic prescriptions.
          </p>
        </div>

        <div className="shrink-0 rounded-lg border border-emerald-100 bg-[#029352]/10 p-2.5 text-[#029352]">
          <Stethoscope className="h-5 w-5" />
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
        {/* Queue Panel */}
        <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-1">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-[#1a4b8c]/10 p-2 text-[#1a4b8c]">
                <Activity className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase text-[#1a4b8c]">
                  Waiting <span className="text-[#029352]">Queue</span>
                </h3>

                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                  Active patient queue for consultation.
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

          {loading && (
            <p className="py-8 text-center text-xs font-medium text-slate-400">
              Loading live lines...
            </p>
          )}

          {!loading && queue.length === 0 && (
            <p className="py-10 text-center text-xs font-medium text-slate-400">
              No active triage checking files inside patient queue room lines.
            </p>
          )}

          {!loading && queue.length > 0 && (
            <div className="max-h-125 space-y-2 overflow-y-auto pr-1">
              {queue.map((token: any) => (
                <div
                  key={token._id}
                  onClick={() => setActiveEncounter(token)}
                  className={`cursor-pointer rounded-lg border p-3 transition-all ${
                    activeEncounter?._id === token._id
                      ? "border-[#1a4b8c] bg-slate-50"
                      : "border-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded bg-[#1a4b8c]/10 px-2 py-0.5 text-xs font-extrabold text-[#1a4b8c]">
                      TOKEN #{token.tokenNumber}
                    </span>

                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      {token.department}
                    </span>
                  </div>

                  <p className="mb-1.5 text-xs font-bold text-slate-800">
                    {token.patient?.name.toUpperCase()}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] font-medium text-slate-500">
                    <span>BP: {token.vitals?.bp}</span>
                    <span>Temp: {token.vitals?.temperature}°F</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-2">
          {activeEncounter ? (
            <form onSubmit={handleSubmitEncounterForm} className="space-y-5">
              <div className="mb-4 flex items-center justify-between rounded-lg border border-[#029352]/20 bg-[#029352]/5 p-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a4b8c]">
                    Active Clinical{" "}
                    <span className="text-[#029352]">Consultation</span>
                  </h3>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {activeEncounter.patient?.name.toUpperCase()}
                  </p>

                  <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                    UHID: {activeEncounter.patient?.patientId} | Age:{" "}
                    {activeEncounter.patient?.age} Yrs | Gender:{" "}
                    {activeEncounter.patient?.gender}
                  </p>
                </div>

                <div className="rounded-md bg-[#1a4b8c]/10 px-3 py-1.5 text-center">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-[#1a4b8c]">
                    Slot Queue
                  </p>

                  <p className="text-base font-black text-[#1a4b8c]">
                    #{activeEncounter.tokenNumber}
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Chief Complaints / Symptoms
                </label>

                <textarea
                  required
                  rows={3}
                  value={chiefComplaints}
                  onChange={(event) => setChiefComplaints(event.target.value)}
                  placeholder="High BP since morning, acute chest pain or burning discomfort sensation..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Diagnosis Assessment
                </label>

                <textarea
                  required
                  rows={3}
                  value={diagnosis}
                  onChange={(event) => setDiagnosis(event.target.value)}
                  placeholder="Stage 1 Essential Hypertension / Ischemic Heart Disease..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
                />
              </div>

              {/* Medicines Builder */}
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

                <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Drug Name
                    </label>

                    <input
                      type="text"
                      value={medName}
                      onChange={(event) => setMedName(event.target.value)}
                      placeholder="Tab Loprin 75mg"
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
                      onChange={(event) => setMedDosage(event.target.value)}
                      placeholder="500mg / 1 Tab"
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
                      onChange={(event) => setMedDuration(event.target.value)}
                      placeholder="5 Days"
                      className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addMedicineRowItem}
                  className="mb-3 flex items-center gap-1.5 cursor-pointer rounded-md bg-[#1a4b8c] px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#143b6e]"
                >
                  <Plus className="h-3.5 w-3.5 text-white" />
                  <span>Add Medicine</span>
                </button>

                {medicinesList.length > 0 && (
                  <div className="overflow-x-auto rounded-md border border-slate-200">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        <tr>
                          <th className="px-3 py-2">Medicine Formulation</th>
                          <th className="px-3 py-2">Dosage</th>
                          <th className="px-3 py-2">Frequency</th>
                          <th className="px-3 py-2">Duration</th>
                          <th className="px-3 py-2 text-center">Action</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100 bg-white text-xs font-medium text-slate-600">
                        {medicinesList.map((med, idx) => (
                          <tr key={idx}>
                            <td className="px-3 py-2.5">{med.name}</td>
                            <td className="px-3 py-2.5">{med.dosage}</td>
                            <td className="px-3 py-2.5">{med.frequency}</td>
                            <td className="px-3 py-2.5">{med.duration}</td>
                            <td className="px-3 py-2.5 text-center">
                              <button
                                type="button"
                                onClick={() => removeMedicineRowItem(idx)}
                                className="rounded-md p-1 text-rose-500 transition-colors hover:bg-rose-50"
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

                  <h4 className="text-[11px] font-bold uppercase  text-[#1a4b8c]">
                    Advise Pathology{" "}
                    <span className="text-[#029352]">Lab Tests</span>
                  </h4>
                </div>

                <div className="mb-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={labInput}
                    onChange={(event) => setLabInput(event.target.value)}
                    placeholder="CBC, ECG, Lipid Profile..."
                    className="flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352]"
                  />

                  <button
                    type="button"
                    onClick={addLabTestTagItem}
                    className="flex items-center gap-1.5 rounded-md bg-[#029352] px-3.5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#017542]"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add</span>
                  </button>
                </div>

                {advisedLabs.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {advisedLabs.map((lab, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-full border border-[#029352]/20 bg-[#029352]/10 px-3 py-1"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#029352]">
                          {lab}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeLabTestTagItem(index)}
                          className="rounded-full p-0.5 text-[#029352] transition-colors hover:bg-[#029352]/20"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Clinical Notes */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Clinical Notes / Special Guidance
                </label>

                <input
                  type="text"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Avoid salt intake, absolute rest for 3 days..."
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[#029352] px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#017542] focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Save EMR & Transmit Prescription</span>
              </button>
            </form>
          ) : (
            <div className="flex h-full min-h-100 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
              <div className="mb-3 rounded-full bg-[#1a4b8c]/10 p-3 text-[#1a4b8c]">
                <Stethoscope className="h-6 w-6" />
              </div>

              <p className="text-sm font-bold text-[#1a4b8c]">
                No Active Consultation Selected
              </p>

              <p className="mt-1.5 text-xs font-medium text-slate-500">
                Select an active token ticket folder from the waiting queue
                panel to deploy electronic medical prescription forms.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
