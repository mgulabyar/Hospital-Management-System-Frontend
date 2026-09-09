/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from "react";
import {
  Building2,
  Plus,
  RefreshCw,
  Edit2,
  CheckCircle2,
  X,
} from "lucide-react";
import { hmsServices } from "../../services/apiService";

export const DepartmentManagement: React.FC = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [consultationFee, setConsultationFee] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);

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

      window.setTimeout(() => {
        setSuccessMsg("");
        setErrorMsg("");
      }, 2000);
    },
    [],
  );

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await hmsServices.departments.getAllDepartments(false);
      if (response.success) {
        setDepartments(response.data || []);
      } else {
        showToast("Failed to load departments", "error");
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || "Failed to fetch departments",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleResetForm = () => {
    setName("");
    setCode("");
    setConsultationFee("");
    setDescription("");
    setIsActive(true);
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !code.trim() || !consultationFee) {
      showToast("Please fill all required fields", "error");
      return;
    }

    setSaving(true);

    const payload = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      consultationFee: Number(consultationFee),
      description: description.trim(),
      isActive,
    };

    try {
      if (editingId) {
        const response = await hmsServices.departments.updateDepartment(
          editingId,
          payload,
        );
        if (response.success) {
          showToast("Department updated successfully", "success");
          await fetchDepartments();
          handleResetForm();
        }
      } else {
        const response =
          await hmsServices.departments.createDepartment(payload);
        if (response.success) {
          showToast(`Department "${name}" created successfully`, "success");
          await fetchDepartments();
          handleResetForm();
        }
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || "Failed to save department",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (department: any) => {
    setEditingId(department._id);
    setName(department.name);
    setCode(department.code);
    setConsultationFee(String(department.consultationFee));
    setDescription(department.description || "");
    setIsActive(department.isActive);
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await hmsServices.departments.toggleDepartmentStatus(id);
      if (response.success) {
        showToast("Department status updated", "success");
        await fetchDepartments();
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || "Failed to toggle status",
        "error",
      );
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6 font-sans antialiased text-slate-700">
      {/* Floating Toast */}
      {(successMsg || errorMsg) && (
        <div className="fixed right-6 top-20 z-50 w-[calc(100%-3rem)] max-w-md animate-[fadeIn_0.2s_ease-out]">
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

      {/* Header */}
      <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1a4b8c]">
            Manage <span className="text-[#029352]">Departments</span>
          </h1>
          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
            Create and manage hospital clinical departments.
          </p>
        </div>

        <div className="shrink-0 rounded-lg border border-emerald-100 bg-[#029352]/10 p-2.5 text-[#029352]">
          <Building2 className="h-5 w-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form Section */}
        <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-1">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="rounded-lg bg-[#1a4b8c]/10 p-2 text-[#1a4b8c]">
              {editingId ? (
                <Edit2 className="h-5 w-5" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase text-[#1a4b8c]">
                {editingId ? "Edit" : "Add New"}{" "}
                <span className="text-[#029352]">Department</span>
              </h3>
              <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                {editingId ? "Update" : "Create"} department information
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
                Department Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Cardiology"
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
                Department Code
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="CARD"
                maxLength={5}
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
                Consultation Fee (PKR)
              </label>
              <input
                type="number"
                required
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                placeholder="2000"
                min="0"
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-slate-400">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Heart and cardiovascular diseases..."
                rows={3}
                className="w-full resize-none rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a4b8c] focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#029352] focus:ring-[#029352]"
              />
              <label
                htmlFor="isActive"
                className="text-xs font-medium text-slate-700"
              >
                Active Department
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-md bg-[#1a4b8c] px-4 py-2.5 text-[10px] font-bold uppercase text-white shadow-sm transition-colors hover:bg-[#143b6e] focus:outline-none focus:ring-2 focus:ring-[#029352]/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Department"
                    : "Create Department"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="rounded-md border border-slate-200 bg-white px-4 py-2.5 text-[10px] font-bold uppercase text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Section */}
        <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-[#029352]/10 p-2 text-[#029352]">
                <Building2 className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase text-[#1a4b8c]">
                  Department <span className="text-[#029352]">List</span>
                </h3>
                <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                  All registered clinical departments
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchDepartments}
              disabled={loading}
              className="rounded-md border border-slate-200 bg-white p-2 text-slate-400 transition-colors hover:bg-[#1a4b8c]/5 hover:text-[#1a4b8c] disabled:cursor-not-allowed disabled:opacity-50"
              title="Refresh Departments"
            >
              <RefreshCw
                className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          {loading && (
            <div className="flex min-h-60 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a4b8c] border-t-[#029352]" />
            </div>
          )}

          {!loading && departments.length === 0 && (
            <div className="flex min-h-60 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50">
              <Building2 className="mb-3 h-8 w-8 text-slate-400" />
              <p className="text-xs font-medium text-slate-400">
                No departments found
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                Create your first department using the form
              </p>
            </div>
          )}

          {!loading && departments.length > 0 && (
            <div className="space-y-2">
              {departments.map((dept: any) => (
                <div
                  key={dept._id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/60 p-3 transition-colors hover:bg-slate-100"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {dept.name}{" "}
                      <span className="text-[#029352]">({dept.code})</span>
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      Fee: Rs. {dept.consultationFee.toLocaleString()} •{" "}
                      {dept.description || "No description"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide ${
                        dept.isActive
                          ? "border-emerald-100 bg-emerald-50 text-[#029352]"
                          : "border-rose-100 bg-rose-50 text-rose-600"
                      }`}
                    >
                      {dept.isActive ? "Active" : "Inactive"}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleEdit(dept)}
                      className="rounded-md p-1.5 text-[#1a4b8c] transition-colors hover:bg-[#1a4b8c]/10"
                      title="Edit Department"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(dept._id)}
                      className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-200"
                      title="Toggle Status"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
