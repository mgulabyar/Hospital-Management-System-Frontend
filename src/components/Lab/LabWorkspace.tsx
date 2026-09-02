/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useCallback, useEffect, useState } from "react";
import { FlaskConical, Beaker, CheckCircle, RefreshCw } from "lucide-react";
import { hmsLabServices } from "../../services/labService";

export const LabWorkspace: React.FC = () => {
  const [labQueue, setLabQueue] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [resultValues, setResultValues] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const syncHospitalLabQueue = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await hmsLabServices.getLabReportsQueue();

      if (response.success) {
        setLabQueue(response.data || []);
      }
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ||
          "Failed to synchronize pathology report entries.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncHospitalLabQueue();
  }, [syncHospitalLabQueue]);

  const handleFormSubmitResult = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!selectedReport) {
      return;
    }

    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await hmsLabServices.submitAnalyticalLabResult(
        selectedReport._id,
        resultValues,
      );

      if (response.success) {
        setSuccessMsg(
          `Success: Lab report for "${selectedReport.testName}" committed and verified successfully!`,
        );

        setSelectedReport(null);
        setResultValues("");
        await syncHospitalLabQueue();
      }
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ||
          "Failed to commit diagnostic analysis log.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6 font-sans antialiased text-slate-700">
      <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1a4b8c]">
            Laboratory <span className="text-[#029352]">Workspace</span>
          </h1>

          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
            Manage pathology test orders and submit diagnostic results.
          </p>
        </div>

        <div className="shrink-0 rounded-lg border border-emerald-100 bg-[#029352]/10 p-2.5 text-[#029352]">
          <FlaskConical className="h-5 w-5" />
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
                <FlaskConical className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a4b8c]">
                  Pathology <span className="text-[#029352]">Orders</span>
                </h3>

                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                  Active diagnostic test requests.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={syncHospitalLabQueue}
              disabled={loading}
              className="rounded-lg border border-slate-200 p-2 text-slate-400 transition-colors hover:bg-[#1a4b8c]/5 hover:text-[#1a4b8c] disabled:cursor-not-allowed disabled:opacity-50"
              title="Refresh Queue"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          {loading && (
            <p className="py-8 text-center text-xs font-medium text-slate-400 animate-pulse">
              Synchronizing slots...
            </p>
          )}

          {!loading && labQueue.length === 0 && (
            <p className="py-10 text-center text-xs font-medium text-slate-400">
              No diagnostic orders advised by clinical rooms.
            </p>
          )}

          {!loading && labQueue.length > 0 && (
            <div className="max-h-125 space-y-2 overflow-y-auto pr-1">
              {labQueue.map((report: any) => (
                <div
                  key={report._id}
                  onClick={() => setSelectedReport(report)}
                  className={`cursor-pointer rounded-lg border p-3.5 transition-all ${
                    selectedReport?._id === report._id
                      ? "border-[#1a4b8c] bg-slate-50/50"
                      : "border-slate-100 hover:border-slate-300"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="max-w-37.5 truncate text-xs font-bold uppercase tracking-tight text-slate-800">
                      {report.testName}
                    </span>

                    <span
                      className={`rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                        report.status === "Completed"
                          ? "bg-emerald-50 text-[#029352]"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 pt-2 text-[10px] font-bold uppercase text-slate-400">
                    <span className="text-slate-600 font-medium">
                      Patient: {report.patient?.name}
                    </span>

                    <span className="font-mono font-medium text-slate-500">
                      UHID: {report.patient?.patientId}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Result Form Panel */}
        <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-2">
          {selectedReport ? (
            <form onSubmit={handleFormSubmitResult} className="space-y-5">
              {/* Header Info */}
              <div className="rounded-xl border border-slate-200/60 bg-slate-50 p-4">
                <span className="block text-[10px] font-bold uppercase tracking-wide text-[#1a4b8c]">
                  Pathology Laboratory Specimen Info
                </span>

                <h3 className="mt-1 text-sm font-bold uppercase tracking-tight text-slate-800">
                  {selectedReport.testName}
                </h3>

                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-200/60 pt-3 text-[11px] font-bold uppercase text-slate-400">
                  <div>
                    Patient Identity:{" "}
                    <span className="font-medium text-slate-600">
                      {selectedReport.patient?.name.toUpperCase()} (
                      {selectedReport.patient?.patientId})
                    </span>
                  </div>

                  <div>
                    Age / Gender:{" "}
                    <span className="font-medium text-slate-600">
                      {selectedReport.patient?.age} Yrs /{" "}
                      {selectedReport.patient?.gender}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Analytical Diagnostics / Test Readings Output Values
                </label>

                <textarea
                  required
                  rows={6}
                  value={resultValues}
                  onChange={(event) => setResultValues(event.target.value)}
                  disabled={selectedReport.status === "Completed"}
                  placeholder="Hemoglobin: 14.2 g/dL (Normal Reference Range: 13.5-17.5 g/dL), Platelets: 250,000 /mcL..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 font-mono text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white focus:ring-2 focus:ring-[#1a4b8c]/10"
                />
              </div>

              {selectedReport.status === "Completed" ? (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center">
                  <CheckCircle className="h-5 w-5 text-[#029352]" />

                  <p className="text-xs font-bold text-[#029352]">
                    This diagnostic report analysis has already been submitted
                    and authorized inside systemic records.
                  </p>
                </div>
              ) : (
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-[#029352] cursor-pointer px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-[#017542] focus:outline-none focus:ring-2 focus:ring-[#1a4b8c]/30"
                >
                  <Beaker className="h-4 w-4" />
                  <span>Authorize & Submit Laboratory Findings</span>
                </button>
              )}
            </form>
          ) : (
            <div className="flex h-full min-h-100 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
              <div className="mb-3 rounded-full bg-[#1a4b8c]/10 p-3 text-[#1a4b8c]">
                <FlaskConical className="h-6 w-6" />
              </div>

              <p className="text-sm font-bold text-[#1a4b8c]">
                No Test Selected
              </p>

              <p className="mt-1.5 text-xs font-medium text-slate-500">
                Select a dynamic specimen test option item from the left
                pathology log menu order lists to initialize chemical data
                inputs interfaces.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
