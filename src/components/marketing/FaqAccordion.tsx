"use client";

import React, { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
  category?: string | null;
}

interface FaqAccordionProps {
  title?: string;
  subtitle?: string;
  faqs?: FAQItem[];
  showCategoryFilters?: boolean;
}

export function FaqAccordion({
  title = "Frequently Asked Questions",
  subtitle = "Have questions about our telemedicine protocols, programs, or intake process? Find clear answers below.",
  faqs = [],
  showCategoryFilters = false,
}: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(faqs.map((f) => f.category || "General")))];

  const filteredFaqs =
    selectedCategory === "All"
      ? faqs
      : faqs.filter((f) => (f.category || "General") === selectedCategory);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 sm:py-28 bg-[#F8F9F6] border-b border-black/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E9F1E8] text-[#104D38] text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-4 h-4 text-[#779B7C]" />
            <span>CLINICAL TRANSPARENCY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#242824] leading-tight">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-[#6F7770] mt-3 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Category filters */}
        {showCategoryFilters && categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setOpenIndex(0);
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-[#104D38] text-white shadow-sm"
                    : "bg-white text-[#242824] hover:bg-gray-100 border border-black/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Accordion list */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question + idx}
                className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-5 px-6 sm:px-8 text-left flex items-center justify-between gap-4 font-semibold text-lg text-[#242824] hover:text-[#104D38] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="leading-snug">{faq.question}</span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                      isOpen
                        ? "bg-[#104D38] text-white"
                        : "bg-[#E9F1E8] text-[#104D38]"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-8 pb-6 pt-1 text-[#6F7770] text-base leading-relaxed border-t border-black/5">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
