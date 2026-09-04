/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardPlus,
  Clock3,
  Edit3,
  RefreshCw,
  Search,
  TicketCheck,
  UserRoundX,
  X,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { hmsServices } from "../../services/apiService";
import { hmsReceptionServices } from "../../services/receptionService";
import { hmsAppointmentServices } from "../../services/appointmentService";

const getTodayDate = () => new Date().toISOString().split("T")[0];

const formatAppointmentDate = (dateValue: string) => {
  if (!dateValue) {
    return "N/A";
  }

  return new Date(dateValue).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (time: string) => {
  if (!time) {
    return "N/A";
  }

  const [hours, minutes] = time.split(":");
  const hourNumber = Number(hours);

  if (Number.isNaN(hourNumber)) {
    return time;
  }

  const suffix = hourNumber >= 12 ? "PM" : "AM";
  const normalizedHour = hourNumber % 12 || 12;

  return `${normalizedHour}:${minutes} ${suffix}`;
};

const getStatusStyle = (status: string) => {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "scheduled") {
    return "border-blue-100 bg-blue-50 text-[#1a4b8c]";
  }

  if (normalizedStatus === "checked-in") {
    return "border-amber-100 bg-amber-50 text-amber-700";
  }

  if (normalizedStatus === "completed") {
    return "border-emerald-100 bg-emerald-50 text-[#029352]";
  }

  if (normalizedStatus === "cancelled") {
    return "border-rose-100 bg-rose-50 text-rose-600";
  }

  return "border-slate-200 bg-slate-100 text-slate-600";
};

