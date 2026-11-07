import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { ProgramCard } from "@/components/marketing/ProgramCard";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { Check, ArrowRight, ShieldCheck } from "lucide-react";
import { getServiceBySlug, getSiteSettings, getNavigation, getServices } from "@/lib/data";

export const revalidate = 0;

export async function generateStaticParams() {
  const services = await getServices(false);
  return services.map((s) => ({ slug: s.slug }));
}

export default async function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [service, settings, headerNav, footerNav] = await Promise.all([
    getServiceBySlug(params.slug),
    getSiteSettings(),
    getNavigation("HEADER"),
    getNavigation("FOOTER"),
  ]);

  if (!service) {
    notFound();
  }

  let benefits: string[] = [];
  if (service.benefits) {
    try {
      benefits = JSON.parse(service.benefits);
    } catch {
      benefits = [service.benefits];
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9F6] text-[#242824] flex flex-col font-sans">
      <Header
        navItems={headerNav.map((n) => ({ label: n.label, href: n.href }))}
        siteName={settings.site_name}
        transparentOnHero={false}
      />

      {/* Hero Section */}
      <div className="bg-[#104D38] text-white py-16 sm:py-24">
        <div className="max-w-medvi mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {service.eyebrow && (
              <span className="text-xs font-bold tracking-widest uppercase text-[#779B7C] block mb-3">
                {service.eyebrow}
              </span>
            )}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              {service.title}
            </h1>
            <p className="text-lg sm:text-xl text-white/85 leading-relaxed mb-8">
              {service.summary}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={`/assessment?interest=${service.slug}`}
                className="px-8 py-3.5 rounded-full bg-[#779B7C] hover:bg-[#688A6D] text-white font-semibold text-base transition-all shadow-md"
              >
                Start Assessment
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Benefits */}
      <section className="py-16 sm:py-24">
        <div className="max-w-medvi mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {service.heroImage && (
              <div className="lg:col-span-6 rounded-3xl overflow-hidden shadow-xl aspect-[4/3] bg-gray-100">
                <img
                  src={service.heroImage}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className={service.heroImage ? "lg:col-span-6" : "lg:col-span-10 mx-auto"}>
              <span className="text-xs font-bold tracking-widest uppercase text-[#779B7C] block mb-2">
                CLINICAL PROTOCOL
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#242824] mb-6">
                Comprehensive care centered around you.
              </h2>
              <p className="text-base sm:text-lg text-[#6F7770] leading-relaxed mb-8">
                {service.description}
              </p>

              {benefits.length > 0 && (
                <div className="space-y-3 mb-8">
                  {benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#E9F1E8] text-[#104D38] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span className="text-sm sm:text-base font-medium text-[#242824]">
                        {b}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-[#6F7770]">
                <ShieldCheck className="w-4 h-4 text-[#779B7C]" />
                <span>Physician-Evaluated Telehealth Protocol</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Associated Programs */}
      {service.programs && service.programs.length > 0 && (
        <section className="py-16 sm:py-24 bg-[#E9F1E8]/50 border-t border-black/5">
          <div className="max-w-medvi mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-[#242824] mb-3">
                Available Programs for {service.title}
              </h2>
              <p className="text-sm sm:text-base text-[#6F7770]">
                Select a pathway below to view detailed features and clinical components.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.programs.map((p) => (
                <ProgramCard key={p.id} program={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <FinalCTA
        title={`Ready to explore ${service.title}?`}
        body="Take our 2-minute non-clinical intake questionnaire to connect with a licensed healthcare clinician."
        primaryCtaLabel="Begin Assessment"
        primaryCtaHref={`/assessment?interest=${service.slug}`}
      />

      <Footer settings={settings} footerNav={footerNav.map((n) => ({ label: n.label, href: n.href }))} />
    </div>
  );
}
