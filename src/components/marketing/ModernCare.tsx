import React from "react";
import Link from "next/link";
import { Sparkles, MessageSquareHeart, LineChart, ArrowRight } from "lucide-react";

interface ModernCareProps {
  eyebrow?: string;
  title?: string;
  body?: string;
  cards?: Array<{
    title: string;
    desc: string;
  }>;
}

export function ModernCare({
  eyebrow = "A BETTER EXPERIENCE",
  title = "Care and support designed around you.",
  body = "We have reimagined the healthcare journey from the ground up to eliminate waiting rooms, confusing bills, and rushed appointments.",
  cards = [
    {
      title: "Convenient Access",
      desc: "Connect with licensed healthcare clinicians directly through intuitive, private digital consultations.",
    },
    {
      title: "Personalized Communication",
      desc: "Direct care concierge messaging whenever questions arise, with prompt, thoughtful clinical answers.",
    },
    {
      title: "Helpful Progress Tools",
      desc: "Track your health metrics, weight evolution, and lifestyle milestones with transparent digital reports.",
    },
  ],
}: ModernCareProps) {
  const icons = [Sparkles, MessageSquareHeart, LineChart];

  return (
    <section className="py-20 sm:py-28 bg-[#175840] text-white">
      <div className="max-w-medvi mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#779B7C] block mb-3">
            {eyebrow}
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-6">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-white/80 leading-relaxed">
            {body}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={card.title}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:bg-white/15 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#779B7C] text-white flex items-center justify-center mb-6 shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-white/75 text-sm sm:text-base leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E9F1E8]">
                  <span>Member Benefit</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#779B7C] hover:bg-[#688A6D] text-white font-semibold text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <span>Experience Suzzmed Care</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
