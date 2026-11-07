import React from "react";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeHero, type HeroServiceCard } from "@/components/home/HomeHero";
import { TrustMarquee } from "@/components/home/TrustMarquee";
import { FeatureSection } from "@/components/home/FeatureSection";
import { CareCoaching } from "@/components/home/CareCoaching";
import { TestimonialMosaic } from "@/components/home/TestimonialMosaic";
import { GuaranteeStrip } from "@/components/home/GuaranteeStrip";
import { HomeFooter } from "@/components/home/HomeFooter";
import {
  getSiteSettings,
  getServices,
  getContentSections,
  getTestimonials,
} from "@/lib/data";

export const revalidate = 0; // Dynamic server rendering to reflect CMS edits immediately

const IMAGES = {
  weightVisual:
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1000&auto=format&fit=crop",
  weightPortraitA:
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=900&auto=format&fit=crop",
  weightPortraitB:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=900&auto=format&fit=crop",
  weightCardA:
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=700&auto=format&fit=crop",
  weightCardB:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=700&auto=format&fit=crop",

  womenVisual:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop",
  womenPortraitA:
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=900&auto=format&fit=crop",
  womenPortraitB:
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=900&auto=format&fit=crop",

  nutritionVisual:
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop",
  nutritionPortraitA:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=900&auto=format&fit=crop",
  nutritionPortraitB:
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=900&auto=format&fit=crop",

  supplementsVisual:
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1000&auto=format&fit=crop",
  supplementsPortraitA:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=900&auto=format&fit=crop",
  supplementsPortraitB:
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=900&auto=format&fit=crop",
  supplementsWide:
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1200&auto=format&fit=crop",

  mensVisual:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
  mensPortraitA:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=900&auto=format&fit=crop",
  mensPortraitB:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=900&auto=format&fit=crop",

  peptidesVisual:
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop",
  peptidesPortraitA:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=900&auto=format&fit=crop",
  peptidesPortraitB:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=900&auto=format&fit=crop",

  hairVisual:
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop",
  hairPortraitA:
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=900&auto=format&fit=crop",
  hairPortraitB:
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=900&auto=format&fit=crop",

  skinVisual:
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop",
  skinPortraitA:
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=900&auto=format&fit=crop",
  skinPortraitB:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=900&auto=format&fit=crop",

  careCoaching:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop",
} as const;

const SERVICE_TONES = ["#DEEDE0", "#E4ECF2", "#F2EBE1", "#F2E6EC"];

const SERVICE_NAMES: Record<string, string> = {
  "weight-management": "Weight Loss",
  "peptides-longevity": "Peptides & Longevity",
  "mens-wellness": "Men's Health",
  "womens-wellness": "Women's Health",
  "nutrition-lifestyle": "Metabolic Nutrition",
  "hair-wellness": "Hair Regrowth",
  "skincare-aesthetics": "Skincare",
};

