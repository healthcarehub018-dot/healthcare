import React from "react";
import { UserCheck, Laptop, FileText, Headphones } from "lucide-react";

interface BenefitItem {
  title: string;
  desc?: string;
}

interface BenefitStripProps {
  items?: BenefitItem[];
}

export function BenefitStrip({
  items = [
    {
      title: "Qualified Professional Guidance",
      desc: "Licensed healthcare clinicians dedicated to individualized patient evaluations.",
    },
    {
      title: "Convenient Online Experience",
      desc: "Telehealth consultations and follow-ups from the comfort and privacy of home.",
    },
    {
      title: "Clear Program Information",
      desc: "Transparent program details, pricing frameworks, and zero hidden clinic fees.",
    },
    {
      title: "Helpful Ongoing Support",
      desc: "Dedicated care concierge team ready to assist your journey at every milestone.",
    },
  ],
}: BenefitStripProps) {
  const icons = [UserCheck, Laptop, FileText, Headphones];

  return (
    <div className="bg-[#F8F9F6] pt-14 pb-12 border-b border-black/5">
      <div className="max-w-medvi mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div key={item.title} className="flex flex-col items-start space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E9F1E8] flex items-center justify-center text-[#104D38]">
                  <Icon className="w-6 h-6 text-[#104D38]" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-[#242824] leading-snug">
                    {item.title}
                  </h4>
                  {item.desc && (
                    <p className="text-sm text-[#6F7770] mt-1.5 leading-relaxed">
                      {item.desc}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
