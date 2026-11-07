import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, Mail, Phone, MapPin, Clock } from "lucide-react";

interface FooterProps {
  settings?: Record<string, string>;
  footerNav?: Array<{ label: string; href: string }>;
}

export function Footer({
  settings = {},
  footerNav = [],
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const siteName = settings.site_name || "Suzzmed Healthcare";
  const contactEmail = settings.contact_email || "care@suzzmed.local";
  const contactPhone = settings.contact_phone || "+1 (800) 492-SUZZ";
  const contactAddress = settings.contact_address || "500 Healthcare Way, Suite 400, Austin, TX 78701";
  const contactHours = settings.contact_hours || "Mon - Fri: 8am - 8pm EST";

  const programs = [
    { label: "Weight Management (GLP-1)", href: "/weight-loss" },
    { label: "Peptides & Longevity", href: "/services/peptides-longevity" },
    { label: "Men's Vitality", href: "/services/mens-wellness" },
    { label: "Women's Wellness", href: "/services/womens-wellness" },
    { label: "Metabolic Nutrition", href: "/services/nutrition-lifestyle" },
    { label: "Hair & Scalp Health", href: "/services/hair-wellness" },
  ];

  const quickLinks = [
    { label: "About Our Practice", href: "/about" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Patient Reviews", href: "/reviews" },
    { label: "Frequently Asked Questions", href: "/faq" },
    { label: "Start Assessment", href: "/assessment" },
    { label: "Contact Our Care Team", href: "/contact" },
  ];

  return (
    <footer className="bg-[#104D38] text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-medvi mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-white/15">
          {/* Column 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#779B7C] flex items-center justify-center text-white font-bold text-lg">
                S
              </div>
              <span className="font-semibold text-2xl tracking-tight text-white">{siteName}</span>
            </div>
            <p className="text-white/75 text-sm leading-relaxed">
              Care designed around you. Modern evidence-informed telemedicine connecting patients with dedicated clinicians, metabolic insights, and sustainable wellness protocols.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs text-[#E9F1E8]">
              <ShieldCheck className="w-4 h-4 text-[#779B7C]" />
              <span>Confidential & Physician-Supervised</span>
            </div>
          </div>

          {/* Column 2: Clinical Programs */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#779B7C] mb-4">
              Clinical Programs
            </h3>
            <ul className="space-y-2.5">
              {programs.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/75 hover:text-white text-sm transition-colors block py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Useful Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#779B7C] mb-4">
              Company & Process
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/75 hover:text-white text-sm transition-colors block py-0.5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Coordination */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#779B7C] mb-4">
              Care Coordination
            </h3>
            <div className="space-y-3 text-sm text-white/75">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#779B7C] mt-0.5 shrink-0" />
                <a href={`mailto:${contactEmail}`} className="hover:text-white transition-colors">
                  {contactEmail}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#779B7C] mt-0.5 shrink-0" />
                <span>{contactPhone}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#779B7C] mt-0.5 shrink-0" />
                <span>{contactAddress}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#779B7C] mt-0.5 shrink-0" />
                <span>{contactHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Medical & Regulatory Disclosure Section */}
        <div className="py-8 border-b border-white/10 text-xs text-white/60 leading-relaxed space-y-2">
          <p>
            <strong>Medical Disclaimer:</strong> The content provided on this website is for informational and educational purposes only and does not constitute medical advice, diagnosis, or clinical treatment. Program participation and any prescription medication are subject to clinical approval by an independent, state-licensed healthcare clinician following a comprehensive telehealth intake.
          </p>
          <p>
            Medications such as compounded semaglutide or tirzepatide are provided by state-licensed compounding pharmacies where clinically prescribed and permitted by state law. If you are experiencing a medical emergency, please call 911 immediately.
          </p>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div>
            © {currentYear} {siteName}. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <Link href="/medical-disclaimer" className="hover:text-white transition-colors">
              Medical Disclaimer
            </Link>
            <Link href="/admin/login" className="text-white/40 hover:text-white transition-colors">
              Clinician Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
