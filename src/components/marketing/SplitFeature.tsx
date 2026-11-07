import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

interface SplitFeatureProps {
  eyebrow?: string;
  title: string;
  body: string;
  image: string;
  imageAlt?: string;
  benefits?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  reverse?: boolean;
  backgroundVariant?: "cream" | "blush" | "sand" | "blue" | "white" | string;
  microBadges?: Array<{ title: string; subtitle?: string }>;
}

export function SplitFeature({
  eyebrow,
  title,
  body,
  image,
  imageAlt = "Healthcare Feature",
  benefits = [],
  ctaLabel = "Learn More",
  ctaHref = "/assessment",
  reverse = false,
  backgroundVariant = "cream",
  microBadges,
}: SplitFeatureProps) {
  const bgClasses: Record<string, string> = {
    cream: "bg-[#F8F9F6]",
    blush: "bg-[#F7EDF1]",
    sand: "bg-[#F5EDE6]",
    blue: "bg-[#EAF2F5]",
    white: "bg-white",
  };

  const bgClass = bgClasses[backgroundVariant] || "bg-[#F8F9F6]";

  return (
    <section className={`py-16 sm:py-24 ${bgClass} transition-colors overflow-hidden`}>
      <div className="max-w-medvi mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center ${
            reverse ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Image Column */}
          <div
            className={`lg:col-span-6 ${
              reverse ? "lg:order-2" : "lg:order-1"
            } relative`}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-xl bg-white aspect-[4/3] sm:aspect-[16/11]">
              <img
                src={image}
                alt={imageAlt}
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Micro badge cards (Supporting features like "Everything in One Place") */}
            {microBadges && microBadges.length > 0 && (
              <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-black/5 max-w-xs">
                <p className="text-xs uppercase tracking-wider font-bold text-[#779B7C]">
                  {microBadges[0].title}
                </p>
                {microBadges[0].subtitle && (
                  <p className="text-sm font-semibold text-[#242824] mt-0.5">
                    {microBadges[0].subtitle}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Text Column */}
          <div
            className={`lg:col-span-6 ${
              reverse ? "lg:order-1" : "lg:order-2"
            } flex flex-col items-start`}
          >
            {eyebrow && (
              <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#779B7C] mb-3 block">
                {eyebrow}
              </span>
            )}

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#242824] leading-[1.15] mb-5">
              {title}
            </h2>

            <p className="text-base sm:text-lg text-[#6F7770] leading-relaxed mb-8 max-w-xl">
              {body}
            </p>

            {benefits && benefits.length > 0 && (
              <div className="space-y-3 mb-9 w-full max-w-lg">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#E9F1E8] text-[#104D38] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span className="text-sm sm:text-base font-medium text-[#242824]">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {ctaLabel && (
              <Link
                href={ctaHref}
                className="px-8 py-4 rounded-full bg-[#104D38] hover:bg-[#175840] text-white font-semibold text-base transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 group"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
