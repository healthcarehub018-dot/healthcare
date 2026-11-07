import React from "react";
import { prisma } from "@/lib/db";
import { saveSettings } from "@/actions/cms";
import { Search, Save, Globe } from "lucide-react";

export const revalidate = 0;

export default async function AdminSeoPage() {
  const settings = await prisma.siteSetting.findMany();
  const map: Record<string, string> = {};
  settings.forEach((s) => {
    map[s.key] = s.value;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#779B7C] block">
            SEARCH & INDEXING
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#242824] tracking-tight">
            SEO & Social Metadata
          </h1>
          <p className="text-xs sm:text-sm text-[#6F7770] mt-0.5">
            Manage global search engine snippet descriptions, titles, and Open Graph previews.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6">
        <form action={saveSettings} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Default Site Title
              </label>
              <input
                type="text"
                name="seo_default_title"
                defaultValue={map.seo_default_title || "Suzzmed Healthcare | Personalized Telehealth & Metabolic Care"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Meta Description
              </label>
              <textarea
                name="seo_meta_desc"
                rows={3}
                defaultValue={
                  map.seo_meta_desc ||
                  "Discover personalized telemedicine programs in medical weight management, men's vitality, women's hormonal balance, and longevity."
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                  Canonical Base URL
                </label>
                <input
                  type="url"
                  name="seo_canonical_url"
                  defaultValue={map.seo_canonical_url || "https://suzzmed.local"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                  Social Share Card (Open Graph Image URL)
                </label>
                <input
                  type="url"
                  name="seo_og_image"
                  defaultValue={map.seo_og_image || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-black/5 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#104D38] hover:bg-[#175840] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update SEO Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
