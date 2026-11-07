import React from "react";
import { prisma } from "@/lib/db";
import { updateContentSection } from "@/actions/cms";
import { Save, Layers, ArrowRight, Eye } from "lucide-react";

export const revalidate = 0;

export default async function AdminHomepageEditorPage() {
  const sections = await prisma.contentSection.findMany({
    where: { pageKey: "home" },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#779B7C] block">
            PAGE BUILDER & CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#242824] tracking-tight">
            Homepage Content Editor
          </h1>
          <p className="text-xs sm:text-sm text-[#6F7770] mt-0.5">
            Modify headlines, editorial descriptions, background variants, and CTAs without writing code.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          className="px-4 py-2 rounded-xl bg-white border border-black/10 text-xs font-semibold text-[#242824] hover:bg-gray-50 transition-colors shadow-sm inline-flex items-center gap-1.5"
        >
          <Eye className="w-3.5 h-3.5 text-[#104D38]" />
          <span>View Live Page</span>
        </a>
      </div>

      <div className="space-y-6">
        {sections.map((sec) => (
          <div
            key={sec.id}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-black/5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#E9F1E8] text-[#104D38]">
                  {sec.sectionKey}
                </span>
                <span className="text-sm font-semibold text-[#6F7770]">
                  Type: {sec.sectionType}
                </span>
              </div>
            </div>

            <form action={updateContentSection} className="space-y-5">
              <input type="hidden" name="pageKey" value="home" />
              <input type="hidden" name="sectionKey" value={sec.sectionKey} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                    Eyebrow Text
                  </label>
                  <input
                    type="text"
                    name="eyebrow"
                    defaultValue={sec.eyebrow || ""}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                    Main Headline
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={sec.title || ""}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                  Body Copy / Paragraph
                </label>
                <textarea
                  name="body"
                  rows={3}
                  defaultValue={sec.body || ""}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    name="ctaLabel"
                    defaultValue={sec.ctaLabel || ""}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                    CTA Link / Destination
                  </label>
                  <input
                    type="text"
                    name="ctaHref"
                    defaultValue={sec.ctaHref || ""}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                    Background Color Variant
                  </label>
                  <select
                    name="backgroundVariant"
                    defaultValue={sec.backgroundVariant || "cream"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
                  >
                    <option value="cream">Premium Cream (#F8F9F6)</option>
                    <option value="dark">Dark Forest (#104D38)</option>
                    <option value="blush">Soft Blush (#F7EDF1)</option>
                    <option value="sand">Warm Sand (#F5EDE6)</option>
                    <option value="blue">Pale Blue (#EAF2F5)</option>
                    <option value="white">Pure White (#FFFFFF)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#242824]">
                  <input
                    type="checkbox"
                    name="visible"
                    value="true"
                    defaultChecked={sec.visible}
                    className="h-4 w-4 rounded border-gray-300 text-[#104D38] focus:ring-[#104D38]"
                  />
                  <span>Section is visible on public website</span>
                </label>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#104D38] hover:bg-[#175840] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
