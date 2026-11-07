import React from "react";
import { prisma } from "@/lib/db";
import { saveService, deleteService } from "@/actions/cms";
import { Plus, Trash2, Edit3, Briefcase, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
    include: { programs: true },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#779B7C] block">
            CLINICAL PORTFOLIO
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#242824] tracking-tight">
            Services & Specialty Care
          </h1>
          <p className="text-xs sm:text-sm text-[#6F7770] mt-0.5">
            Configure clinical categories, landing sections, hero media, and program associations.
          </p>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#242824]">All Clinical Categories ({services.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9F6] text-[#6F7770] uppercase font-bold border-b border-black/5">
              <tr>
                <th className="py-3 px-6">Service Title</th>
                <th className="py-3 px-6">Slug</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Programs</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-[#242824]">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold flex items-center gap-3">
                    {s.heroImage && (
                      <img
                        src={s.heroImage}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                      />
                    )}
                    <div>
                      <span className="block">{s.title}</span>
                      <span className="text-[10px] text-[#6F7770] font-normal">{s.eyebrow}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-[#6F7770]">{s.slug}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        s.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-800"
                          : s.status === "COMING_SOON"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-[#104D38]">
                    {s.programs.length} active
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/services/${s.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#104D38] hover:bg-gray-100 transition-colors"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <form
                        action={async () => {
                          "use server";
                          await deleteService(s.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Service Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E9F1E8] text-[#104D38] flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#242824]">Add New Clinical Service</h3>
            <p className="text-xs text-[#6F7770]">Expand the clinic with a new category</p>
          </div>
        </div>

        <form action={saveService} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Service Title *
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Metabolic Longevity"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                URL Slug *
              </label>
              <input
                type="text"
                name="slug"
                required
                placeholder="e.g. metabolic-longevity"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Eyebrow Category Label
              </label>
              <input
                type="text"
                name="eyebrow"
                placeholder="e.g. CELLULAR OPTIMIZATION"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Status
              </label>
              <select
                name="status"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="COMING_SOON">COMING_SOON</option>
                <option value="DRAFT">DRAFT</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
              Short Summary
            </label>
            <input
              type="text"
              name="summary"
              required
              placeholder="Brief overview displayed on hero cards and previews"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
              Full Clinical Description
            </label>
            <textarea
              name="description"
              rows={3}
              required
              placeholder="Detailed explanation of clinical evaluations, biomarkers, and patient journeys"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
              Hero Image URL
            </label>
            <input
              type="url"
              name="heroImage"
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#104D38] hover:bg-[#175840] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Service</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
