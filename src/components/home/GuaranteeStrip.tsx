import React from "react";
import {
  BadgeCheck,
  CircleDollarSign,
  Stethoscope,
  Truck,
} from "lucide-react";

const ITEMS = [
  { label: "Suzzmed guarantee", Icon: BadgeCheck },
  { label: "Free, expedited delivery", Icon: Truck },
  { label: "Doctor-led plans & coaching", Icon: Stethoscope },
  { label: "No hidden fees", Icon: CircleDollarSign },
];

export function GuaranteeStrip() {
  return (
    <section
      className="border-y border-black/[0.08] bg-white"
      aria-label="Suzzmed care guarantees"
    >
      <div className="grid w-full grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ label, Icon }, index) => (
          <div
            key={label}
            className={`flex min-h-[100px] items-center gap-4 px-6 py-6 sm:px-8 lg:px-10 lg:py-0 ${
              index % 2 === 1 ? "border-l border-black/[0.08]" : ""
            } ${index > 1 ? "border-t border-black/[0.08] lg:border-t-0" : ""} ${
              index > 0 ? "lg:border-l lg:border-black/[0.08]" : ""
            }`}
          >
            <Icon
              className="h-[25px] w-[25px] shrink-0 text-ink"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span className="text-[12px] font-semibold leading-[18px] text-ink">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
