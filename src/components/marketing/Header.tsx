"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, ShieldCheck } from "lucide-react";

interface HeaderProps {
  navItems?: Array<{ label: string; href: string; external?: boolean }>;
  siteName?: string;
  ctaLabel?: string;
  ctaHref?: string;
  promoBanner?: {
    active: boolean;
    text: string;
    link: string;
  };
  transparentOnHero?: boolean;
}

export function Header({
  navItems = [
    { label: "Home", href: "/" },
    { label: "Weight Loss", href: "/weight-loss" },
    { label: "Programs", href: "/programs" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Reviews", href: "/reviews" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  siteName = "Suzzmed",
  ctaLabel = "Get Started",
  ctaHref = "/assessment",
  promoBanner,
  transparentOnHero = true,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isDarkHeroPage = pathname === "/" && transparentOnHero;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const isLightText = isDarkHeroPage && !isScrolled;

  return (
    <>
      {/* Optional Promotional Bar */}
      {promoBanner?.active && promoBanner.text && (
        <div className="bg-[#175840] text-[#E9F1E8] text-xs sm:text-sm py-2 px-4 text-center font-medium transition-all relative z-50">
          <Link
            href={promoBanner.link || "/weight-loss"}
            className="hover:underline flex items-center justify-center gap-2 group"
          >
            <span>{promoBanner.text}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      )}

      {/* Main Navigation Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#104D38]/95 backdrop-blur-md shadow-sm py-3 text-white"
            : isDarkHeroPage
            ? "bg-transparent py-5 text-white"
            : "bg-white/95 backdrop-blur-md border-b border-gray-100 py-4 text-[#242824]"
        }`}
      >
        <div className="max-w-medvi mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-[#779B7C] flex items-center justify-center text-white font-bold text-lg tracking-wider transition-transform group-hover:scale-105 shadow-sm">
              S
            </div>
            <span
              className={`font-semibold tracking-tight text-xl ${
                isLightText || isScrolled ? "text-white" : "text-[#104D38]"
              }`}
            >
              {siteName}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isLightText || isScrolled
                      ? isActive
                        ? "bg-white/20 text-white"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                      : isActive
                      ? "bg-[#104D38] text-white"
                      : "text-[#242824] hover:text-[#104D38] hover:bg-[#E9F1E8]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href={ctaHref}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm flex items-center gap-2 ${
                isLightText || isScrolled
                  ? "bg-[#779B7C] text-white hover:bg-[#688A6D] hover:shadow-md"
                  : "bg-[#104D38] text-white hover:bg-[#175840] hover:shadow-md"
              }`}
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl transition-colors ${
              isLightText || isScrolled
                ? "text-white hover:bg-white/10"
                : "text-[#242824] hover:bg-gray-100"
            }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#104D38] text-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#779B7C] flex items-center justify-center font-bold text-white text-base">
                    S
                  </div>
                  <span className="font-semibold text-lg text-white">{siteName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-white/20 text-white font-semibold"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-3">
              <Link
                href={ctaHref}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 px-4 rounded-full bg-[#779B7C] hover:bg-[#688A6D] text-white font-semibold text-center flex items-center justify-center gap-2 shadow-lg"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center justify-center gap-1.5 text-xs text-white/60 pt-2">
                <ShieldCheck className="w-4 h-4 text-[#779B7C]" />
                <span>Confidential Healthcare Inquiry</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
