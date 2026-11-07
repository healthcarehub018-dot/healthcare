import React from "react";
import Link from "next/link";
import { Check, ArrowRight, ShieldCheck } from "lucide-react";

export interface ProgramItem {
  id?: string;
  slug: string;
  title: string;
  description: string;
  priceDisplay?: string | null;
  priceNote?: string | null;
  currency?: string;
  image?: string | null;
  features?: string | string[] | null;
  availability?: string;
  ctaLabel?: string | null;
  ctaDestination?: string | null;
  featured?: boolean;
}

interface ProgramCardProps {
  program: ProgramItem;
}

export function ProgramCard({ program }: ProgramCardProps) {
  let parsedFeatures: string[] = [];
  if (Array.isArray(program.features)) {
    parsedFeatures = program.features;
  } else if (typeof program.features === "string") {
    try {
      parsedFeatures = JSON.parse(program.features);
    } catch {
      parsedFeatures = [program.features];
    }
  }

  const isAvailable = program.availability === "AVAILABLE" || !program.availability;
  const isWaitlist = program.availability === "WAITLIST";

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-black/5 flex flex-col justify-between group">
      <div>
        {/* Top Image */}
        {program.image && (
          <div className="relative h-56 w-full overflow-hidden bg-gray-100">
            <img
              src={program.image}
              alt={program.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 right-4">
              <span
                className={`text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm ${
                  isAvailable
                    ? "bg-[#104D38] text-white"
                    : isWaitlist
                    ? "bg-amber-100 text-amber-800"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {isAvailable ? "Available Now" : isWaitlist ? "Waitlist" : "Coming Soon"}
              </span>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-[#242824] mb-2 tracking-tight group-hover:text-[#104D38] transition-colors">
            {program.title}
          </h3>

          <p className="text-sm text-[#6F7770] leading-relaxed mb-6">
            {program.description}
          </p>

          {/* Price Display */}
          {program.priceDisplay && (
            <div className="mb-6 p-4 rounded-2xl bg-[#F8F9F6] border border-black/5">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#104D38]">
                  {program.priceDisplay}
                </span>
              </div>
              {program.priceNote && (
                <p className="text-xs text-[#6F7770] mt-1">{program.priceNote}</p>
              )}
            </div>
          )}

          {/* Features */}
          {parsedFeatures.length > 0 && (
            <div className="space-y-2.5 mb-8">
              {parsedFeatures.map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#E9F1E8] text-[#104D38] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm text-[#242824] font-medium leading-tight">
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0">
        <Link
          href={program.ctaDestination || `/assessment?program=${program.slug}`}
          className={`w-full py-3.5 px-6 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
            isAvailable
              ? "bg-[#104D38] hover:bg-[#175840] text-white hover:shadow-md hover:-translate-y-0.5"
              : "bg-gray-100 hover:bg-gray-200 text-[#242824]"
          }`}
        >
          <span>{program.ctaLabel || "Check Your Options"}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
