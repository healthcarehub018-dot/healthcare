import React from "react";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { ShieldCheck, Heart, Users, Award, CheckCircle } from "lucide-react";
import { getSiteSettings, getNavigation } from "@/lib/data";

export const revalidate = 0;

export default async function AboutPage() {
  const [settings, headerNav, footerNav] = await Promise.all([
    getSiteSettings(),
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

      {/* Hero */}
      <div className="bg-[#104D38] text-white py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-[#779B7C] block mb-3">
            OUR PURPOSE
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
            Healthcare designed around human connection.
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            We built Suzzmed to bridge the gap between advanced medical science and compassionate, individualized patient guidance.
          </p>
        </div>
      </div>

      {/* Story & Philosophy */}
      <section className="py-20 sm:py-28">
        <div className="max-w-medvi mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 rounded-3xl overflow-hidden shadow-xl aspect-[4/3] bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1000&auto=format&fit=crop"
                alt="Medical clinical guidance"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-6">
              <span className="text-xs font-bold tracking-widest uppercase text-[#779B7C] block mb-2">
                FOUNDATIONAL PRINCIPLES
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#242824] mb-6">
                Redefining the telehealth standard.
              </h2>
              <p className="text-base sm:text-lg text-[#6F7770] leading-relaxed mb-6">
                Traditional healthcare is frequently fragmented, rushed, and reactive. Patients spend weeks waiting for brief ten-minute appointments that fail to address the root causes of metabolic friction, hormonal transitions, and chronic fatigue.
              </p>
              <p className="text-base sm:text-lg text-[#6F7770] leading-relaxed mb-8">
                At Suzzmed, our clinical protocols prioritize proactive wellness. We combine detailed biomarker evaluations with accessible digital communication, allowing you to partner with licensed physicians and registered dietitians continuously.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#E9F1E8]">
                  <h4 className="font-bold text-[#104D38] text-lg mb-1">Board-Certified</h4>
                  <p className="text-xs text-[#242824]">Experienced clinicians licensed across state medical jurisdictions.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#E9F1E8]">
                  <h4 className="font-bold text-[#104D38] text-lg mb-1">Whole-Life Care</h4>
                  <p className="text-xs text-[#242824]">Metabolic, hormonal, nutritional, and restorative longevity protocols.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#175840] text-white">
        <div className="max-w-medvi mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Clinical Commitment</h2>
            <p className="text-white/80">Principles guiding every consultation, prescription, and patient conversation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10">
              <ShieldCheck className="w-8 h-8 text-[#779B7C] mb-4" />
              <h3 className="text-xl font-bold mb-2">Clinical Rigor</h3>
              <p className="text-sm text-white/75 leading-relaxed">
                We never rush or rubber-stamp treatments. All prescriptions require thorough clinical evaluation by licensed medical providers.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10">
              <Award className="w-8 h-8 text-[#779B7C] mb-4" />
              <h3 className="text-xl font-bold mb-2">Absolute Transparency</h3>
              <p className="text-sm text-white/75 leading-relaxed">
                Clear ingredient disclosures, explicit medication sources, and honest discussions about realistic expectations and timelines.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10">
              <Heart className="w-8 h-8 text-[#779B7C] mb-4" />
              <h3 className="text-xl font-bold mb-2">Compassionate Guidance</h3>
              <p className="text-sm text-white/75 leading-relaxed">
                Health is personal. Our care concierges and clinicians listen intently, creating supportive and judgment-free clinical experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />
      <Footer settings={settings} footerNav={footerNav.map((n) => ({ label: n.label, href: n.href }))} />
    </div>
  );
}
