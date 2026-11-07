"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, Target, Apple, Activity, HelpCircle } from "lucide-react";

export function GoalSelector() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<string>("weight-management");

  const goals = [
    {
      id: "weight-management",
      title: "Weight Management",
      desc: "Physician-guided metabolic care, GLP-1 protocols, and lifestyle coaching.",
      icon: Target,
    },
    {
      id: "nutrition",
      title: "Nutrition Support",
      desc: "Practical meal frameworks, dietitian advice, and metabolic flexibility.",
      icon: Apple,
    },
    {
      id: "general-wellness",
      title: "General Wellness & Vitality",
      desc: "Energy optimization, hormonal balance, and preventative diagnostics.",
      icon: Activity,
    },
    {
      id: "not-sure",
      title: "Not Sure Yet",
      desc: "Help me explore available telehealth options based on my general goals.",
      icon: HelpCircle,
    },
  ];

  const handleContinue = () => {
    router.push(`/assessment?interest=${selectedGoal}`);
  };

  return (
    <section className="py-20 sm:py-28 bg-[#104D38] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#779B7C] block mb-3">
          PERSONALIZED DIRECTION
        </span>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
          What would you like to work toward?
        </h2>
        <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto mb-12">
          Select your primary priority to tailor your initial clinical intake and care team match.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto mb-10">
          {goals.map((goal) => {
            const isSelected = selectedGoal === goal.id;
            const Icon = goal.icon;
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => setSelectedGoal(goal.id)}
                className={`p-6 rounded-3xl transition-all duration-200 text-left border flex flex-col justify-between ${
                  isSelected
                    ? "bg-white text-[#242824] border-white shadow-xl scale-[1.02]"
                    : "bg-white/10 text-white border-white/10 hover:bg-white/15"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-4">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      isSelected
                        ? "bg-[#E9F1E8] text-[#104D38]"
                        : "bg-white/10 text-[#779B7C]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                      isSelected
                        ? "bg-[#104D38] border-[#104D38] text-white"
                        : "border-white/30 text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>

                <div>
                  <h3
                    className={`text-lg font-bold mb-1 ${
                      isSelected ? "text-[#242824]" : "text-white"
                    }`}
                  >
                    {goal.title}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isSelected ? "text-[#6F7770]" : "text-white/70"
                    }`}
                  >
                    {goal.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-[#779B7C] hover:bg-[#688A6D] text-white font-semibold text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <span>Continue to Assessment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
