import React from "react";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { getSiteSettings, getFAQs, getNavigation } from "@/lib/data";

export const revalidate = 0;

export default async function FaqPage() {
  const [settings, faqs, headerNav, footerNav] = await Promise.all([
    getSiteSettings(),
    getFAQs("all"),
    getNavigation("HEADER"),
    getNavigation("FOOTER"),
  ]);

  return (
    <div className="min-h-screen bg-[#F8F9F6] text-[#242824] flex flex-col font-sans">
      <Header
        navItems={headerNav.map((n) => ({ label: n.label, href: n.href }))}
        siteName={settings.site_name}
        transparentOnHero={false}
      />

      <div className="bg-[#104D38] text-white py-20 sm:py-28 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest uppercase text-[#779B7C] block mb-3">
            HELP & TRANSPARENCY
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Find immediate answers regarding telehealth consultations, clinical requirements, billing, shipping, and program flexibility.
          </p>
        </div>
      </div>

      <div className="flex-1">
        <FaqAccordion
          title="All Questions & Answers"
          subtitle="Explore questions grouped by clinical topics, medical intake, and patient privacy."
          faqs={faqs}
          showCategoryFilters={true}
        />
      </div>

      <FinalCTA />
      <Footer settings={settings} footerNav={footerNav.map((n) => ({ label: n.label, href: n.href }))} />
    </div>
  );
}
