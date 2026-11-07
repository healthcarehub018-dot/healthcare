import React from "react";
import { prisma } from "@/lib/db";
import { saveSettings } from "@/actions/cms";
import { Settings, Save, Sparkles } from "lucide-react";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const allSettings = await prisma.siteSetting.findMany();
  const map: Record<string, string> = {};
  allSettings.forEach((s) => {
    map[s.key] = s.value;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#779B7C] block">
            CONFIGURATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#242824] tracking-tight">
            Clinic & Platform Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#6F7770] mt-0.5">
            Configure contact details, promotional banners, theme color tokens, and business hours.
          </p>
        </div>
      </div>

      <form action={saveSettings} className="space-y-8">
        {/* General Identity */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-[#242824] border-b border-black/5 pb-3">
            Brand & Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Brand Name
              </label>
              <input
                type="text"
                name="site_name"
                defaultValue={map.site_name || "Suzzmed Healthcare"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Tagline
              </label>
              <input
                type="text"
                name="tagline"
                defaultValue={map.tagline || "Care designed around you."}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-[#242824] border-b border-black/5 pb-3">
            Care Coordination Contacts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Public Inquiries Email
              </label>
              <input
                type="email"
                name="contact_email"
                defaultValue={map.contact_email || "care@suzzmed.local"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                name="contact_phone"
                defaultValue={map.contact_phone || "+1 (800) 492-SUZZ"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Physical Office Address
              </label>
              <input
                type="text"
                name="contact_address"
                defaultValue={map.contact_address || "500 Healthcare Way, Suite 400, Austin, TX 78701"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Care Coordination Hours
              </label>
              <input
                type="text"
                name="contact_hours"
                defaultValue={map.contact_hours || "Mon - Fri: 8am - 8pm EST | Sat: 9am - 5pm EST"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
          </div>
        </div>

        {/* Promotional Top Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-[#242824] border-b border-black/5 pb-3">
            Header Promotional Banner
          </h2>

          <div className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#242824]">
              <input
                type="checkbox"
                name="promo_banner_active"
                value="true"
                defaultChecked={map.promo_banner_active === "true"}
                className="h-4 w-4 rounded border-gray-300 text-[#104D38] focus:ring-[#104D38]"
              />
              <span>Display promotional banner above header navigation</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                  Banner Text
                </label>
                <input
                  type="text"
                  name="promo_banner_text"
                  defaultValue={
                    map.promo_banner_text ||
                    "✨ Complimentary Physician Consultation on All Initial Weight Care Programs"
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                  Banner Link Target
                </label>
                <input
                  type="text"
                  name="promo_banner_link"
                  defaultValue={map.promo_banner_link || "/weight-loss"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-full bg-[#104D38] hover:bg-[#175840] text-white text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
