import React from "react";
import Link from "next/link";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { WeightSlider } from "@/components/marketing/WeightSlider";
import { GoalSelector } from "@/components/marketing/GoalSelector";
import { ProgramCard } from "@/components/marketing/ProgramCard";
import { TestimonialsCarousel } from "@/components/marketing/TestimonialsCarousel";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import {
  Check,
  ArrowRight,
  ShieldCheck,
  Activity,
  Heart,
  Scale,
  Sparkles,
  ClipboardCheck,
  Stethoscope,
  Smile,
} from "lucide-react";
import {
  getSiteSettings,
  getPrograms,
  getTestimonials,
  getFAQs,
  getNavigation,
  getVerifiedMetrics,
} from "@/lib/data";

export const revalidate = 0;

export default async function WeightLossPage() {
  const [settings, allPrograms, testimonials, faqs, headerNav, footerNav, metrics] =
    await Promise.all([
      getSiteSettings(),
      getPrograms(),
      getTestimonials("landing"),
      getFAQs("weight-loss"),
      getNavigation("HEADER"),
      getNavigation("FOOTER"),
      getVerifiedMetrics(),
    ]);

  const weightPrograms = allPrograms.filter(
    (p) =>
      p.service?.slug === "weight-management" ||
      p.slug.includes("glp1") ||
      p.slug.includes("weight") ||
      p.slug.includes("nutrition")
  );

  return (
    <div className="min-h-screen bg-[#F8F9F6] text-[#242824] flex flex-col font-sans">
      {/* WL01 & WL02: Navigation & Top Banner */}
      <Header
        navItems={headerNav.map((n) => ({ label: n.label, href: n.href }))}
        siteName={settings.site_name || "Suzzmed Healthcare"}
        ctaLabel="Check Your Options"
        ctaHref="/assessment?interest=weight-management"
        promoBanner={{
          active: true,
          text: "✨ Telehealth Intake Consultations Included in Initial Membership Plans",
          link: "/assessment?interest=weight-management",
        }}
        transparentOnHero={false}
      />

      {/* WL03: Conversion Hero (Cream Background with Staggered Portrait Mosaic) */}
      <section className="pt-12 sm:pt-20 pb-16 sm:pb-24 bg-[#F8F9F6] border-b border-black/5 overflow-hidden">
        <div className="max-w-medvi mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9F1E8] text-[#104D38] text-xs font-bold uppercase tracking-wider mb-6">
                <ShieldCheck className="w-4 h-4 text-[#779B7C]" />
                <span>Evidence-Informed Metabolic Care</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#242824] leading-[1.08] mb-6">
                A more personal approach to{" "}
                <span className="text-[#779B7C]">weight management.</span>
              </h1>

              <p className="text-lg sm:text-xl text-[#6F7770] leading-relaxed mb-8 max-w-xl">
                Explore guided weight-management options, licensed clinical consultations, and transparent ongoing support designed for your actual lifestyle.
              </p>

              {/* Benefit checks */}
              <div className="space-y-3 mb-10 w-full max-w-lg">
                {[
                  "Personalized clinical intake & evaluation",
                  "Prescription coordination where medically indicated",
                  "Continuous medical practitioner progress reviews",
                  "Registered dietitian metabolic meal frameworks",
                  "Transparent monthly pricing with zero surprise bills",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#E9F1E8] text-[#104D38] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-[#242824]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <Link
                  href="/assessment?interest=weight-management"
                  className="px-9 py-4 rounded-full bg-[#104D38] hover:bg-[#175840] text-white font-bold text-base transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 text-center flex items-center justify-center gap-2 group"
                >
                  <span>Check Your Options</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="px-7 py-4 rounded-full bg-white hover:bg-gray-100 text-[#242824] font-semibold text-base transition-all border border-black/10 text-center"
                >
                  How It Works
                </Link>
              </div>

              <p className="text-xs text-[#6F7770] mt-4">
                Clinical suitability determined by licensed healthcare clinicians. Individual responses vary.
              </p>
            </div>

            {/* Right: Portrait Mosaic (Staggered Heights) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4 relative">
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden shadow-lg h-64 bg-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop"
                    alt="Patient lifestyle portrait"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-lg h-44 bg-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop"
                    alt="Nutritious food bowl"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="rounded-3xl overflow-hidden shadow-lg h-44 bg-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
                    alt="Wellness consultation"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-3xl overflow-hidden shadow-lg h-64 bg-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop"
                    alt="Active vitality lifestyle"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Floating trust badge */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-black/5 flex items-center gap-3 whitespace-nowrap">
                <div className="w-8 h-8 rounded-full bg-[#E9F1E8] text-[#104D38] flex items-center justify-center font-bold text-xs">
                  ★
                </div>
                <div>
                  <p className="text-xs font-bold text-[#242824]">98.4% Member Satisfaction</p>
                  <p className="text-[10px] text-[#6F7770]">Over 1,200+ patient reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WL04: Trust and Credibility Strip */}
      <div className="bg-[#104D38] text-white py-6">
        <div className="max-w-medvi mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-around gap-6 text-xs sm:text-sm font-semibold text-[#E9F1E8]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#779B7C]" />
              <span>100% Board-Certified Telehealth Clinicians</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#779B7C]" />
              <span>Evidence-Informed Clinical Protocols</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#779B7C]" />
              <span>Continuous Nutritional Guidance</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#779B7C]" />
              <span>Transparent Month-to-Month Memberships</span>
            </div>
          </div>
        </div>
      </div>

      {/* WL05: Program Cards Section */}
      <section className="py-20 sm:py-28 bg-[#F8F9F6] border-b border-black/5">
        <div className="max-w-medvi mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#779B7C] block mb-3">
              TAILORED CARE PLANS
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#242824] leading-tight mb-4">
              Explore Guided Weight Programs
            </h2>
            <p className="text-base sm:text-lg text-[#6F7770]">
              Every membership unites licensed medical provider evaluations, continuous care coordination, and registered dietitian guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {weightPrograms.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>
      </section>

      {/* WL08: Interactive Weight Selector */}
      <WeightSlider />

      {/* WL11: Statistics Section */}
      <section className="py-16 sm:py-24 bg-[#175840] text-white">
        <div className="max-w-medvi mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-widest uppercase text-[#779B7C] block mb-2">
              CLINICAL BENCHMARKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Evidence, Accountability & Care
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {metrics.map((m) => (
              <div key={m.id} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-4xl sm:text-5xl font-extrabold text-[#779B7C] block mb-2">
                  {m.value}
                </span>
                <h4 className="text-sm sm:text-base font-semibold text-white mb-1">
                  {m.label}
                </h4>
                {m.source && (
                  <p className="text-xs text-white/50">{m.source}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WL12: How It Works — 3-Step Journey */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-[#F8F9F6] border-b border-black/5">
        <div className="max-w-medvi mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#779B7C] block mb-3">
              YOUR JOURNEY
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#242824] mb-4">
              How the Care Process Works
            </h2>
            <p className="text-base sm:text-lg text-[#6F7770]">
              From digital intake to continuous clinical support in three transparent steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              {
                step: "01",
                icon: ClipboardCheck,
                title: "Tell Us About Your Goals",
                desc: "Complete a 2-minute non-clinical digital questionnaire detailing your health background, goals, and lifestyle.",
              },
              {
                step: "02",
                icon: Stethoscope,
                title: "Clinician Evaluation",
                desc: "A licensed healthcare provider evaluates your profile, discusses clinical options, and establishes your protocol.",
              },
              {
                step: "03",
                icon: Smile,
                title: "Ongoing Support & Check-Ins",
                desc: "Receive regular progress check-ins, dietitian meal guidance, and direct concierge messaging anytime.",
              },
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-4xl font-extrabold text-[#779B7C]/40">
                        {s.step}
                      </span>
                      <div className="w-12 h-12 rounded-2xl bg-[#E9F1E8] text-[#104D38] flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[#104D38]" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-[#242824] mb-3">
                      {s.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#6F7770] leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WL14: Testimonials */}
      <TestimonialsCarousel
        heading="Real stories from our weight care members."
        subheading="Verified member feedback from those enrolled in our physician-led metabolic programs."
        testimonials={testimonials}
      />

      {/* WL15: FAQ Accordion */}
      <FaqAccordion
        title="Weight Management FAQs"
        subtitle="Common questions regarding clinical criteria, consultations, and program delivery."
        faqs={faqs}
      />

      {/* WL16: Final Conversion Goal Selector */}
      <GoalSelector />

      {/* WL18: Legal Footer */}
      <Footer
        settings={settings}
        footerNav={footerNav.map((n) => ({ label: n.label, href: n.href }))}
      />
    </div>
  );
}
