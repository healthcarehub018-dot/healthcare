import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface HeroServiceCard {
  title: string;
  href: string;
  image: string;
  tone: string;
}

interface HomeHeroProps {
  eyebrow?: React.ReactNode;
  title?: string;
  accent?: string;
  body?: string;
  services?: HeroServiceCard[];
  siteName?: string;
}

const FALLBACK_SERVICES: HeroServiceCard[] = [
  {
    title: "Weight Loss",
    href: "#weight-loss",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=900&auto=format&fit=crop",
    tone: "#DEEDE0",
  },
  {
    title: "Peptides & Longevity",
    href: "#peptides",
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=900&auto=format&fit=crop",
    tone: "#E4ECF2",
  },
  {
    title: "Men's Health",
    href: "#mens-health",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=900&auto=format&fit=crop",
    tone: "#F2EBE1",
  },
  {
    title: "Women's Health",
    href: "#womens-health",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=900&auto=format&fit=crop",
    tone: "#F2E6EC",
  },
];

function renderTitle(title: string, accent: string) {
  const [first, ...rest] = title.split(",");
  const secondLine = rest.join(",").trim();
  const marker = secondLine.indexOf(accent);

  return (
    <>
      <span className="block">{first.trim()},</span>
      <span className="block">
        {marker >= 0 ? (
          <>
            {secondLine.slice(0, marker)}
            <span className="text-[#84C390]">{accent}</span>
            {secondLine.slice(marker + accent.length)}
          </>
        ) : (
          secondLine
        )}
      </span>
    </>
  );
}

export function HomeHero({
  eyebrow = (
    <>
      Join <strong className="font-semibold">500,000+</strong> patients
    </>
  ),
  title = "Healthcare, reimagined for real life.",
  accent = "reimagined",
  body = "We provide medical care online—simple, direct, and led by licensed providers. No waiting rooms. No unnecessary steps. Just care that works.",
  services = FALLBACK_SERVICES,
  siteName = "Suzzmed",
}: HomeHeroProps) {
  const cards = services.length > 0 ? services.slice(0, 4) : FALLBACK_SERVICES;

  return (
    <section
      className="relative min-h-[824px] overflow-visible bg-[#1B6549] text-white md:min-h-[749px] lg:h-[524px] lg:min-h-0"
      style={{
        backgroundImage:
          "linear-gradient(166deg, rgb(27, 101, 73) 0%, rgb(17, 33, 17) 100%)",
      }}
    >
      {/* Watermark sits in its own clipped layer so the cards can overflow. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute bottom-[-0.12em] left-1/2 -translate-x-1/2 whitespace-nowrap text-[220px] font-extrabold leading-[0.75] tracking-[-0.07em] text-[#779D7C] opacity-[0.16] md:text-[300px] lg:text-[377px]">
          {siteName}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[820px] px-6 pt-20 text-center">
        <p className="eyebrow text-white/95">{eyebrow}</p>
        <h1 className="mt-5 text-[44px] font-semibold leading-[1.08] tracking-[-1.4px] text-white lg:text-[70px] lg:leading-[70px]">
          {renderTitle(title, accent)}
        </h1>
        <p className="mx-auto mt-5 max-w-[550px] text-[14px] leading-[25px] text-white/95 sm:text-[16px]">
          {body}
        </p>
      </div>

      {/* Service cards: 4-up floating panel on desktop, stacked rows below. */}
      <div className="relative z-20 mx-auto mt-12 w-full px-[15px] md:px-0 lg:absolute lg:bottom-[-83px] lg:left-1/2 lg:mt-0 lg:w-[918px] lg:-translate-x-1/2 lg:px-0">
        <div className="rounded-[25px] lg:bg-white lg:p-[13px] lg:shadow-[0_18px_45px_rgba(0,0,0,0.12)]">
          <div className="grid grid-cols-1 gap-[10px] md:grid-cols-1 lg:grid-cols-4">
            {cards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group flex overflow-hidden rounded-[20px] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-transform duration-300 hover:-translate-y-0.5 md:flex-row lg:block"
              >
                <div
                  className="relative h-[90px] w-[115px] shrink-0 overflow-hidden md:h-[90px] md:w-[245px] lg:h-[148px] lg:w-full"
                  style={{ backgroundColor: card.tone }}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="eager"
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-4 py-3 text-ink md:px-8 lg:h-[54px] lg:px-5 lg:py-0">
                  <span className="text-[15px] font-medium leading-[20px] md:text-[16px]">
                    {card.title}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
