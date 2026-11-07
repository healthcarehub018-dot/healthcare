import React from "react";
import {
  CircleDollarSign,
  MousePointer2,
  PackageOpen,
  Stethoscope,
} from "lucide-react";

const ITEMS = [
  { label: "Clear Pricing", Icon: CircleDollarSign },
  { label: "Shipped To Your Door", Icon: PackageOpen },
  { label: "Licensed Medical Providers", Icon: Stethoscope },
  { label: "100% Online", Icon: MousePointer2 },
];

function Group() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map(({ label, Icon }) => (
        <div
          key={label}
          className="flex items-center gap-4 border-r border-black/[0.08] px-7 sm:gap-5 sm:px-10"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-[9px] border-[1.5px] border-ink/80 text-ink">
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
          </span>
          <span className="eyebrow whitespace-nowrap text-ink">{label}</span>
        </div>
      ))}
    </div>
  );
}

export function TrustMarquee() {
  return (
    <section
      className="marquee-host relative z-10 flex h-[69px] items-center overflow-hidden border-b border-black/[0.04] bg-white lg:h-[149px]"
      aria-label="What is included with Suzzmed care"
    >
      <div className="flex w-max animate-marquee">
        <Group />
        <Group />
      </div>
    </section>
  );
}
