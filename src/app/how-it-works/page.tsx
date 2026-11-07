import React from "react";
import Link from "next/link";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import {
  ClipboardCheck,
  Stethoscope,
  Smile,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Package,
} from "lucide-react";
import { getSiteSettings, getNavigation } from "@/lib/data";

export const revalidate = 0;

export default async function HowItWorksPage() {
  const [settings, headerNav, footerNav] = await Promise.all([
    getSiteSettings(),
    getNavigation("HEADER"),
    getNavigation("FOOTER"),
  ]);

  const steps = [
    {
      num: "01",
      icon: ClipboardCheck,
      title: "Complete Your Health Intake",
      desc: "Begin with our secure online assessment. Share your goals, medical background, current lifestyle routines, and preferences in just 2 to 3 minutes.",
    },
    {
      num: "02",
      icon: Stethoscope,
      title: "Telehealth Physician Consultation",
      desc: "A licensed healthcare practitioner evaluates your health profile, answers all your questions, and determines if medical therapy is safe and appropriate for your body.",
    },
    {
      num: "03",
      icon: Package,
      title: "Discreet Delivery to Your Door",
      desc: "If prescribed, your medications and program materials are fulfilled by certified, licensed compounding pharmacies and delivered discreetly with temperature controls.",
    },
    {
      num: "04",
      icon: MessageSquare,
      title: "Ongoing Care & Nutrition Coaching",
      desc: "Enjoy direct, continuous access to your care team. Check in regularly, adjust dosages as needed, and receive registered dietitian meal strategies.",
    },
  ];

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
            THE CARE PATHWAY
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
            Simple, transparent healthcare.
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Discover how easy it is to connect with dedicated medical professionals, receive personalized care, and maintain continuous accountability.
          </p>
        </div>
      </div>

      <section className="py-20 sm:py-28">
        <div className="max-w-medvi mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isEven = idx % 2 === 1;
              return (
                <div
                  key={s.num}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className={`lg:col-span-4 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                    <div className="w-20 h-20 rounded-3xl bg-[#E9F1E8] text-[#104D38] flex items-center justify-center font-extrabold text-3xl mb-6 shadow-sm">
                      {s.num}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#242824] mb-3">
                      {s.title}
                    </h3>
                    <p className="text-base text-[#6F7770] leading-relaxed">
                      {s.desc}
                    </p>
                  </div>

                  <div className={`lg:col-span-8 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                    <div className="p-8 sm:p-12 rounded-3xl bg-white border border-black/5 shadow-sm">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-[#104D38] text-white flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs uppercase font-bold tracking-wider text-[#779B7C]">
                          Standard Quality Check
                        </span>
                      </div>
                      <p className="text-sm text-[#242824] font-medium leading-relaxed">
                        Every patient record is reviewed according to strict state medical guidelines. Telehealth appointments occur via encrypted video or secure clinical portals without public waiting rooms.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <FinalCTA />
      <Footer settings={settings} footerNav={footerNav.map((n) => ({ label: n.label, href: n.href }))} />
    </div>
  );
}
