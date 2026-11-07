import React from "react";
import { prisma } from "@/lib/db";
import { History, ShieldAlert, Clock, User } from "lucide-react";

export const revalidate = 0;

export default async function AdminAuditPage() {
  const logs = await prisma.auditLog.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#779B7C] block">
            GOVERNANCE & SECURITY
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#242824] tracking-tight">
            Security & Audit Activity Logs
          </h1>
          <p className="text-xs sm:text-sm text-[#6F7770] mt-0.5">
            Immutable log of administrative mutations, auth events, status changes, and CMS updates.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-black/5">
          <h2 className="text-sm font-bold text-[#242824]">Recent Audit Entries ({logs.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9F6] text-[#6F7770] uppercase font-bold border-b border-black/5">
              <tr>
                <th className="py-3 px-6">Timestamp</th>
                <th className="py-3 px-6">Actor</th>
                <th className="py-3 px-6">Entity</th>
                <th className="py-3 px-6">Action</th>
                <th className="py-3 px-6">Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-[#242824]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3.5 px-6 font-mono text-[#6F7770] whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-6 font-semibold">
                    {log.adminName || "System / Automated"}
                  </td>
                  <td className="py-3.5 px-6 font-mono text-[10px] text-[#779B7C] font-bold">
                    {log.entityType}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-[#242824] font-bold text-[10px] uppercase font-mono">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-[#242824] max-w-md truncate">
                    {log.summary}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    No security events recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
