import React from "react";
import {
  ShieldAlert,
  Fingerprint,
  Key,
  Lock,
  Activity,
  Database,
} from "lucide-react";

export const SecurityLogsWorkspace: React.FC = () => {
  const mockAuditFeeds = [
    {
      id: "LOG-9021",
      event: "User Profile Token Overwritten",
      operator: "admin@hospital.com",
      role: "SUPER_ADMIN",
      ip: "127.0.0.1",
      status: "SUCCESS",
      signature: "sha256_0x9A4F",
    },
    {
      id: "LOG-9022",
      event: "OPD Checkup Ticket Issued (#1)",
      operator: "receptionist_station_1",
      role: "RECEPTIONIST",
      ip: "192.168.10.15",
      status: "SUCCESS",
      signature: "sha256_0xB7C1",
    },
    {
      id: "LOG-9023",
      event: "e-Prescription Transmitted",
      operator: "dr.shahzad@hospital.com",
      role: "DOCTOR",
      ip: "192.168.10.22",
      status: "SUCCESS",
      signature: "sha256_0xE5F3",
    },
    {
      id: "LOG-9024",
      event: "Pathology Specimen Findings Authorized",
      operator: "path_lab_tech_alpha",
      role: "LAB_TECHNICIAN",
      ip: "192.168.10.8",
      status: "SUCCESS",
      signature: "sha256_0x1C9D",
    },
    {
      id: "LOG-9025",
      event: "Central Invoice Ledger Settle Succeeded",
      operator: "admin@hospital.com",
      role: "SUPER_ADMIN",
      ip: "127.0.0.1",
      status: "SUCCESS",
      signature: "sha256_0x8D3E",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl p-6 font-sans antialiased text-slate-700">
      <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-200/60 bg-slate-50 p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1a4b8c]">
            Security{" "}
            <span className="text-[#029352]">Logs</span>
          </h1>

          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">
            Monitor RBAC audit trails and cryptographic access events.
          </p>
        </div>

        <div className="shrink-0 rounded-lg border border-rose-100 bg-rose-50/50 p-2.5 text-rose-600">
          <ShieldAlert className="h-5 w-5" />
        </div>
      </div>

      <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-sm">
        {/* Header */}
        <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="rounded-lg bg-rose-50/50 p-2 text-rose-600">
            <ShieldAlert className="h-4 w-4" />
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a4b8c]">
              Cryptographic Access{" "}
              <span className="text-[#029352]">& Audit Logs</span>
            </h3>

            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Role-Based Access Control (RBAC) System Security Tracking Feeds
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg border border-slate-200/60 bg-slate-50 p-4">
            <div className="rounded-md bg-[#1a4b8c]/10 p-2 text-[#1a4b8c]">
              <Fingerprint className="h-5 w-5" />
            </div>

            <div>
              <span className="block text-[9px] font-bold uppercase text-slate-400">
                Encrypted Keys
              </span>

              <span className="text-xs font-bold text-slate-700">
                AES-256 Bit Secure
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-slate-200/60 bg-slate-50 p-4">
            <div className="rounded-md bg-[#029352]/10 p-2 text-[#029352]">
              <Key className="h-5 w-5" />
            </div>

            <div>
              <span className="block text-[9px] font-bold uppercase text-slate-400">
                Session Validation
              </span>

              <span className="text-xs font-bold text-slate-700">
                Stateless JWT Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-slate-200/60 bg-slate-50 p-4">
            <div className="rounded-md bg-[#1a4b8c]/10 p-2 text-[#1a4b8c]">
              <Database className="h-5 w-5" />
            </div>

            <div>
              <span className="block text-[9px] font-bold uppercase text-slate-400">
                Database Proxy
              </span>

              <span className="text-xs font-bold text-slate-700">
                127.0.0.1:27017
              </span>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200/60">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[9px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-4 py-3">Log Ref Code</th>
                <th className="px-4 py-3">System Core Event Action</th>
                <th className="px-4 py-3">Authorized Operator Session</th>
                <th className="px-4 py-3">Assigned RBAC Role</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Cryptographic Hash Signature</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white text-xs font-medium text-slate-600">
              {mockAuditFeeds.map((feed) => (
                <tr
                  key={feed.id}
                  className="transition-colors hover:bg-slate-50/30"
                >
                  <td className="px-4 py-3.5 font-mono text-[10px] font-bold text-[#1a4b8c]">
                    {feed.id}
                  </td>

                  <td className="px-4 py-3.5 text-slate-700">
                    {feed.event}
                  </td>

                  <td className="px-4 py-3.5 font-mono text-[10px] text-slate-500">
                    {feed.operator}
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600">
                      {feed.role.replace("_", " ")}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 font-mono text-[10px] text-slate-500">
                    {feed.ip}
                  </td>

                  <td className="px-4 py-3.5 font-mono text-[9px] text-slate-400">
                    {feed.signature}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200/60 bg-slate-50 p-3">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-[#029352]/10 p-1.5 text-[#029352]">
              <Lock className="h-3.5 w-3.5" />
            </div>

            <span className="text-[10px] font-medium text-slate-500">
              All audit logs are cryptographically signed and immutable.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-md bg-[#1a4b8c]/10 p-1.5 text-[#1a4b8c]">
              <Activity className="h-3.5 w-3.5" />
            </div>

            <span className="text-[10px] font-medium text-slate-500">
              Real-time monitoring active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};