export const AppointmentWorkspace: React.FC = () => {
  const authContext = useContext(AuthContext);

  const [patients, setPatients] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  const [patientId, setPatientId] = useState<string>("");
  const [departmentId, setDepartmentId] = useState<string>("");
  const [doctorId, setDoctorId] = useState<string>("");
  const [appointmentDate, setAppointmentDate] =
    useState<string>(getTodayDate());
  const [appointmentTime, setAppointmentTime] = useState<string>("09:00");
  const [reason, setReason] = useState<string>("");

  const [filterDate, setFilterDate] = useState<string>(getTodayDate());
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterDepartment, setFilterDepartment] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [doctorLoading, setDoctorLoading] = useState<boolean>(false);
  const [actionLoadingId, setActionLoadingId] = useState<string>("");

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [rescheduleTarget, setRescheduleTarget] = useState<any>(null);
  const [rescheduleDepartmentId, setRescheduleDepartmentId] =
    useState<string>("");
  const [rescheduleDoctorId, setRescheduleDoctorId] = useState<string>("");
  const [rescheduleDate, setRescheduleDate] = useState<string>("");
  const [rescheduleTime, setRescheduleTime] = useState<string>("");
  const [rescheduleReason, setRescheduleReason] = useState<string>("");

  if (!authContext) {
    return null;
  }

  const { user } = authContext;

  const canManageAppointments =
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

  const fetchBaseData = useCallback(async () => {
    const [patientResponse, departmentResponse] = await Promise.all([
      hmsReceptionServices.getRegisteredPatients(),
      hmsServices.departments.getAllDepartments(true),
    ]);

    if (patientResponse.success) {
      setPatients(patientResponse.data || []);
    } else {
      setPatients([]);
    }

    if (departmentResponse.success) {
      setDepartments(departmentResponse.data || []);
    } else {
      setDepartments([]);
    }
  }, []);

  const fetchDoctorsByDepartment = useCallback(
    async (selectedDepartmentId: string) => {
      if (!selectedDepartmentId) {
        setDoctors([]);
        return;
      }

      setDoctorLoading(true);

      try {
        const response = await hmsServices.staff.getAllStaff(
          "doctor",
          selectedDepartmentId,
          true,
        );

        if (response.success) {
          setDoctors(response.data || []);
        } else {
          setDoctors([]);
        }
      } finally {
        setDoctorLoading(false);
      }
    },
    [],
  );

  const fetchAppointments = useCallback(async () => {
    const response = await hmsAppointmentServices.getAppointments({
      date: filterDate || undefined,
      status: filterStatus || undefined,
      department: filterDepartment || undefined,
    });

    if (response.success) {
      setAppointments(response.data || []);
    } else {
      setAppointments([]);
    }
  }, [filterDate, filterDepartment, filterStatus]);

  const syncAppointmentPanel = useCallback(async () => {
    setLoading(true);

    try {
      await Promise.all([fetchBaseData(), fetchAppointments()]);
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ||
          "Failed to synchronize appointment workspace data.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [fetchAppointments, fetchBaseData, showToast]);

  useEffect(() => {
    syncAppointmentPanel();
  }, [syncAppointmentPanel]);

  useEffect(() => {
    if (!departmentId) {
      setDoctors([]);
      setDoctorId("");
      return;
    }

    fetchDoctorsByDepartment(departmentId).catch((err: any) => {
      setDoctors([]);
      setDoctorId("");
      showToast(
        err?.response?.data?.message ||
          "Failed to load doctors for the selected department.",
        "error",
      );
    });
  }, [departmentId, fetchDoctorsByDepartment, showToast]);

  const handleBookAppointment = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!patientId || !departmentId || !doctorId) {
      showToast(
        "Please select a patient, department, and assigned doctor.",
        "error",
      );
      return;
    }

    setBookingLoading(true);

    try {
      const response = await hmsAppointmentServices.createAppointment({
        patient: patientId,
        doctor: doctorId,
        department: departmentId,
        appointmentDate,
        appointmentTime,
        reason: reason.trim(),
      });

      if (response.success && response.data) {
        showToast(
          `Appointment ${response.data.appointmentNumber} booked successfully.`,
          "success",
        );

        setPatientId("");
        setDepartmentId("");
        setDoctorId("");
        setDoctors([]);
        setAppointmentDate(getTodayDate());
        setAppointmentTime("09:00");
        setReason("");

        await fetchAppointments();
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ||
          "Appointment booking request could not be completed.",
        "error",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCheckIn = async (appointmentId: string) => {
    setActionLoadingId(appointmentId);

    try {
      const response =
        await hmsAppointmentServices.checkInAppointment(appointmentId);

      if (response.success) {
        showToast("Appointment checked in successfully.", "success");
        await fetchAppointments();
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || "Failed to check in the appointment.",
        "error",
      );
    } finally {
      setActionLoadingId("");
    }
  };

  const handleCancel = async (appointment: any) => {
    const cancellationReason = window.prompt(
      `Cancellation reason for ${appointment.appointmentNumber}:`,
      "",
    );

    if (cancellationReason === null) {
      return;
    }

    setActionLoadingId(appointment._id);

    try {
      const response = await hmsAppointmentServices.cancelAppointment(
        appointment._id,
        cancellationReason,
      );

      if (response.success) {
        showToast("Appointment cancelled successfully.", "success");
        await fetchAppointments();
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || "Failed to cancel the appointment.",
        "error",
      );
    } finally {
      setActionLoadingId("");
    }
  };

  const openRescheduleModal = async (appointment: any) => {
    setRescheduleTarget(appointment);
    setRescheduleDepartmentId(appointment.department?._id || "");
    setRescheduleDoctorId(appointment.doctor?._id || "");
    setRescheduleDate(
      appointment.appointmentDate
        ? new Date(appointment.appointmentDate).toISOString().split("T")[0]
        : getTodayDate(),
    );
    setRescheduleTime(appointment.appointmentTime || "09:00");
    setRescheduleReason("");

    if (appointment.department?._id) {
      try {
        await fetchDoctorsByDepartment(appointment.department._id);
      } catch (err: any) {
        showToast(
          err?.response?.data?.message ||
            "Failed to load doctors for rescheduling.",
          "error",
        );
      }
    }
  };

  const handleRescheduleDepartmentChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedDepartmentId = event.target.value;

    setRescheduleDepartmentId(selectedDepartmentId);
    setRescheduleDoctorId("");

    try {
      await fetchDoctorsByDepartment(selectedDepartmentId);
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ||
          "Failed to load doctors for the selected department.",
        "error",
      );
    }
  };

  const handleRescheduleAppointment = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!rescheduleTarget) {
      return;
    }

    if (
      !rescheduleDepartmentId ||
      !rescheduleDoctorId ||
      !rescheduleDate ||
      !rescheduleTime
    ) {
      showToast("Please select department, doctor, date, and time.", "error");
      return;
    }

    setActionLoadingId(rescheduleTarget._id);

    try {
      const response = await hmsAppointmentServices.rescheduleAppointment(
        rescheduleTarget._id,
        {
          doctor: rescheduleDoctorId,
          department: rescheduleDepartmentId,
          appointmentDate: rescheduleDate,
          appointmentTime: rescheduleTime,
          rescheduleReason: rescheduleReason.trim(),
        },
      );

      if (response.success) {
        showToast("Appointment rescheduled successfully.", "success");
        setRescheduleTarget(null);
        await fetchAppointments();
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ||
          "Appointment reschedule request could not be completed.",
        "error",
      );
    } finally {
      setActionLoadingId("");
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6 font-sans antialiased text-slate-700">
      {(successMsg || errorMsg) && (
        <div className="fixed right-6 top-20 z-70 w-[calc(100%-3rem)] max-w-md animate-[fadeIn_0.2s_ease-out]">
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
              <UserRoundX className="mt-0.5 h-4 w-4 shrink-0" />
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
            Appointment <span className="text-[#029352]">Workspace</span>
          </h1>

          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
            Schedule, track, reschedule, cancel, and check in outpatient
            appointments.
          </p>
        </div>

        <div className="shrink-0 rounded-lg border border-emerald-100 bg-[#029352]/10 p-2.5 text-[#029352]">
          <CalendarDays className="h-5 w-5" />
        </div>
      </div>

      {canManageAppointments && (
        <div className="mb-6 rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="rounded-lg bg-[#1a4b8c]/10 p-2 text-[#1a4b8c]">
              <ClipboardPlus className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase text-[#1a4b8c]">
                Schedule New <span className="text-[#029352]">Appointment</span>
              </h3>

              <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                Select patient, department, doctor, date and time slot.
              </p>
            </div>
          </div>

          <form onSubmit={handleBookAppointment} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Patient Profile
                </label>

                <select
                  required
                  value={patientId}
                  onChange={(event) => setPatientId(event.target.value)}
                  className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold uppercase text-slate-600 outline-none transition-all focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
                >
                  <option value="">SELECT PATIENT</option>

                  {patients.map((patient: any) => (
                    <option key={patient._id} value={patient._id}>
                      {(patient.name || "Unknown Patient").toUpperCase()}
                      {patient.patientId ? ` (${patient.patientId})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Clinical Department
                </label>

                <select
                  required
                  value={departmentId}
                  onChange={(event) => setDepartmentId(event.target.value)}
                  className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold uppercase text-slate-600 outline-none transition-all focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
                >
                  <option value="">SELECT DEPARTMENT</option>

                  {departments.map((department: any) => (
                    <option key={department._id} value={department._id}>
                      {department.name.toUpperCase()} ({department.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Assigned Doctor
                </label>

                <select
                  required
                  value={doctorId}
                  onChange={(event) => setDoctorId(event.target.value)}
                  disabled={!departmentId || doctorLoading}
                  className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold uppercase text-slate-600 outline-none transition-all focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {!departmentId
                      ? "SELECT DEPARTMENT FIRST"
                      : doctorLoading
                        ? "LOADING DOCTORS..."
                        : "SELECT DOCTOR"}
                  </option>

                  {doctors.map((doctor: any) => (
                    <option key={doctor._id} value={doctor._id}>
                      {(doctor.name || "Unknown Doctor").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Appointment Date
                </label>

                <input
                  type="date"
                  required
                  min={getTodayDate()}
                  value={appointmentDate}
                  onChange={(event) => setAppointmentDate(event.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none transition-all focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Appointment Time
                </label>

                <input
                  type="time"
                  required
                  value={appointmentTime}
                  onChange={(event) => setAppointmentTime(event.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none transition-all focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={bookingLoading || doctorLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a4b8c] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#143b6e] focus:outline-none focus:ring-2 focus:ring-[#029352]/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {bookingLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>Booking...</span>
                    </>
                  ) : (
                    <>
                      <CalendarDays className="h-4 w-4" />
                      <span>Book Appointment</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Visit Reason
              </label>

              <textarea
                rows={2}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Routine consultation, follow-up, symptoms..."
                className="w-full resize-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
              />
            </div>
          </form>
        </div>
      )}

      <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-[#1a4b8c]">
                Appointment <span className="text-[#029352]">Registry</span>
              </h2>

              <p className="mt-0.5 text-xs font-medium text-slate-400">
                {user?.role === "doctor"
                  ? "Your scheduled and historical outpatient appointments."
                  : "Monitor scheduled appointments and reception check-ins."}
              </p>
            </div>

            <button
              type="button"
              onClick={syncAppointmentPanel}
              disabled={loading}
              className="rounded-lg border border-slate-200 p-2 text-slate-400 transition-colors hover:bg-[#1a4b8c]/5 hover:text-[#1a4b8c] disabled:cursor-not-allowed disabled:opacity-50"
              title="Refresh Appointment Registry"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          <div
            className={`grid grid-cols-1 gap-3 ${
              user?.role === "doctor" ? "sm:grid-cols-3" : "sm:grid-cols-4"
            }`}
          >
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

              <input
                type="date"
                value={filterDate}
                onChange={(event) => setFilterDate(event.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-600 outline-none transition-all focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value)}
              className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold uppercase text-slate-600 outline-none transition-all focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
            >
              <option value="">ALL STATUSES</option>
              <option value="Scheduled">SCHEDULED</option>
              <option value="Checked-In">CHECKED-IN</option>
              <option value="Completed">COMPLETED</option>
              <option value="Cancelled">CANCELLED</option>
              <option value="No-Show">NO-SHOW</option>
            </select>

            {user?.role !== "doctor" && (
              <select
                value={filterDepartment}
                onChange={(event) => setFilterDepartment(event.target.value)}
                className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold uppercase text-slate-600 outline-none transition-all focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
              >
                <option value="">ALL DEPARTMENTS</option>

                {departments.map((department: any) => (
                  <option key={department._id} value={department._id}>
                    {department.name.toUpperCase()}
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={() => {
                setFilterDate("");
                setFilterStatus("");
                setFilterDepartment("");
              }}
              className="flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-colors hover:bg-slate-100"
            >
              <Search className="h-3.5 w-3.5" />
              Clear Filters
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex min-h-65 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a4b8c] border-t-[#029352]" />
          </div>
        )}

        {!loading && appointments.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 py-14 text-center">
            <CalendarDays className="mx-auto mb-3 h-8 w-8 text-[#029352]" />

            <p className="text-xs font-semibold text-slate-400">
              No appointments found for the selected filters.
            </p>
          </div>
        )}

        {!loading && appointments.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-slate-200/60">
            <table className="w-full min-w-245 border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200/60 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Appointment</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Doctor / Department</th>
                  <th className="px-4 py-3">Schedule</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Reason</th>
                  {canManageAppointments && (
                    <th className="px-4 py-3 text-center">Actions</th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white text-xs font-medium text-slate-600">
                {appointments.map((appointment: any) => (
                  <tr
                    key={appointment._id}
                    className="transition-colors hover:bg-[#1a4b8c]/2.5"
                  >
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-[#1a4b8c]">
                        {appointment.appointmentNumber}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Created{" "}
                        {appointment.createdAt
                          ? new Date(appointment.createdAt).toLocaleDateString(
                              "en-PK",
                            )
                          : "N/A"}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-800">
                        {appointment.patient?.name || "Unknown Patient"}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {appointment.patient?.patientId || "No UHID"}
                        {appointment.patient?.phone
                          ? ` · ${appointment.patient.phone}`
                          : ""}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="font-bold text-slate-700">
                        {appointment.doctor?.name || "Unknown Doctor"}
                      </p>

                      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-[#029352]">
                        {appointment.department?.name || "No Department"}
                        {appointment.department?.code
                          ? ` (${appointment.department.code})`
                          : ""}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <CalendarDays className="h-3.5 w-3.5 text-[#1a4b8c]" />
                        <span>
                          {formatAppointmentDate(appointment.appointmentDate)}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center gap-1.5 text-slate-400">
                        <Clock3 className="h-3.5 w-3.5" />
                        <span>{formatTime(appointment.appointmentTime)}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${getStatusStyle(
                          appointment.status,
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </td>

                    <td className="max-w-47.5 px-4 py-3.5 text-[11px] leading-relaxed text-slate-500">
                      {appointment.reason || "No reason provided"}
                    </td>

                    {canManageAppointments && (
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          {appointment.status === "Scheduled" && (
                            <button
                              type="button"
                              onClick={() => handleCheckIn(appointment._id)}
                              disabled={actionLoadingId === appointment._id}
                              title="Check In Patient"
                              className="rounded-md p-1.5 text-[#029352] transition-colors hover:bg-[#029352]/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <TicketCheck className="h-4 w-4" />
                            </button>
                          )}

                          {["Scheduled", "Checked-In"].includes(
                            appointment.status,
                          ) && (
                            <button
                              type="button"
                              onClick={() => openRescheduleModal(appointment)}
                              disabled={actionLoadingId === appointment._id}
                              title="Reschedule Appointment"
                              className="rounded-md p-1.5 text-[#1a4b8c] transition-colors hover:bg-[#1a4b8c]/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          )}

                          {["Scheduled", "Checked-In"].includes(
                            appointment.status,
                          ) && (
                            <button
                              type="button"
                              onClick={() => handleCancel(appointment)}
                              disabled={actionLoadingId === appointment._id}
                              title="Cancel Appointment"
                              className="rounded-md p-1.5 text-rose-500 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <UserRoundX className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 font-sans antialiased backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
            <div className="flex items-center justify-between border-b border-slate-200/60 bg-slate-50 px-5 py-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a4b8c]">
                  Reschedule <span className="text-[#029352]">Appointment</span>
                </h3>

                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                  {rescheduleTarget.appointmentNumber}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRescheduleTarget(null)}
                disabled={actionLoadingId === rescheduleTarget._id}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#1a4b8c]/5 hover:text-[#1a4b8c]"
                aria-label="Close reschedule modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={handleRescheduleAppointment}
              className="space-y-4 p-5"
            >
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Department
                </label>

                <select
                  required
                  value={rescheduleDepartmentId}
                  onChange={handleRescheduleDepartmentChange}
                  className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold uppercase text-slate-600 outline-none transition-all focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
                >
                  <option value="">SELECT DEPARTMENT</option>

                  {departments.map((department: any) => (
                    <option key={department._id} value={department._id}>
                      {department.name.toUpperCase()} ({department.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Doctor
                </label>

                <select
                  required
                  value={rescheduleDoctorId}
                  onChange={(event) =>
                    setRescheduleDoctorId(event.target.value)
                  }
                  disabled={!rescheduleDepartmentId || doctorLoading}
                  className="w-full cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold uppercase text-slate-600 outline-none transition-all focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">
                    {!rescheduleDepartmentId
                      ? "SELECT DEPARTMENT FIRST"
                      : doctorLoading
                        ? "LOADING DOCTORS..."
                        : "SELECT DOCTOR"}
                  </option>

                  {doctors.map((doctor: any) => (
                    <option key={doctor._id} value={doctor._id}>
                      {(doctor.name || "Unknown Doctor").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    New Date
                  </label>

                  <input
                    type="date"
                    required
                    min={getTodayDate()}
                    value={rescheduleDate}
                    onChange={(event) => setRescheduleDate(event.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    New Time
                  </label>

                  <input
                    type="time"
                    required
                    value={rescheduleTime}
                    onChange={(event) => setRescheduleTime(event.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Reschedule Reason
                </label>

                <textarea
                  rows={3}
                  value={rescheduleReason}
                  onChange={(event) => setRescheduleReason(event.target.value)}
                  placeholder="Patient requested a new time..."
                  className="w-full resize-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none placeholder:text-slate-300 focus:border-[#029352] focus:bg-white focus:ring-2 focus:ring-[#029352]/10"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setRescheduleTarget(null)}
                  disabled={actionLoadingId === rescheduleTarget._id}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    actionLoadingId === rescheduleTarget._id || doctorLoading
                  }
                  className="flex min-w-31 items-center justify-center gap-2 rounded-lg bg-[#1a4b8c] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#143b6e] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {actionLoadingId === rescheduleTarget._id ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>Saving</span>
                    </>
                  ) : (
                    <span>Confirm Schedule</span>
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
