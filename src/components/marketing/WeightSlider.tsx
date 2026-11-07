"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function WeightSlider() {
  const [unit, setUnit] = useState<"lbs" | "kg">("lbs");
  const [weightLbs, setWeightLbs] = useState(205);

  const displayWeight = unit === "lbs" ? weightLbs : Math.round(weightLbs * 0.453592);
  const minVal = unit === "lbs" ? 120 : 55;
  const maxVal = unit === "lbs" ? 350 : 160;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (unit === "lbs") {
      setWeightLbs(val);
    } else {
      setWeightLbs(Math.round(val / 0.453592));
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-[#F8F9F6] border-b border-black/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9F1E8] text-[#104D38] text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-4 h-4 text-[#779B7C]" />
          <span>INTERACTIVE ASSESSMENT TOOL</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#242824] mb-4">
          Where are you starting from?
        </h2>

        <p className="text-base sm:text-lg text-[#6F7770] max-w-xl mx-auto mb-10">
          Select your current weight to discover tailored clinical pathways and medical support options.
        </p>

        {/* Interactive Selector Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-md border border-black/5 max-w-2xl mx-auto">
          {/* Unit Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 bg-[#E9F1E8] rounded-full">
              <button
                type="button"
                onClick={() => setUnit("lbs")}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                  unit === "lbs"
                    ? "bg-[#104D38] text-white shadow-sm"
                    : "text-[#242824] hover:text-[#104D38]"
                }`}
              >
                Pounds (lbs)
              </button>
              <button
                type="button"
                onClick={() => setUnit("kg")}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                  unit === "kg"
                    ? "bg-[#104D38] text-white shadow-sm"
                    : "text-[#242824] hover:text-[#104D38]"
                }`}
              >
                Kilograms (kg)
              </button>
            </div>
          </div>

          {/* Large Number Display */}
          <div className="mb-8">
            <span className="text-6xl sm:text-7xl font-extrabold tracking-tight text-[#104D38]">
              {displayWeight}
            </span>
            <span className="text-2xl font-bold text-[#779B7C] ml-2 uppercase">
              {unit}
            </span>
          </div>

          {/* Slider */}
          <div className="space-y-4 max-w-md mx-auto mb-8">
            <input
              type="range"
              min={minVal}
              max={maxVal}
              value={displayWeight}
              onChange={handleSliderChange}
              className="w-full h-3 bg-[#E9F1E8] rounded-lg appearance-none cursor-pointer accent-[#104D38]"
            />
            <div className="flex justify-between text-xs text-[#6F7770] font-medium">
              <span>{minVal} {unit}</span>
              <span>{Math.round((minVal + maxVal) / 2)} {unit}</span>
              <span>{maxVal} {unit}</span>
            </div>
          </div>

          <div className="pt-6 border-t border-black/5">
            <Link
              href={`/assessment?interest=weight-management&weight=${displayWeight}${unit}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#104D38] hover:bg-[#175840] text-white font-semibold text-base transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              <span>See Programs for {displayWeight} {unit}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <p className="text-xs text-[#6F7770] mt-6 max-w-md mx-auto">
          Illustrative non-clinical tool. Weight management protocols and individual dosage are determined solely by independent licensed healthcare clinicians.
        </p>
      </div>
    </section>
  );
}
