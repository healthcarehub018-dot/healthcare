import React from "react";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { Star, ShieldCheck, Quote } from "lucide-react";
import { getSiteSettings, getTestimonials, getNavigation } from "@/lib/data";

export const revalidate = 0;

export default async function ReviewsPage() {
  const [settings, testimonials, headerNav, footerNav] = await Promise.all([
    getSiteSettings(),
    getTestimonials("all"),
    getNavigation("HEADER"),
    getNavigation("FOOTER"),
  ]);

  return (
    <div className="min-h-screen bg-[#F8F9F6] text-[#242824] flex flex-col font-sans">
      <Header
        navItems={headerNav.map((n) => ({ label: n.label, href: n.href }))}
        siteName={settings.site_name}
        transparentOnHero={false}
      />

      <div className="bg-[#104D38] text-white py-20 sm:py-28 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest uppercase text-[#779B7C] block mb-3">
            VERIFIED EXPERIENCES
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
            Real Stories, Real Connections.
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Read verified feedback from patients who have trusted our healthcare providers with their wellness and vitality journeys.
          </p>
        </div>
      </div>

      <section className="py-20 sm:py-28">
        <div className="max-w-medvi mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow border border-black/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
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

                  <Quote className="w-8 h-8 text-[#779B7C]/30 mb-3" />
                  <p className="text-base text-[#242824] leading-relaxed italic mb-8">
                    "{t.quote}"
                  </p>
                </div>

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
            ))}
          </div>

          <div className="mt-14 p-6 rounded-2xl bg-white border border-black/5 text-center max-w-2xl mx-auto text-xs text-[#6F7770]">
            All published reviews are gathered from consented members. To maintain medical privacy, patient surnames and identifiers may be shortened. Clinical outcomes vary by individual physiology and adherence.
          </div>
        </div>
      </section>

      <FinalCTA />
      <Footer settings={settings} footerNav={footerNav.map((n) => ({ label: n.label, href: n.href }))} />
    </div>
  );
}