function parseItems(value?: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [settings, services, { map: sections }, testimonials] = await Promise.all([
    getSiteSettings(),
    getServices(true),
    getContentSections("home"),
    getTestimonials("home"),
  ]);

  const siteName = settings.site_name || "Suzzmed Healthcare";
  const brand = "Suzzmed";

  const heroServices: HeroServiceCard[] = services.slice(0, 4).map((service, index) => ({
    title: SERVICE_NAMES[service.slug] || service.title,
    href: service.slug === "weight-management" ? "/weight-loss" : `/services/${service.slug}`,
    image: service.heroImage || IMAGES.weightVisual,
    tone: SERVICE_TONES[index] || SERVICE_TONES[0],
  }));

  const weightBenefits =
    parseItems(sections.weight_feature?.items).length > 0
      ? parseItems(sections.weight_feature?.items)
      : [
          "Clinician-guided care plan",
          "1:1 provider guidance",
          "Registered dietitian support",
          "24/7 care team messaging",
          "Fast & discreet shipping",
        ];

  const womenBenefits =
    parseItems(sections.womens_wellness?.items).length > 0
      ? parseItems(sections.womens_wellness?.items)
      : [
          "Hormone balance",
          "Healthy weight management",
          "Hair strength & growth support",
          "Skin health & radiance",
          "Fast & discreet shipping",
        ];

  const nutritionBenefits =
    parseItems(sections.nutrition_feature?.items).length > 0
      ? parseItems(sections.nutrition_feature?.items)
      : [
          "Balanced meal frameworks",
          "Weekly rotating meal ideas",
          "Nutritionally balanced options",
          "Macro-friendly choices",
          "Completely hassle-free",
        ];

  const mensBenefits =
    parseItems(sections.mens_wellness?.items).length > 0
      ? parseItems(sections.mens_wellness?.items)
      : [
          "Physical performance",
          "Hormone balance",
          "Energy levels",
          "Mental focus",
          "Fast & discreet shipping",
        ];

  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <HomeHeader
        siteName={brand}
        ctaLabel={settings.header_cta_label || "Start Free Assessment"}
        ctaHref={settings.header_cta_link || "/assessment"}
      />

      <main>
        {/* Hero + floating service cards */}
        <HomeHero
          eyebrow={
            <>
              Join <strong className="font-semibold">thousands of</strong> Suzzmed patients
            </>
          }
          title="Healthcare, reimagined for real life."
          accent="reimagined"
          body="We connect you with licensed providers online—simple, direct, and built for real life. No waiting rooms. No unnecessary steps. Just care that works."
          services={heroServices}
          siteName={brand}
        />

        <TrustMarquee />

        {/* Weight care */}
        <FeatureSection
          id="weight-loss"
          eyebrow="DOCTOR-GUIDED WEIGHT CARE"
          title="Weight loss made easier with personalized care"
          accent="made easier"
          body={
            sections.weight_feature?.body ||
            "Find the right weight care plan with the confidence that comes from knowing it is clinician-guided and built around your budget."
          }
          listTitle="Everything you need—included:"
          benefits={weightBenefits}
          ctaLabel="Get Started"
          ctaHref={sections.weight_feature?.ctaHref || "/weight-loss"}
          accentColor="#2E936F"
          glowColor="#D6F2DA"
          visualImage={IMAGES.weightVisual}
          visualAlt="Prescription weight care materials on a soft green surface"
          visualTone="#DEEDE0"
          portraits={[
            {
              src: IMAGES.weightPortraitA,
              alt: "A patient smiling during a wellness check-in",
            },
            {
              src: IMAGES.weightPortraitB,
              alt: "A clinician reviewing a care plan with a patient",
            },
          ]}
          subheading="A smarter approach to weight care, built around you"
          featureCards={[
            {
              image: IMAGES.weightCardA,
              title: "Everything, all in one place",
              body: "Track your progress, check in with your provider, and manage your care in your all-in-one patient portal.",
            },
            {
              image: IMAGES.weightCardB,
              title: "Unlimited 24/7 support",
              body: "Medical support continues throughout your care, whenever you need it.",
            },
          ]}
          footnote="Prescriptions are issued only after an online consultation with an independent licensed provider. Compounded medications are dispensed by state-licensed pharmacies but are not FDA approved. *Free support is subject to eligibility and any applicable copays."
          bottomSpacing="compact"
        />

        {/* Women's health */}
        <FeatureSection
          id="womens-health"
          eyebrow="CARE DESIGNED FOR WOMEN'S HEALTH"
          title="Whole-body care for her balance, vitality, and confidence"
          accent="care for her"
          body={
            sections.womens_wellness?.body ||
            "Clinician-guided care for weight, hormones, hair, and skin, with personalized plans designed to support your health through every stage of life."
          }
          listTitle="Benefits that support every stage"
          benefits={womenBenefits}
          ctaLabel={sections.womens_wellness?.ctaLabel || "Coming Soon"}
          ctaHref={sections.womens_wellness?.ctaHref || "/services/womens-wellness"}
          accentColor="#D690B3"
          glowColor="#FFE8F4"
          visualImage={IMAGES.womenVisual}
          visualAlt="A woman smiling in soft natural light"
          visualTone="#F2E6EC"
          portraits={[
            {
              src: IMAGES.womenPortraitA,
              alt: "A woman enjoying an outdoor walk",
            },
            {
              src: IMAGES.womenPortraitB,
              alt: "A woman smiling with her hands behind her head",
            },
          ]}
          subheading="Support that evolves with your body"
        />

        {/* Metabolic nutrition */}
        <FeatureSection
          id="nutrition"
          eyebrow="METABOLIC NUTRITION"
          title="Fuel your transformation, protect your progress"
          accent="Fuel"
          body={
            sections.nutrition_feature?.body ||
            "Suzzmed nutrition support pairs balanced, medically aligned guidance with practical meal frameworks—designed to help you build sustainable habits while protecting your progress."
          }
          listTitle="Meal prep made simple"
          benefits={nutritionBenefits}
          ctaLabel={sections.nutrition_feature?.ctaLabel || "Get Started"}
          ctaHref={sections.nutrition_feature?.ctaHref || "/services/nutrition-lifestyle"}
          accentColor="#EB8771"
          glowColor="#F5E9E4"
          visualImage={IMAGES.nutritionVisual}
          visualAlt="A balanced bowl of roasted vegetables and grains"
          visualTone="#F5E9E4"
          portraits={[
            {
              src: IMAGES.nutritionPortraitA,
              alt: "A woman holding a bowl of fresh food",
            },
            {
              src: IMAGES.nutritionPortraitB,
              alt: "A colorful, nutritionally balanced meal",
            },
          ]}
          subheading="Skip the hassle of meal planning and prepping"
        />

        {/* Supplements */}
        <FeatureSection
          id="supplements"
          eyebrow="PURPOSE-DRIVEN SUPPLEMENTATION"
          title="Supplements with the power to boost real results"
          accent="power to boost"
          body="Clinician-designed formulas made with quality ingredients and evidence-informed dosing to support your body day after day."
          listTitle="What better support looks like"
          benefits={[
            "Clean, transparent ingredients",
            "Built to support daily health",
            "Evidence-based dosing",
            "Clinician-formulated blends",
            "High-quality sourcing",
          ]}
          ctaLabel="Coming Soon"
          ctaHref="/programs"
          accentColor="#956BAD"
          glowColor="#EDDFF5"
          visualImage={IMAGES.supplementsVisual}
          visualAlt="Daily supplement containers arranged on a lilac surface"
          visualTone="#EDDFF5"
          portraits={[
            {
              src: IMAGES.supplementsPortraitA,
              alt: "A woman drinking a wellness smoothie",
            },
            {
              src: IMAGES.supplementsPortraitB,
              alt: "A woman smiling in a light athletic top",
            },
          ]}
          subheading="Support that helps you feel better over time"
          wideFeature={{
            image: IMAGES.supplementsWide,
            title: "Clinician-formulated blends designed to support how your body works best.",
            body: "Doctor-designed formulas made with quality ingredients and evidence-informed dosing.",
            tone: "#F9F5FC",
          }}
          bottomSpacing="compact"
        />

        {/* Men's health */}
        <FeatureSection
          id="mens-health"
          eyebrow="CARE FOR ENERGY, HORMONES, AND PERFORMANCE"
          title="Men's healthcare, built for men who expect more"
          accent="expect more"
          body={
            sections.mens_wellness?.body ||
            "Clinician-guided care for hormones, energy, and performance, with treatment plans tailored to your goals and adjusted as your body responds."
          }
          listTitle="Benefits that make a difference"
          benefits={mensBenefits}
          ctaLabel={sections.mens_wellness?.ctaLabel || "Get Started"}
          ctaHref={sections.mens_wellness?.ctaHref || "/services/mens-wellness"}
          accentColor="#A58979"
          glowColor="#E8E0DC"
          visualImage={IMAGES.mensVisual}
          visualAlt="A man smiling confidently in natural light"
          visualTone="#F2EBE1"
          portraits={[
            {
              src: IMAGES.mensPortraitA,
              alt: "A man smiling in a neutral sweater",
            },
            {
              src: IMAGES.mensPortraitB,
              alt: "A man smiling while getting ready for the day",
            },
          ]}
          subheading="Care designed to help you feel stronger, sharper, and more in control"
        />

        {/* Peptides & longevity */}
        <FeatureSection
          id="peptides"
          eyebrow="ADVANCED PEPTIDE SUPPORT"
          title="Targeted support for recovery, performance, and longevity"
          accent="Targeted support"
          body={
            sections.peptides_longevity?.body ||
            "Peptide therapy is designed to support how your body recovers, performs, and repairs over time—with targeted options for goals like recovery, strength, sleep, and overall optimization."
          }
          listTitle="Unlock what your body can do"
          benefits={[]}
          ctaLabel={sections.peptides_longevity?.ctaLabel || "Coming Soon"}
          ctaHref={sections.peptides_longevity?.ctaHref || "/services/peptides-longevity"}
          accentColor="#7AA5C9"
          glowColor="#EBF6FF"
          visualImage={IMAGES.peptidesVisual}
          visualAlt="A clean supplement container in a bright clinical setting"
          visualTone="#EBF6FF"
          portraits={[
            {
              src: IMAGES.peptidesPortraitA,
              alt: "A man preparing for a workout",
            },
            {
              src: IMAGES.peptidesPortraitB,
              alt: "A woman listening to music before a run",
            },
          ]}
          subheading="Support that works below the surface"
        />

        {/* Hair regrowth */}
        <FeatureSection
          id="hair"
          eyebrow="TARGETED HAIR RESTORATION"
          title="Proven care for thinning hair and regrowth"
          accent="Proven care"
          body="Revitalize your roots and restore fuller-looking hair with our hair regrowth serum, formulated to nourish the scalp and support visibly thicker, healthier strands."
          listTitle="Personalized support for lasting hair results"
          benefits={[
            "Clinically backed regrowth ingredients",
            "Targeted scalp and follicle support",
            "Long-term hair density approach",
            "Fast shipping",
          ]}
          ctaLabel="Coming Soon"
          ctaHref="/services/hair-wellness"
          accentColor="#C6A673"
          glowColor="#EFE8DC"
          visualImage={IMAGES.hairVisual}
          visualAlt="A woman with healthy, voluminous hair"
          visualTone="#F0EBE3"
          portraits={[
            {
              src: IMAGES.hairPortraitA,
              alt: "A woman with long, healthy hair",
            },
            {
              src: IMAGES.hairPortraitB,
              alt: "A woman smiling with soft, natural curls",
            },
          ]}
          subheading="Advanced hair regrowth care to help you look and feel your best"
        />

        {/* Skincare */}
        <FeatureSection
          id="skincare"
          eyebrow="PERSONALIZED CARE FOR HEALTHIER, CLEARER SKIN."
          title="Skincare that goes deeper than the surface"
          accent="Skincare"
          body="From acne and aging to sensitivity and texture, every plan is built for real, visible improvement. Proven ingredients. Targeted treatments. Care that evolves with your skin."
          listTitle="Why our skincare works"
          benefits={[
            "Clinician-guided tailored care",
            "Prescription-strength options",
            "Simple daily routines",
            "Visible skin results",
            "Personalized treatment plans",
          ]}
          ctaLabel="Coming Soon"
          ctaHref="/services/skincare-aesthetics"
          accentColor="#8CB0B2"
          glowColor="#EBFEFF"
          visualImage={IMAGES.skinVisual}
          visualAlt="Minimal skincare products on a pale blue surface"
          visualTone="#EBFEFF"
          portraits={[
            {
              src: IMAGES.skinPortraitA,
              alt: "A woman with clear, radiant skin",
            },
            {
              src: IMAGES.skinPortraitB,
              alt: "A woman smiling in soft daylight",
            },
          ]}
          subheading="Skincare designed to treat the root cause—not just cover it up."
        />

        <CareCoaching
          eyebrow="BETTER IS POSSIBLE—AND WE BUILT FOR IT."
          title="Modern healthcare, built around you"
          accent="built around you"
          body="Our care coaching team, led by certified medical assistants and registered dietitians, helps answer questions about your medication, program, and day-to-day lifestyle changes—so you have the guidance you need to stay on track and see results."
          image={IMAGES.careCoaching}
          ctaLabel="See How Care Works"
          ctaHref="/how-it-works"
          statement="We're creating a better healthcare experience, and the details matter"
          statementAccent="We're here for those details."
        />

        <TestimonialMosaic
          eyebrow="THOSE WHO CHOSE SUZZMED"
          heading="There's a reason people are raving about us."
          accent="raving about us."
          subheading="Join the multitude of people who have trusted Suzzmed to help change their lives through thoughtful, individualized care."
          testimonials={testimonials.map((testimonial) => ({
            name: testimonial.name,
            quote: testimonial.quote,
            image: testimonial.image,
            rating: testimonial.rating,
            serviceCategory: testimonial.serviceCategory,
          }))}
        />

        <GuaranteeStrip />
      </main>

      <HomeFooter settings={settings} />
    </div>
  );
}
