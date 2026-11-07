import React from "react";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { getSiteSettings, getLegalPage, getNavigation } from "@/lib/data";
import { notFound } from "next/navigation";

export async function LegalPageLayout({ slug }: { slug: string }) {
  const [page, settings, headerNav, footerNav] = await Promise.all([
    getLegalPage(slug),
    getSiteSettings(),
    getNavigation("HEADER"),
    getNavigation("FOOTER"),
  ]);

  if (!page) {
    notFound();
  }

  // Format markdown headers and paragraphs simply
  const formattedParagraphs = page.body.split("\n\n").map((chunk, idx) => {
    if (chunk.startsWith("## ")) {
      return (
        <h2 key={idx} className="text-xl sm:text-2xl font-bold text-[#242824] mt-8 mb-3">
          {chunk.replace("## ", "")}
        </h2>
      );
    }
    if (chunk.startsWith("- ")) {
      const items = chunk.split("\n").map((line) => line.replace("- ", ""));
      return (
        <ul key={idx} className="list-disc pl-5 space-y-1.5 my-3 text-sm sm:text-base text-[#6F7770]">
          {items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={idx} className="text-sm sm:text-base text-[#6F7770] leading-relaxed my-3">
        {chunk}
      </p>
    );
  });

  return (
    <div className="min-h-screen bg-[#F8F9F6] text-[#242824] flex flex-col font-sans">
      <Header
        navItems={headerNav.map((n) => ({ label: n.label, href: n.href }))}
        siteName={settings.site_name}
        transparentOnHero={false}
      />

      <div className="bg-[#104D38] text-white py-16 sm:py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest uppercase text-[#779B7C] block mb-2">
            LEGAL & REGULATORY POLICIES
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-2">
            {page.title}
          </h1>
          <p className="text-xs text-white/60">
            Last updated: {new Date(page.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-black/5">
          {formattedParagraphs}
        </div>
      </div>

      <Footer settings={settings} footerNav={footerNav.map((n) => ({ label: n.label, href: n.href }))} />
    </div>
  );
}
