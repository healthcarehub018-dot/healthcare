import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Reveal } from "./Reveal";

export interface FeaturePortrait {
  src: string;
  alt: string;
}

export interface FeatureCardItem {
  image: string;
  title: string;
  body: string;
}

export interface WideFeature {
  image: string;
  title: string;
  body: string;
  tone?: string;
}

export interface FeatureSectionProps {
  id: string;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  listTitle: string;
  benefits: string[];
  ctaLabel: string;
  ctaHref: string;
  accentColor: string;
  glowColor: string;
  visualImage: string;
  visualAlt: string;
  visualTone: string;
  portraits: [FeaturePortrait, FeaturePortrait];
  subheading: string;
  featureCards?: FeatureCardItem[];
  wideFeature?: WideFeature;
  footnote?: string;
  background?: string;
  bottomSpacing?: "default" | "compact";
}

function Highlight({
  text,
  accent,
  color,
}: {
  text: string;
  accent: string;
  color: string;
}) {
  if (!accent) return <>{text}</>;
  const index = text.toLowerCase().indexOf(accent.toLowerCase());
  if (index < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <span style={{ color }}>{text.slice(index, index + accent.length)}</span>
      {text.slice(index + accent.length)}
    </>
  );
}

export function FeatureSection({
  id,
  eyebrow,
  title,
  accent,
  body,
  listTitle,
  benefits,
  ctaLabel,
  ctaHref,
  accentColor,
  glowColor,
  visualImage,
  visualAlt,
  visualTone,
  portraits,
  subheading,
  featureCards,
  wideFeature,
  footnote,
  background = "#ffffff",
  bottomSpacing = "default",
}: FeatureSectionProps) {
  const bottomPadding =
    bottomSpacing === "compact" ? "lg:pb-[120px]" : "lg:pb-[150px]";
  return (
    <section
      id={id}
      className="relative overflow-hidden"
      style={{ backgroundColor: background, scrollMarginTop: "72px" }}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-[80px] h-[472px] w-[998px] -translate-x-1/2 rounded-full"
        style={{
          background: `radial-gradient(ellipse at center, ${glowColor} 0%, ${glowColor} 42%, rgba(255,255,255,0) 72%)`,
          opacity: 0.9,
        }}
        aria-hidden="true"
      />

      <div className={`relative mx-auto max-w-[1120px] px-6 pb-20 pt-20 lg:px-0 lg:pt-[120px] ${bottomPadding}`}>
        <div className="mx-auto grid max-w-[1060px] grid-cols-1 items-start gap-12 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-10">
          {/* Visual + checklist column (second on mobile, first on desktop) */}
          <Reveal className="order-2 lg:order-1 lg:pt-[115px]" as="div">
            <div
              className="relative h-[320px] w-full overflow-hidden rounded-[50px] lg:h-[335px]"
              style={{ backgroundColor: visualTone }}
            >
              <img
                src={visualImage}
                alt={visualAlt}
                loading="lazy"
                className="h-full w-full object-cover object-center"
              />
            </div>

            <h4 className="mt-10 text-[22px] font-semibold leading-[32px] tracking-[-0.44px] text-ink lg:mt-12">
              {listTitle}
            </h4>

            <ul className="mt-5 space-y-[13px]">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span
                    className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Check className="h-[11px] w-[11px]" strokeWidth={3} />
                  </span>
                  <span className="text-[14px] leading-[19.6px] text-ink">{benefit}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Copy + editorial image column */}
          <Reveal className="order-1 min-w-0 lg:order-2 lg:pt-[50px]" as="div">
            <p className="section-eyebrow">{eyebrow}</p>

            <h2 className="mt-2 max-w-[600px] text-[30px] font-semibold leading-[36px] tracking-[-0.6px] text-ink lg:text-[50px] lg:leading-[60px] lg:tracking-[-1px]">
              <Highlight text={title} accent={accent} color={accentColor} />
            </h2>

            <div className="-mx-6 mt-8 grid grid-cols-2 gap-4 sm:mx-auto sm:max-w-[490px] sm:gap-6 lg:mx-0 lg:mt-[30px] lg:max-w-none">
              {portraits.map((portrait, index) => (
                <div
                  key={`${portrait.src}-${index}`}
                  className="relative aspect-[306/452] overflow-hidden rounded-[20px] bg-black/5"
                >
                  <img
                    src={portrait.src}
                    alt={portrait.alt}
                    loading="lazy"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              ))}
            </div>

            <h3 className="mt-10 max-w-[560px] text-[24px] font-semibold leading-[30px] tracking-[-0.4px] text-ink lg:mt-[70px] lg:text-[30px] lg:leading-[36px] lg:tracking-[-0.6px]">
              {subheading}
            </h3>
            <p className="mt-4 max-w-[380px] text-[14px] leading-[22.4px] text-ink">
              {body}
            </p>

            <Link
              href={ctaHref}
              className="cta-pill mt-7"
              style={{ backgroundColor: accentColor }}
            >
              {ctaLabel}
            </Link>
          </Reveal>
        </div>

        {/* Paired feature cards */}
        {featureCards && featureCards.length > 0 && (
          <Reveal className="mx-auto mt-4 grid max-w-[1060px] grid-cols-1 gap-5 lg:mt-[70px] lg:grid-cols-2">
            {featureCards.slice(0, 2).map((card) => (
              <div
                key={card.title}
                className="flex flex-col overflow-hidden rounded-[20px] bg-[#FAF9F7] sm:flex-row"
              >
                <div className="h-[160px] w-full shrink-0 overflow-hidden bg-[#F2F0ED] sm:h-[160px] sm:w-[178px]">
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center p-5 sm:p-6">
                  <h4 className="text-[18px] font-semibold leading-[24px] tracking-[-0.2px] text-ink">
                    {card.title}
                  </h4>
                  <p className="mt-2 text-[14px] leading-[22.4px] text-ink/80">{card.body}</p>
                </div>
              </div>
            ))}
          </Reveal>
        )}

        {/* Wide editorial panel (used by the supplement story) */}
        {wideFeature && (
          <Reveal className="mx-auto mt-16 max-w-[1060px] overflow-hidden rounded-[50px] lg:mt-10">
            <div
              className="flex min-h-[260px] flex-col lg:h-[320px] lg:min-h-0 lg:flex-row"
              style={{ backgroundColor: wideFeature.tone || "#F9F5FC" }}
            >
              <div className="h-[260px] w-full overflow-hidden lg:h-full lg:w-[58%]">
                <img
                  src={wideFeature.image}
                  alt={wideFeature.title}
                  loading="lazy"
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center p-8 lg:p-12">
                <h4 className="text-[22px] font-semibold leading-[30px] tracking-[-0.3px] text-ink lg:text-[26px] lg:leading-[34px]">
                  {wideFeature.title}
                </h4>
                <p className="mt-3 max-w-[360px] text-[14px] leading-[22.4px] text-ink/80">
                  {wideFeature.body}
                </p>
              </div>
            </div>
          </Reveal>
        )}

        {footnote && (
          <p className="mx-auto mt-6 max-w-[1060px] text-center text-[12px] leading-[18px] text-[#545454]">
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}
