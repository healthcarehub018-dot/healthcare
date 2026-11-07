import React from "react";
import { prisma } from "@/lib/db";
import { updateContentSection } from "@/actions/cms";
import { Save, Layers, Eye } from "lucide-react";

export const revalidate = 0;

export default async function AdminLandingPageEditor() {
  const sections = await prisma.contentSection.findMany({
    where: { pageKey: "weight-loss" },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#779B7C] block">
            CONVERSION CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#242824] tracking-tight">
            Weight Loss Landing Page Editor
          </h1>
          <p className="text-xs sm:text-sm text-[#6F7770] mt-0.5">
            Manage headlines, trust badges, and conversion copy on the /weight-loss route.
          </p>
        </div>

        <a
          href="/weight-loss"
          target="_blank"
          className="px-4 py-2 rounded-xl bg-white border border-black/10 text-xs font-semibold text-[#242824] hover:bg-gray-50 transition-colors shadow-sm inline-flex items-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5 text-[#104D38]" />
          <span>View Live Landing Page</span>
        </a>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-[#242824]">Hero & Value Proposition</h3>
        <p className="text-xs text-[#6F7770]">
          The high-converting light-background hero section tailored to metabolic care.
        </p>

        <form action={updateContentSection} className="space-y-5">
          <input type="hidden" name="pageKey" value="weight-loss" />
          <input type="hidden" name="sectionKey" value="hero" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Eyebrow Badge
              </label>
              <input
                type="text"
                name="eyebrow"
                defaultValue="Evidence-Informed Metabolic Care"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Headline
              </label>
              <input
                type="text"
                name="title"
                defaultValue="A more personal approach to weight management."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
              Supporting Description
            </label>
            <textarea
              name="body"
              rows={3}
              defaultValue="Explore guided weight-management options, licensed clinical consultations, and transparent ongoing support designed for your actual lifestyle."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Primary CTA Button
              </label>
              <input
                type="text"
                name="ctaLabel"
                defaultValue="Check Your Options"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                CTA Destination
              </label>
              <input
                type="text"
                name="ctaHref"
                defaultValue="/assessment?interest=weight-management"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#104D38] hover:bg-[#175840] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Landing Page Hero</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
