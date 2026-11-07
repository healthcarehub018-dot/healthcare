import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal } from "./Reveal";

interface CareCoachingProps {
  eyebrow?: string;
  title?: string;
  accent?: string;
  body?: string;
  image?: string;
  ctaLabel?: string;
  ctaHref?: string;
  statement?: string;
  statementAccent?: string;
}

export function CareCoaching({
  eyebrow = "BETTER IS POSSIBLE—AND WE BUILT FOR IT.",
  title = "Modern healthcare, built around you",
  accent = "built around you",
  body = "Our care coaching team, led by certified medical assistants and registered dietitians, helps answer questions about your medication, program, and day-to-day lifestyle changes—so your care feels personal from day one.",
  image = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop",
  ctaLabel = "See How Care Works",
  ctaHref = "/how-it-works",
  statement = "We're creating a better healthcare experience, and the details matter.",
  statementAccent = "We're here for those details.",
}: CareCoachingProps) {
  const index = title.toLowerCase().indexOf(accent.toLowerCase());

  return (
    <section id="care-coaching" className="relative overflow-hidden bg-white pb-[110px] pt-[120px] lg:pt-[150px]">
      <div className="mx-auto max-w-[1120px] px-6 lg:px-0">
        <Reveal className="mx-auto max-w-[760px] text-center">
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="mt-3 text-[30px] font-semibold leading-[36px] tracking-[-0.6px] text-ink lg:text-[50px] lg:leading-[60px] lg:tracking-[-1px]">
            {index >= 0 ? (
              <>
                {title.slice(0, index)}
                <span className="text-accent">{title.slice(index)}</span>
              </>
            ) : (
              title
            )}
          </h2>
        </Reveal>

        <Reveal className="relative mx-auto mt-14 max-w-[1060px] lg:mt-16">
          <div className="grid overflow-hidden rounded-[40px] bg-[#FAF9F7] lg:grid-cols-[530px_minmax(0,1fr)] lg:rounded-[50px]">
            <div className="h-[240px] w-full overflow-hidden lg:h-[600px]">
              <img
                src={image}
                alt="A care coach speaking with a patient"
                loading="lazy"
                className="h-full w-full object-cover object-center"
              />
            </div>

            <div className="flex flex-col justify-center p-8 lg:p-[60px]">
              <h3 className="max-w-[420px] text-[24px] font-semibold leading-[30px] tracking-[-0.4px] text-ink lg:text-[34px] lg:leading-[42px]">
                Care coaching and nutrition support
              </h3>
              <p className="mt-5 max-w-[420px] text-[14px] leading-[22.4px] text-ink/85">
                {body}
              </p>
              <Link
                href={ctaHref}
                className="mt-8 inline-flex w-fit items-center gap-2 text-[14px] font-semibold text-accent transition-colors hover:text-ink"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Rotating seal, matching the reference's circular stamp. */}
          <div className="absolute -top-12 right-5 flex h-[150px] w-[150px] items-center justify-center rounded-full bg-white/95 shadow-[0_10px_35px_rgba(0,0,0,0.08)] lg:-right-7 lg:h-[170px] lg:w-[170px]">
            <svg viewBox="0 0 170 170" className="absolute inset-0 h-full w-full animate-slow-spin" aria-hidden="true">
              <defs>
                <path
                  id="care-seal-path"
                  d="M85,85 m-62,0 a62,62 0 1,1 124,0 a62,62 0 1,1 -124,0"
                />
              </defs>
              <text fill="#C8AC72" fontSize="9.5" fontWeight="600" letterSpacing="2.4">
                <textPath href="#care-seal-path" startOffset="0%">
                  WITH YOU FROM START TO SUCCESS · SUZZMED CARE ·
                </textPath>
              </text>
            </svg>
            <Sparkles className="h-8 w-8 text-[#C8AC72]" strokeWidth={1.4} />
          </div>
        </Reveal>

        <Reveal className="mx-auto mt-16 max-w-[900px] text-center lg:mt-20">
          <p className="text-[16px] font-semibold leading-[24px] text-ink lg:text-[18px]">
            {statement}
            <br />
            <span className="text-accent">{statementAccent}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
