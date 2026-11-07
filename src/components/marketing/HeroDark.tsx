import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface HeroDarkProps {
  eyebrow?: string;
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  services?: Array<{
    title: string;
    slug: string;
    image: string;
    category?: string;
  }>;
}

export function HeroDark({
  eyebrow = "CARE DESIGNED AROUND YOU",
  title = "Healthcare, made for real life.",
  body = "Explore convenient wellness programs, personalized guidance, and an easier way to connect with the care and support you need.",
  ctaLabel = "Explore Programs",
  ctaHref = "/programs",
  services = [
    {
      title: "Weight Management",
      slug: "weight-loss",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
      category: "Metabolic Health",
    },
    {
      title: "Peptides & Longevity",
      slug: "services/peptides-longevity",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop",
      category: "Cellular Care",
    },
    {
      title: "Men's Wellness",
      slug: "services/mens-wellness",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
      category: "Vitality Protocols",
    },
    {
      title: "Women's Wellness",
      slug: "services/womens-wellness",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
      category: "Hormonal Balance",
    },
  ],
}: HeroDarkProps) {
  // Highlight words like "real life." in sage
  const formattedTitle = title.includes("made for real life") ? (
    <>
      Healthcare, <br />
      <span className="text-[#779B7C]">made for real life.</span>
    </>
  ) : (
    title
  );

  return (
    <div className="relative bg-[#104D38] text-white pt-12 pb-24 md:pb-40 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-[#175840]/60 to-transparent pointer-events-none rounded-full blur-3xl" />

      {/* Hero Headline Content */}
      <div className="relative max-w-medvi mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-12 md:pb-16">
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-xs font-semibold tracking-widest text-[#E9F1E8] uppercase mb-6">
          {eyebrow}
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] max-w-4xl mx-auto mb-6">
          {formattedTitle}
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
          {body}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/assessment"
            className="px-8 py-4 rounded-full bg-[#779B7C] hover:bg-[#688A6D] text-white font-semibold text-base transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Start Free Assessment
          </Link>
          <Link
            href={ctaHref}
            className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-base transition-all backdrop-blur-sm"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>

      {/* Overlapping Service Cards Section */}
      <div className="relative max-w-medvi mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Grid: 4 Cards in a row */}
        <div className="hidden lg:grid grid-cols-4 gap-5 relative z-20">
          {services.map((item) => (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              className="group block rounded-3xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-black/5"
            >
              {/* Card Image Area (70% height) */}
              <div className="relative h-72 w-full overflow-hidden bg-[#E9F1E8]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Lower White Label Panel */}
              <div className="p-5 flex items-center justify-between bg-white text-[#242824]">
                <div>
                  {item.category && (
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-[#779B7C] block mb-0.5">
                      {item.category}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold tracking-tight text-[#242824] group-hover:text-[#104D38] transition-colors">
                    {item.title}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#E9F1E8] group-hover:bg-[#104D38] group-hover:text-white text-[#104D38] flex items-center justify-center transition-all shrink-0">
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Tablet Grid: 2x2 */}
        <div className="hidden sm:grid lg:hidden grid-cols-2 gap-4 relative z-20">
          {services.map((item) => (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              className="group flex flex-col rounded-2xl overflow-hidden bg-white shadow-lg text-[#242824]"
            >
              <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#779B7C] font-semibold block">{item.category}</span>
                  <h3 className="text-base font-semibold text-[#242824]">{item.title}</h3>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#E9F1E8] flex items-center justify-center text-[#104D38]">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile: Vertically Stacked Horizontal Cards (Prompt Section H02 explicitly specifies:
            "On mobile, use vertically stacked horizontal service cards.
             Each card: Image on left (100px-130px), category title in center, arrow on right. Keep labels readable.") */}
        <div className="sm:hidden flex flex-col space-y-3 relative z-20">
          {services.map((item) => (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              className="group flex items-center bg-white text-[#242824] rounded-2xl overflow-hidden shadow-md p-2.5 gap-3.5 border border-black/5 active:scale-[0.99] transition-transform"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#779B7C] block truncate">
                  {item.category || "Care"}
                </span>
                <h3 className="text-base font-bold text-[#242824] group-hover:text-[#104D38] truncate">
                  {item.title}
                </h3>
                <span className="text-xs text-[#6F7770] block mt-0.5">Explore Program</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#E9F1E8] flex items-center justify-center text-[#104D38] shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
