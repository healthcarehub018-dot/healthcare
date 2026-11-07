import React from "react";
import { prisma } from "@/lib/db";
import { updateLead } from "@/actions/cms";
import { Users, Download, Search, Filter, Phone, Mail, Clock, ShieldCheck, Save } from "lucide-react";

export const revalidate = 0;

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams?: { status?: string; q?: string; id?: string };
}) {
  const statusFilter = searchParams?.status;
  const searchQuery = searchParams?.q?.toLowerCase();
  const selectedId = searchParams?.id;

  const whereClause: any = {};
  if (statusFilter && statusFilter !== "ALL") {
    whereClause.status = statusFilter;
  }
  if (searchQuery) {
    whereClause.OR = [
      { firstName: { contains: searchQuery } },
      { lastName: { contains: searchQuery } },
      { email: { contains: searchQuery } },
      { referenceCode: { contains: searchQuery } },
    ];
  }

  const leads = await prisma.lead.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  const selectedLead = selectedId ? await prisma.lead.findUnique({ where: { id: selectedId } }) : null;

  return (
    <div className="space-y-8">
      {/* Header & CSV Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#779B7C] block">
            PATIENT CRM-LITE
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#242824] tracking-tight">
            Leads & Intake Management
          </h1>
          <p className="text-xs sm:text-sm text-[#6F7770] mt-0.5">
            Review incoming assessment submissions, clinical inquiry status, and coordination notes.
          </p>
        </div>

        <a
          href="/api/admin/leads/export"
          className="px-4 py-2.5 rounded-xl bg-white border border-black/10 text-xs font-bold text-[#104D38] hover:bg-gray-50 transition-colors shadow-sm inline-flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </a>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-black/5 shadow-sm text-xs">
        <span className="font-bold text-[#6F7770] flex items-center gap-1.5 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Status Filter:</span>
        </span>
        {["ALL", "NEW", "CONTACTED", "FOLLOW_UP", "QUALIFIED_FOR_CONTACT", "CLOSED", "SPAM"].map((st) => (
          <a
            key={st}
            href={`/admin/leads?status=${st}`}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              (statusFilter === st || (!statusFilter && st === "ALL"))
                ? "bg-[#104D38] text-white shadow-sm"
                : "bg-gray-100 text-[#242824] hover:bg-gray-200"
            }`}
          >
            {st}
          </a>
        ))}
      </div>

      {/* Table & Selected Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className={selectedLead ? "lg:col-span-7" : "lg:col-span-12"}>
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-black/5 flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#242824]">
                Inquiry Submissions ({leads.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F9F6] text-[#6F7770] uppercase font-bold border-b border-black/5">
                  <tr>
                    <th className="py-3 px-4">Ref Code</th>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Area & Goal</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 text-[#242824]">
                  {leads.map((l) => (
                    <tr
                      key={l.id}
                      className={`hover:bg-gray-50/80 transition-colors cursor-pointer ${
                        selectedId === l.id ? "bg-[#E9F1E8]/50" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#104D38]">
                        <a href={`/admin/leads?id=${l.id}${statusFilter ? `&status=${statusFilter}` : ""}`}>
                          {l.referenceCode}
                        </a>
                      </td>
                      <td className="py-3.5 px-4 font-semibold">
                        <a href={`/admin/leads?id=${l.id}${statusFilter ? `&status=${statusFilter}` : ""}`}>
                          {l.firstName} {l.lastName}
                        </a>
                        <span className="block text-[10px] text-[#6F7770] font-normal">{l.email}</span>
                      </td>
                      <td className="py-3.5 px-4 text-[#6F7770] max-w-xs truncate">
                        {l.goalCategory || "General Intake"}
                      </td>
                      <td className="py-3.5 px-4 capitalize text-[#6F7770]">
                        {l.preferredContact}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            l.status === "NEW"
                              ? "bg-amber-100 text-amber-800"
                              : l.status === "CONTACTED"
                              ? "bg-blue-100 text-blue-800"
                              : l.status === "QUALIFIED_FOR_CONTACT"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-[#6F7770] whitespace-nowrap">
                        {new Date(l.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-400">
                        No inquiries matching current criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selected Lead Drawer/Editor */}
        {selectedLead && (
          <div className="lg:col-span-5 bg-white rounded-2xl border border-black/5 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-black/5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#779B7C] block">
                  Lead Details
                </span>
                <h3 className="text-lg font-bold text-[#242824]">
                  {selectedLead.firstName} {selectedLead.lastName}
                </h3>
                <span className="text-xs font-mono text-[#104D38] font-bold">
                  {selectedLead.referenceCode}
                </span>
              </div>
              <a
                href="/admin/leads"
                className="text-xs text-[#6F7770] hover:text-[#242824] underline"
              >
                Close
              </a>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-[#242824]">
                <Mail className="w-4 h-4 text-[#779B7C]" />
                <a href={`mailto:${selectedLead.email}`} className="text-[#104D38] font-semibold hover:underline">
                  {selectedLead.email}
                </a>
              </div>
              {selectedLead.phone && (
                <div className="flex items-center gap-2 text-[#242824]">
                  <Phone className="w-4 h-4 text-[#779B7C]" />
                  <span>{selectedLead.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-[#6F7770]">
                <Clock className="w-4 h-4 text-[#779B7C]" />
                <span>Submitted: {new Date(selectedLead.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-[#6F7770]">
                <ShieldCheck className="w-4 h-4 text-[#779B7C]" />
                <span>Source: {selectedLead.source}</span>
              </div>
            </div>

            {selectedLead.message && (
              <div className="p-4 rounded-xl bg-[#F8F9F6] border border-black/5 text-xs">
                <span className="font-bold text-[#242824] block mb-1">Patient Note:</span>
                <p className="text-[#6F7770] leading-relaxed">{selectedLead.message}</p>
              </div>
            )}

            {/* Update Status & Notes Form */}
            <form action={updateLead} className="space-y-4 pt-4 border-t border-black/5">
              <input type="hidden" name="id" value={selectedLead.id} />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                  Update Lead Status
                </label>
                <select
                  name="status"
                  defaultValue={selectedLead.status}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#104D38]"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="FOLLOW_UP">FOLLOW_UP</option>
                  <option value="QUALIFIED_FOR_CONTACT">QUALIFIED_FOR_CONTACT</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="SPAM">SPAM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                  Internal Care Coordination Notes
                </label>
                <textarea
                  name="internalNotes"
                  rows={4}
                  defaultValue={selectedLead.internalNotes || ""}
                  placeholder="Record call attempts, clinician assignments, or communication logs..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#104D38]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#104D38] hover:bg-[#175840] text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Lead Record</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
