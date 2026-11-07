import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock } from "lucide-react";

interface FinalCTAProps {
  title?: string;
  body?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  variant?: "dark" | "cream";
}

export function FinalCTA({
  title = "Your next step toward better wellness starts here.",
  body = "Complete our brief non-clinical questionnaire to discover personalized medical care and wellness programs designed around you.",
  primaryCtaLabel = "Start Assessment",
  primaryCtaHref = "/assessment",
  secondaryCtaLabel = "Explore All Programs",
  secondaryCtaHref = "/programs",
  variant = "dark",
}: FinalCTAProps) {
  const isDark = variant === "dark";

  return (
    <section
      className={`py-20 sm:py-28 relative overflow-hidden ${
        isDark ? "bg-[#104D38] text-white" : "bg-[#F8F9F6] text-[#242824]"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-[#E9F1E8] text-xs font-semibold uppercase tracking-wider mb-6">
          <Clock className="w-4 h-4 text-[#779B7C]" />
          <span>Quick 2-Minute Intake</span>
        </div>

        <h2
          className={`text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1] ${
            isDark ? "text-white" : "text-[#242824]"
          }`}
        >
          {title}
        </h2>

        <p
          className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${
            isDark ? "text-white/80" : "text-[#6F7770]"
          }`}
        >
          {body}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={primaryCtaHref}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#779B7C] hover:bg-[#688A6D] text-white font-semibold text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
          >
            <span>{primaryCtaLabel}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href={secondaryCtaHref}
            className={`w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-base transition-all ${
              isDark
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-white hover:bg-gray-100 text-[#242824] border border-black/10"
            }`}
          >
            {secondaryCtaLabel}
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-white/60">
          <ShieldCheck className="w-4 h-4 text-[#779B7C]" />
          <span>Private & Secure • No Initial Obligation • Board-Certified Clinicians</span>
        </div>
      </div>
    </section>
  );
}
