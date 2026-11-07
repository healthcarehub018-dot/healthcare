import React from "react";
import { prisma } from "@/lib/db";
import { saveProgram, deleteProgram } from "@/actions/cms";
import { Plus, Trash2, FileText, CheckCircle2 } from "lucide-react";

export const revalidate = 0;

export default async function AdminProgramsPage() {
  const [programs, services] = await Promise.all([
    prisma.program.findMany({
      orderBy: { sortOrder: "asc" },
      include: { service: true },
    }),
    prisma.service.findMany({
      orderBy: { title: "asc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#779B7C] block">
            CLINICAL OFFERINGS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#242824] tracking-tight">
            Programs & Pricing Management
          </h1>
          <p className="text-xs sm:text-sm text-[#6F7770] mt-0.5">
            Manage membership tiers, starting pricing, availability indicators, and feature checklists.
          </p>
        </div>
      </div>

      {/* Program list table */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#242824]">All Active Programs ({programs.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9F6] text-[#6F7770] uppercase font-bold border-b border-black/5">
              <tr>
                <th className="py-3 px-6">Program Title</th>
                <th className="py-3 px-6">Associated Service</th>
                <th className="py-3 px-6">Price Display</th>
                <th className="py-3 px-6">Availability</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-[#242824]">
              {programs.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold flex items-center gap-3">
                    {p.image && (
                      <img
                        src={p.image}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                      />
                    )}
                    <div>
                      <span className="block">{p.title}</span>
                      <span className="text-[10px] text-[#6F7770] font-mono">{p.slug}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#6F7770]">
                    {p.service?.title || "Standalone"}
                  </td>
                  <td className="py-4 px-6 font-extrabold text-[#104D38]">
                    {p.priceDisplay || "Custom Intake"}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        p.availability === "AVAILABLE"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {p.availability}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <form
                      action={async () => {
                        "use server";
                        await deleteProgram(p.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Program"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Program Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E9F1E8] text-[#104D38] flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#242824]">Create Care Program</h3>
            <p className="text-xs text-[#6F7770]">Add a protocol to the programs catalog</p>
          </div>
        </div>

        <form action={saveProgram} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Program Title *
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Metabolic Longevity & Reset"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                required
                placeholder="e.g. metabolic-reset-protocol"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Clinical Category
              </label>
              <select
                name="serviceId"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              >
                <option value="">-- Standalone Program --</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Price Display
              </label>
              <input
                type="text"
                name="priceDisplay"
                placeholder="e.g. From $199"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Availability Status
              </label>
              <select
                name="availability"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="WAITLIST">WAITLIST</option>
                <option value="COMING_SOON">COMING_SOON</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
              Program Description *
            </label>
            <textarea
              name="description"
              rows={2}
              required
              placeholder="Doctor-supervised care protocol including continuous telehealth guidance and lifestyle integration."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
              Program Image URL
            </label>
            <input
              type="url"
              name="image"
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#242824]">
              <input
                type="checkbox"
                name="active"
                value="true"
                defaultChecked
                className="h-4 w-4 rounded border-gray-300 text-[#104D38] focus:ring-[#104D38]"
              />
              <span>Program is active and visible in catalog</span>
            </label>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#104D38] hover:bg-[#175840] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Save Program</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
