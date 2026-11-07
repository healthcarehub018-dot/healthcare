"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
}

interface HomeHeaderProps {
  siteName?: string;
  navItems?: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
}

const DEFAULT_MENU: NavItem[] = [
  { label: "Weight Loss", href: "/weight-loss" },
  { label: "Women's Health", href: "/services/womens-wellness" },
  { label: "Metabolic Nutrition", href: "/services/nutrition-lifestyle" },
  { label: "Supplements", href: "/programs" },
  { label: "Men's Health", href: "/services/mens-wellness" },
  { label: "Peptides & Longevity", href: "/services/peptides-longevity" },
  { label: "Hair Regrowth", href: "/services/hair-wellness" },
  { label: "Skincare", href: "/services/skincare-aesthetics" },
  { label: "Care Coaching", href: "/how-it-works" },
  { label: "Our Doctors", href: "/about" },
  { label: "Testimonials", href: "/reviews" },
  { label: "Contact Support", href: "/contact" },
];

export function HomeHeader({
  siteName = "Suzzmed",
  navItems = DEFAULT_MENU,
  ctaLabel = "Start Free Assessment",
  ctaHref = "/assessment",
}: HomeHeaderProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-40 h-[60px]">
        <div className="mx-auto flex h-full max-w-[1120px] items-center justify-between px-6 lg:px-0">
          <Link
            href="/"
            className="text-[22px] font-bold leading-none tracking-[-0.04em] text-white transition-opacity hover:opacity-80"
            aria-label={`${siteName} home`}
          >
            {siteName}
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group flex h-[33px] w-[34px] flex-col items-center justify-center gap-[5px] text-white outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <span className="h-px w-[22px] bg-current transition-transform group-hover:translate-x-0.5" />
            <span className="h-px w-[22px] bg-current transition-transform group-hover:-translate-x-0.5" />
            <span className="h-px w-[22px] bg-current transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </header>

      {/* Menu overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-[1px] transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 right-0 z-[61] flex w-full max-w-[400px] flex-col bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
        aria-label="Main menu"
      >
        <div className="flex items-center justify-between px-8 pb-5 pt-6">
          <span className="text-[20px] font-bold tracking-[-0.04em] text-ink">
            {siteName}
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-8 pb-6">
          <ul className="border-t border-black/10">
            {navItems.map((item) => (
              <li key={`${item.label}-${item.href}`}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between border-b border-black/10 py-3.5 text-[17px] font-medium leading-snug text-ink transition-colors hover:text-accent"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight className="h-4 w-4 opacity-40" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-black/10 px-8 py-6">
          <Link
            href={ctaHref}
            onClick={() => setOpen(false)}
            className="cta-pill w-full bg-accent text-white"
          >
            {ctaLabel}
          </Link>
          <p className="mt-4 text-center text-[11px] leading-relaxed text-muted">
            Private, secure, and clinician-guided care.
          </p>
        </div>
      </aside>
    </>
  );
}
