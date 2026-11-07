import React from "react";
import { Star } from "lucide-react";
import { Reveal } from "./Reveal";

export interface MosaicTestimonial {
  name: string;
  quote: string;
  image?: string | null;
  rating?: number;
  serviceCategory?: string | null;
}

interface TestimonialMosaicProps {
  eyebrow?: string;
  heading?: string;
  accent?: string;
  subheading?: string;
  testimonials?: MosaicTestimonial[];
}

const FALLBACK: MosaicTestimonial[] = [
  {
    name: "Jamie",
    quote:
      "The process was straightforward and easy to navigate. I was able to ask questions and get clear answers from my care team without feeling rushed.",
    rating: 5,
  },
  {
    name: "Jacqueline",
    quote:
      "My experience has been very positive. I am doing well and slowly but surely reaching my goals with help from my clinician and coach.",
    rating: 5,
  },
  {
    name: "Greg",
    quote:
      "I was ready to give up before I found this program. The team helped me build habits I can actually keep, and I finally feel like myself again.",
    rating: 5,
  },
  {
    name: "Lou-Ann",
    quote:
      "The doctors and support staff have been professional and prompt with every question I've had. I feel in great hands and am closer to my goal.",
    rating: 5,
  },
  {
    name: "Marcus",
    quote:
      "My clinician took the time to explain my lab results instead of handing me a printout. That conversation changed how I think about my health.",
    rating: 5,
  },
  {
    name: "Elena",
    quote:
      "The personalized attention during my perimenopause transition gave me my energy and sleep back. Appointments were on time and genuinely empathetic.",
    rating: 5,
  },
  {
    name: "David",
    quote:
      "Clear pricing and simple delivery made staying consistent effortless. Having direct access to my dietitian keeps me accountable every week.",
    rating: 5,
  },
  {
    name: "Claire",
    quote:
      "I appreciated the honest assessment. Instead of over-promising, my clinician set practical benchmarks I could maintain with a demanding career.",
    rating: 5,
  },
];

const PORTRAITS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=700&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=700&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=700&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=700&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=700&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=700&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=700&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=700&auto=format&fit=crop",
];

function QuoteCard({
  item,
  tone,
}: {
  item: MosaicTestimonial;
  tone: "green" | "white";
}) {
  return (
    <article
      className={`flex h-[230px] w-[300px] shrink-0 flex-col justify-between rounded-[20px] p-6 sm:w-[400px] ${
        tone === "green" ? "bg-[#F1F5E9]" : "bg-[#FAFAFA]"
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-[14px] font-semibold leading-[20px] text-ink">{item.name}</h3>
          <div className="flex shrink-0 gap-0.5 text-[#2E936F]" aria-label={`${item.rating || 5} out of 5 stars`}>
            {Array.from({ length: item.rating || 5 }).map((_, index) => (
              <Star key={index} className="h-3 w-3 fill-current" />
            ))}
          </div>
        </div>
        <p className="mt-4 text-[14px] leading-[22.4px] text-ink">
          &ldquo;{item.quote}&rdquo;
        </p>
      </div>
    </article>
  );
}

function PhotoCard({ image, alt }: { image: string; alt: string }) {
  return (
    <div className="h-[230px] w-[300px] shrink-0 overflow-hidden rounded-[20px] bg-black/5 sm:w-[400px]">
      <img
        src={image}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
}

function Row({
  items,
  direction,
  tone,
}: {
  items: MosaicTestimonial[];
  direction: "left" | "right";
  tone: "green" | "white";
}) {
  const cards = items.map((item, index) => {
    const hasPhoto = index % 2 === 1;
    const image =
      PORTRAITS[(index + (direction === "right" ? 4 : 0)) % PORTRAITS.length];
    return hasPhoto ? (
      <PhotoCard key={`photo-${item.name}-${index}`} image={image} alt={`${item.name}, patient`} />
    ) : (
      <QuoteCard key={`quote-${item.name}-${index}`} item={item} tone={tone} />
    );
  });

  return (
    <div className={`flex w-max gap-5 pr-5 ${direction === "left" ? "animate-marquee-slow" : "animate-marquee-reverse"}`}>
      <div className="flex shrink-0 gap-5">{cards}</div>
      <div className="flex shrink-0 gap-5" aria-hidden="true">
        {cards}
      </div>
    </div>
  );
}

export function TestimonialMosaic({
  eyebrow = "THOSE WHO CHOSE SUZZMED",
  heading = "There's a reason people are raving about us.",
  accent = "raving about us.",
  subheading = "Join the multitude of people who have trusted Suzzmed to help change their lives through thoughtful, individualized care.",
  testimonials = FALLBACK,
}: TestimonialMosaicProps) {
  const pool = (testimonials.length > 0 ? testimonials : FALLBACK).filter(
    (item) => item && item.name && item.quote
  );
  const safe = pool.length >= 8 ? pool : [...pool, ...FALLBACK];
  const firstRow = safe.slice(0, 4);
  const secondRow = safe.slice(4, 8).length > 0 ? safe.slice(4, 8) : safe.slice(0, 4);

  const accentIndex = heading.toLowerCase().indexOf(accent.toLowerCase());

  return (
    <section className="marquee-host relative overflow-hidden bg-white pb-[90px] pt-[110px] lg:pt-[140px]">
      <div className="mx-auto max-w-[700px] px-6 text-center">
        <Reveal>
          <p className="section-eyebrow">{eyebrow}</p>
          <h2 className="mx-auto mt-3 max-w-[620px] text-[32px] font-semibold leading-[38px] tracking-[-0.6px] text-ink md:text-[42px] md:leading-[50px] lg:text-[50px] lg:leading-[60px] lg:tracking-[-1px]">
            {accentIndex >= 0 ? (
              <>
                {heading.slice(0, accentIndex)}
                <span className="text-accent">{heading.slice(accentIndex)}</span>
              </>
            ) : (
              heading
            )}
          </h2>
          <p className="mx-auto mt-4 max-w-[580px] text-[14px] leading-[22.4px] text-ink/85">
            {subheading}
          </p>
        </Reveal>
      </div>

      <Reveal className="mt-12 space-y-5 lg:mt-14">
        <Row items={firstRow} direction="left" tone="green" />
        <Row items={secondRow} direction="right" tone="white" />
      </Reveal>
    </section>
  );
}
