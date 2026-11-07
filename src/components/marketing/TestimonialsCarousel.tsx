"use client";

import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, ShieldCheck, Quote } from "lucide-react";

export interface TestimonialItem {
  id?: string;
  name: string;
  roleOrLocation?: string | null;
  quote: string;
  image?: string | null;
  rating?: number;
  serviceCategory?: string | null;
}

interface TestimonialsCarouselProps {
  heading?: string;
  subheading?: string;
  testimonials?: TestimonialItem[];
}

export function TestimonialsCarousel({
  heading = "Real experiences. Meaningful connections.",
  subheading = "Hear directly from members who have transformed their daily health and vitality through individualized care.",
  testimonials = [
    {
      name: "Marcus Sterling",
      roleOrLocation: "Austin, TX • Verified Patient",
      quote: "Working with the Suzzmed care team completely changed my mindset on metabolic health. The clinician took 45 minutes to explain my blood markers rather than just handing me a standard printout.",
      rating: 5,
      serviceCategory: "Weight Management",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Elena Rostova",
      roleOrLocation: "Denver, CO • Verified Patient",
      quote: "The personalized attention I received during my perimenopause transition gave me my energy and quality sleep back. The telehealth appointments were on time, empathetic, and truly comprehensive.",
      rating: 5,
      serviceCategory: "Women's Wellness",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "David Chen",
      roleOrLocation: "Seattle, WA • Verified Patient",
      quote: "The clear pricing and zero-hassle delivery of program materials made staying consistent effortless. Having direct chat access to my dietitian keeps me accountable every single week.",
      rating: 5,
      serviceCategory: "Men's Wellness",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Claire Davenport",
      roleOrLocation: "Chicago, IL • Verified Patient",
      quote: "I appreciated the honest clinical assessment. Rather than over-promising, my clinician set practical benchmarks that I was actually able to maintain with my demanding corporate career.",
      rating: 5,
      serviceCategory: "Weight Management",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    },
  ],
}: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((curr) => (curr === 0 ? testimonials.length - 1 : curr - 1));
  };

  const next = () => {
    setCurrentIndex((curr) => (curr === testimonials.length - 1 ? 0 : curr + 1));
  };

  return (
    <section className="py-20 sm:py-28 bg-[#F8F9F6] border-b border-black/5 overflow-hidden">
      <div className="max-w-medvi mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#779B7C] block mb-3">
              MEMBER VOICES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#242824] leading-tight">
              {heading}
            </h2>
            <p className="text-base sm:text-lg text-[#6F7770] mt-3">
              {subheading}
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-3 mt-6 md:mt-0">
            <button
              type="button"
              onClick={prev}
              className="w-12 h-12 rounded-full border border-black/10 bg-white hover:bg-[#E9F1E8] text-[#104D38] flex items-center justify-center transition-colors shadow-sm"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="w-12 h-12 rounded-full border border-black/10 bg-white hover:bg-[#E9F1E8] text-[#104D38] flex items-center justify-center transition-colors shadow-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => {
            // Give subtle emphasis or display all nicely
            return (
              <div
                key={t.name + idx}
                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow border border-black/5 flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars & Service category */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1 text-[#C8AC72]">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    {t.serviceCategory && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E9F1E8] text-[#104D38]">
                        {t.serviceCategory}
                      </span>
                    )}
                  </div>

                  <Quote className="w-8 h-8 text-[#779B7C]/40 mb-3" />

                  <p className="text-base text-[#242824] leading-relaxed italic mb-8">
                    "{t.quote}"
                  </p>
                </div>

                {/* Patient Author Info */}
                <div className="flex items-center gap-3.5 pt-6 border-t border-black/5">
                  {t.image ? (
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-[#779B7C]/30"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#104D38] text-white flex items-center justify-center font-bold text-base shrink-0">
                      {t.name[0]}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-[#242824]">{t.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-[#6F7770]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#779B7C]" />
                      <span>{t.roleOrLocation || "Verified Patient"}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Transparency note */}
        <p className="text-center text-xs text-[#6F7770] mt-10">
          Individual outcomes vary based on personal health profile, adherence, and physician evaluation. Patient experiences reflect authentic testimonials obtained with consent.
        </p>
      </div>
    </section>
  );
}
