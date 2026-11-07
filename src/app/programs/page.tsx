import React from "react";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { ProgramCard } from "@/components/marketing/ProgramCard";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { getSiteSettings, getPrograms, getServices, getNavigation } from "@/lib/data";

export const revalidate = 0;

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const [settings, programs, services, headerNav, footerNav] = await Promise.all([
    getSiteSettings(),
    getPrograms(),
    getServices(true),
    getNavigation("HEADER"),
    getNavigation("FOOTER"),
  ]);

  const activeCategory = searchParams?.category || "all";

  const filteredPrograms =
    activeCategory === "all"
      ? programs
      : programs.filter((p) => p.service?.slug === activeCategory);

  return (
    <div className="min-h-screen bg-[#F8F9F6] text-[#242824] flex flex-col font-sans">
      <Header
        navItems={headerNav.map((n) => ({ label: n.label, href: n.href }))}
        siteName={settings.site_name}
        transparentOnHero={false}
      />

      <div className="bg-[#104D38] text-white py-16 sm:py-20">
        <div className="max-w-medvi mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-[#779B7C] block mb-3">
            CLINICAL EXCELLENCE
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">
            Our Care Programs
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
            Evidence-informed telehealth programs tailored to metabolic health, vitality, longevity, and whole-life balance.
          </p>
        </div>
      </div>

      <div className="max-w-medvi mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <a
            href="/programs"
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeCategory === "all"
                ? "bg-[#104D38] text-white shadow-sm"
                : "bg-white text-[#242824] hover:bg-gray-100 border border-black/5"
            }`}
          >
            All Programs
          </a>
          {services.map((s) => (
            <a
              key={s.slug}
              href={`/programs?category=${s.slug}`}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeCategory === s.slug
                  ? "bg-[#104D38] text-white shadow-sm"
                  : "bg-white text-[#242824] hover:bg-gray-100 border border-black/5"
              }`}
            >
              {s.title}
            </a>
          ))}
        </div>

        {/* Program Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrograms.map((p) => (
            <ProgramCard key={p.id} program={p} />
          ))}
        </div>

        {filteredPrograms.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-black/5 p-8 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-[#242824] mb-2">No programs currently found</h3>
            <p className="text-sm text-[#6F7770] mb-6">
              We are continually expanding our clinical portfolio.
            </p>
            <a
              href="/assessment"
              className="inline-block px-6 py-3 rounded-full bg-[#104D38] text-white font-semibold text-sm"
            >
              Inquire With Care Team
            </a>
          </div>
        )}
      </div>

      <FinalCTA />
      <Footer settings={settings} footerNav={footerNav.map((n) => ({ label: n.label, href: n.href }))} />
    </div>
  );
}
