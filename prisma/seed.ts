import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding for Suzzmed...");

  // 1. Admin Users
  const adminEmail = process.env.ADMIN_EMAIL || "admin@suzzmed.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminPassword2026!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: "SUPER_ADMIN", active: true },
    create: {
      name: "Dr. Alexander Ross (Clinical Director)",
      email: adminEmail,
      passwordHash,
      role: "SUPER_ADMIN",
      active: true,
    },
  });

  // Editor admin user
  const editorHash = await bcrypt.hash("EditorPassword2026!", 10);
  await prisma.adminUser.upsert({
    where: { email: "editor@suzzmed.local" },
    update: { passwordHash: editorHash, role: "EDITOR", active: true },
    create: {
      name: "Sarah Jenkins (Content Manager)",
      email: "editor@suzzmed.local",
      passwordHash: editorHash,
      role: "EDITOR",
      active: true,
    },
  });

  // 2. Services
  const services = [
    {
      slug: "weight-management",
      title: "Weight Management",
      eyebrow: "PERSONALIZED CLINICAL SUPPORT",
      summary: "Thoughtful, evidence-informed weight guidance tailored to your metabolic blueprint and lifestyle.",
      description: "Our comprehensive weight management programs unite modern medical protocols, continuous practitioner guidance, and realistic nutritional strategies. We emphasize sustainable health improvements over rapid, unsustainable cycles.",
      heroImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
      status: "ACTIVE",
      featured: true,
      sortOrder: 1,
      benefits: JSON.stringify([
        "Personalized clinical intake & evaluation",
        "Continuous practitioner progress reviews",
        "Registered dietitian meal frameworks",
        "Transparent program and medication details",
        "Direct care team messaging"
      ]),
      ctaText: "Explore Weight Care",
      ctaUrl: "/weight-loss",
    },
    {
      slug: "peptides-longevity",
      title: "Peptides & Longevity",
      eyebrow: "ADVANCED CELLULAR WELLNESS",
      summary: "Pioneering protocols exploring cellular optimization, restorative vitality, and healthy aging.",
      description: "Explore the frontiers of longevity science. Our peptides and longevity pathways are built around comprehensive diagnostic biomarkers, restorative physiology, and individualized care schedules.",
      heroImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop",
      status: "ACTIVE",
      featured: true,
      sortOrder: 2,
      benefits: JSON.stringify([
        "Targeted cellular restoration pathways",
        "Biomarker-guided baseline assessment",
        "Physician-supervised protocols",
        "Educational longevity workshops"
      ]),
      ctaText: "Explore Longevity",
      ctaUrl: "/services/peptides-longevity",
    },
    {
      slug: "mens-wellness",
      title: "Men's Wellness",
      eyebrow: "VITALITY & PERFORMANCE",
      summary: "Targeted support for sustained physical energy, hormonal balance, mental clarity, and longevity.",
      description: "Men's health demands nuanced, confidential, and proactive care. From stamina and hormonal balance to metabolic fitness and preventative diagnostics, our physicians design protocols centered on your long-term goals.",
      heroImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop",
      status: "ACTIVE",
      featured: true,
      sortOrder: 3,
      benefits: JSON.stringify([
        "Hormone and vitality biomarker panels",
        "Confidential telehealth consultations",
        "Optimized daily vitality routines",
        "Preventative cardiovascular wellness"
      ]),
      ctaText: "Explore Men's Care",
      ctaUrl: "/services/mens-wellness",
    },
    {
      slug: "womens-wellness",
      title: "Women's Wellness",
      eyebrow: "HORMONAL & WHOLE-LIFE CARE",
      summary: "Holistic care addressing hormonal transitions, metabolic balance, vitality, and emotional wellness.",
      description: "Personalized care that honors every stage of womanhood. We integrate reproductive endocrinology insights, metabolic health, sleep hygiene, and preventative longevity into one coordinated care model.",
      heroImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop",
      status: "ACTIVE",
      featured: true,
      sortOrder: 4,
      benefits: JSON.stringify([
        "Perimenopause & hormonal transition guidance",
        "Metabolic health & blood sugar equilibrium",
        "Holistic stress and sleep optimization",
        "Empathetic female healthcare clinicians"
      ]),
      ctaText: "Explore Women's Care",
      ctaUrl: "/services/womens-wellness",
    },
    {
      slug: "nutrition-lifestyle",
      title: "Nutrition & Lifestyle",
      eyebrow: "METABOLIC NOURISHMENT",
      summary: "Practical, chef-inspired nutrition plans designed to fuel your metabolism and fit your daily schedule.",
      description: "No restrictive crash diets. We combine metabolic science with culinary joy, offering meal frameworks, macro tracking guides, and behavioral habit stacking tailored to your life.",
      heroImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop",
      status: "ACTIVE",
      featured: false,
      sortOrder: 5,
      benefits: JSON.stringify([
        "Registered dietitian-crafted meal plans",
        "Metabolic flexibility guidance",
        "Dining out and travel strategies",
        "Smart grocery shopping guides"
      ]),
      ctaText: "Explore Nutrition",
      ctaUrl: "/services/nutrition-lifestyle",
    },
    {
      slug: "hair-wellness",
      title: "Hair Wellness",
      eyebrow: "FOLLICULAR RESTORATION",
      summary: "Clinically validated approaches to follicle nourishment, shedding prevention, and hair density.",
      description: "Healthy hair begins with follicular health and systemic balance. Our targeted hair retention strategies leverage topical innovations, micro-nutritional support, and practitioner monitoring.",
      heroImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop",
      status: "ACTIVE",
      featured: false,
      sortOrder: 6,
      benefits: JSON.stringify([
        "Root cause scalp analysis",
        "Customized topical compounded options",
        "Targeted peptide and vitamin complexes",
        "Progressive photographic monitoring"
      ]),
      ctaText: "Explore Hair Care",
      ctaUrl: "/services/hair-wellness",
    },
    {
      slug: "skincare-aesthetics",
      title: "Skincare & Dermatology",
      eyebrow: "DERMATOLOGIC CONFIDENCE",
      summary: "Dermatologist-formulated skin regimens treating cellular barrier repair, texture, and radiance.",
      description: "Elevate your skin health with science-backed topicals, cellular turnover protocols, and personalized skin health assessments designed by certified clinical dermatologists.",
      heroImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop",
      status: "ACTIVE",
      featured: false,
      sortOrder: 7,
      benefits: JSON.stringify([
        "Skin type and barrier diagnostic evaluation",
        "Clinical strength active ingredients",
        "Gentle daily maintenance routines",
        "Direct dermatologist messaging"
      ]),
      ctaText: "Explore Skincare",
      ctaUrl: "/services/skincare-aesthetics",
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }

  // 3. Programs
  const weightService = await prisma.service.findUnique({ where: { slug: "weight-management" } });
  const mensService = await prisma.service.findUnique({ where: { slug: "mens-wellness" } });
  const womensService = await prisma.service.findUnique({ where: { slug: "womens-wellness" } });

  const programs = [
    {
      slug: "guided-glp1-program",
      serviceId: weightService?.id,
      title: "Comprehensive GLP-1 Care Protocol",
      description: "Doctor-supervised metabolic protocol including continuous telehealth guidance, lifestyle integration, and regular progress reviews.",
      priceDisplay: "From $199",
      priceNote: "per month, includes practitioner consultations and ongoing support",
      currency: "USD",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop",
      features: JSON.stringify([
        "Comprehensive health history review",
        "Licensed clinician telehealth evaluation",
        "Prescription coordination where clinically indicated",
        "Dietitian nutrition frameworks",
        "Dedicated care concierge messaging"
      ]),
      availability: "AVAILABLE",
      active: true,
      sortOrder: 1,
      ctaLabel: "Check Your Options",
      ctaDestination: "/assessment?interest=weight-management",
    },
    {
      slug: "metabolic-nutrition-coaching",
      serviceId: weightService?.id,
      title: "Metabolic Nutrition & Lifestyle Coaching",
      description: "One-on-one nutrition planning focused on insulin sensitivity, appetite regulation, and habit reinforcement.",
      priceDisplay: "$129",
      priceNote: "per month, no long-term contract",
      currency: "USD",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop",
      features: JSON.stringify([
        "Personalized bi-weekly coaching sessions",
        "Custom calorie and macro recommendations",
        "Digital food journal feedback",
        "Behavioral lifestyle guidance"
      ]),
      availability: "AVAILABLE",
      active: true,
      sortOrder: 2,
      ctaLabel: "Enroll in Nutrition",
      ctaDestination: "/assessment?interest=nutrition",
    },
    {
      slug: "mens-vitality-protocol",
      serviceId: mensService?.id,
      title: "Men's Hormone & Vitality Program",
      description: "Targeted protocol to optimize testosterone, metabolic rate, stamina, and cardiovascular fitness.",
      priceDisplay: "From $149",
      priceNote: "per month after clinical evaluation",
      currency: "USD",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
      features: JSON.stringify([
        "Comprehensive biomarker lab requisition",
        "Physician review of hormone ratios",
        "Customized therapeutic recommendations",
        "Quarterly lab monitoring and check-ins"
      ]),
      availability: "AVAILABLE",
      active: true,
      sortOrder: 3,
      ctaLabel: "Start Assessment",
      ctaDestination: "/assessment?interest=mens-wellness",
    },
    {
      slug: "womens-longevity-balance",
      serviceId: womensService?.id,
      title: "Women's Hormonal Harmony & Longevity",
      description: "Multi-system balance protocol for perimenopause, energy preservation, and metabolic clarity.",
      priceDisplay: "From $149",
      priceNote: "per month with ongoing clinical care",
      currency: "USD",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
      features: JSON.stringify([
        "Specialized endocrine hormone assessment",
        "Evidence-based symptom management",
        "Bone density & cardiovascular prevention",
        "Priority access to women's health clinicians"
      ]),
      availability: "AVAILABLE",
      active: true,
      sortOrder: 4,
      ctaLabel: "Start Assessment",
      ctaDestination: "/assessment?interest=womens-wellness",
    },
    {
      slug: "advanced-cellular-peptides",
      title: "Advanced Cellular Peptide Therapy",
      description: "Cutting-edge peptide formulations targeting tissue recovery, mitochondrial health, and deep restorative sleep.",
      priceDisplay: "Contact for Pricing",
      priceNote: "Customized clinical formulation",
      currency: "USD",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop",
      features: JSON.stringify([
        "Advanced mitochondrial optimization protocols",
        "Rigorous quality-tested formulations",
        "Regular physiological progress benchmarks",
        "Physician consultation required"
      ]),
      availability: "WAITLIST",
      active: true,
      sortOrder: 5,
      ctaLabel: "Join Waitlist",
      ctaDestination: "/assessment?interest=peptides",
    },
  ];

  for (const p of programs) {
    await prisma.program.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  // 4. Content Pages & Content Sections
  const pages = [
    { pageKey: "home", title: "Homepage", slug: "/" },
    { pageKey: "weight-loss", title: "Weight Management Landing Page", slug: "/weight-loss" },
    { pageKey: "about", title: "About Our Practice", slug: "/about" },
    { pageKey: "how-it-works", title: "How It Works", slug: "/how-it-works" },
    { pageKey: "contact", title: "Contact Us", slug: "/contact" },
  ];

  for (const page of pages) {
    await prisma.contentPage.upsert({
      where: { pageKey: page.pageKey },
      update: page,
      create: page,
    });
  }

  // Seed Homepage Sections
  const homeSections = [
    {
      pageKey: "home",
      sectionKey: "hero_dark",
      sectionType: "HERO_DARK",
      eyebrow: "CARE DESIGNED AROUND YOU",
      title: "Healthcare, made for real life.",
      body: "Explore convenient wellness programs, personalized guidance, and an easier way to connect with the care and support you need.",
      ctaLabel: "Explore Programs",
      ctaHref: "/programs",
      backgroundVariant: "dark",
      visible: true,
      sortOrder: 1,
      items: JSON.stringify(["Weight Management", "Peptides & Longevity", "Men's Wellness", "Women's Wellness"]),
    },
    {
      pageKey: "home",
      sectionKey: "benefit_strip",
      sectionType: "BENEFIT_STRIP",
      title: "Why Patients Choose Suzzmed",
      visible: true,
      sortOrder: 2,
      items: JSON.stringify([
        { title: "Qualified Professional Guidance", desc: "Collaborate with dedicated clinicians committed to your wellbeing." },
        { title: "Convenient Online Experience", desc: "Consultations, messaging, and reviews handled seamlessly from home." },
        { title: "Clear Program Information", desc: "Transparent pricing, genuine science, and zero hidden commitments." },
        { title: "Helpful Ongoing Support", desc: "Personal care concierge always available to assist with your next steps." },
      ]),
    },
    {
      pageKey: "home",
      sectionKey: "weight_feature",
      sectionType: "SPLIT_FEATURE",
      eyebrow: "PERSONALIZED WEIGHT SUPPORT",
      title: "A more thoughtful approach to your wellness journey.",
      body: "Discover guided programs designed around your goals, preferences, and individual needs. We replace unsustainable crash diets with evidence-informed medical guidance and continuous support.",
      ctaLabel: "Explore Weight Management",
      ctaHref: "/weight-loss",
      backgroundVariant: "cream",
      visible: true,
      sortOrder: 3,
      images: JSON.stringify(["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop"]),
      items: JSON.stringify([
        "Personalized clinical evaluations",
        "Transparent program and medication guidance",
        "Structured metabolic nutrition plans",
        "Continuous progress tracking and check-ins",
        "Direct care team messaging"
      ]),
    },
    {
      pageKey: "home",
      sectionKey: "womens_wellness",
      sectionType: "SPLIT_FEATURE",
      eyebrow: "WOMEN'S WELLNESS",
      title: "Wellness designed for every stage of life.",
      body: "Care built to honor women's evolving physiology. From perimenopause and hormone regulation to energy preservation and holistic metabolic balance.",
      ctaLabel: "Explore Women's Wellness",
      ctaHref: "/services/womens-wellness",
      backgroundVariant: "blush",
      visible: true,
      sortOrder: 4,
      images: JSON.stringify(["https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"]),
      items: JSON.stringify([
        "Specialized endocrine hormone guidance",
        "Perimenopausal symptom support",
        "Hair, skin, and vitality protocols",
        "Empathetic practitioner relationships"
      ]),
    },
    {
      pageKey: "home",
      sectionKey: "nutrition_feature",
      sectionType: "SPLIT_FEATURE",
      eyebrow: "NUTRITION & LIFESTYLE",
      title: "Make everyday nutrition simpler.",
      body: "Build convenient habits with practical meal planning, balanced food choices, and support that fits your actual daily routine without feelings of restriction.",
      ctaLabel: "Explore Nutrition",
      ctaHref: "/services/nutrition-lifestyle",
      backgroundVariant: "cream",
      visible: true,
      sortOrder: 5,
      images: JSON.stringify(["https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop"]),
      items: JSON.stringify([
        "Balanced meal ideas crafted by nutritionists",
        "Practical weekly planning frameworks",
        "Portion awareness and mindful eating",
        "Flexible dietary preferences (Plant-based, Low GI, Mediterranean)"
      ]),
    },
    {
      pageKey: "home",
      sectionKey: "mens_wellness",
      sectionType: "SPLIT_FEATURE",
      eyebrow: "MEN'S VITALITY",
      title: "Support for energy, confidence, and everyday wellbeing.",
      body: "Proactive care designed to help men feel strong, energized, and focused. Tailored protocols addressing stamina, hormonal balance, and long-term health metrics.",
      ctaLabel: "Explore Men's Wellness",
      ctaHref: "/services/mens-wellness",
      backgroundVariant: "sand",
      visible: true,
      sortOrder: 6,
      images: JSON.stringify(["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop"]),
      items: JSON.stringify([
        "Comprehensive vitality biomarker reviews",
        "Confidential telehealth appointments",
        "Customized lifestyle and activity schedules",
        "Ongoing physician support and check-ins"
      ]),
    },
    {
      pageKey: "home",
      sectionKey: "peptides_longevity",
      sectionType: "SPLIT_FEATURE",
      eyebrow: "ADVANCED WELLNESS",
      title: "Explore new possibilities in long-term wellness.",
      body: "Discover the emerging scientific protocols in restorative cellular health, metabolic longevity, and targeted physiological rejuvenation.",
      ctaLabel: "Learn More",
      ctaHref: "/services/peptides-longevity",
      backgroundVariant: "blue",
      visible: true,
      sortOrder: 7,
      images: JSON.stringify(["https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop"]),
      items: JSON.stringify([
        "Cellular health research-informed guidance",
        "Biomarker-led baseline tracking",
        "Physician-supervised protocols",
        "Coming Soon for eligible participants"
      ]),
    },
    {
      pageKey: "home",
      sectionKey: "modern_care",
      sectionType: "MODERN_CARE",
      eyebrow: "A BETTER EXPERIENCE",
      title: "Care and support designed around you.",
      body: "We have reimagined the healthcare journey from the ground up to eliminate waiting rooms, confusing bills, and rushed appointments.",
      visible: true,
      sortOrder: 8,
      items: JSON.stringify([
        { title: "Convenient Access", desc: "Connect with licensed healthcare providers directly through intuitive digital consultations." },
        { title: "Personalized Communication", desc: "Send secure messages whenever questions arise and receive thoughtful, prompt answers." },
        { title: "Helpful Progress Tools", desc: "Track your biomarkers, weight evolution, and lifestyle milestones with clarity." }
      ]),
    },
    {
      pageKey: "home",
      sectionKey: "final_cta",
      sectionType: "FINAL_CTA",
      title: "Your next step toward better wellness starts here.",
      body: "Take our brief 2-minute non-clinical interest assessment to discover programs designed around your personal health goals.",
      ctaLabel: "Get Started Now",
      ctaHref: "/assessment",
      backgroundVariant: "dark",
      visible: true,
      sortOrder: 9,
    },
  ];

  for (const s of homeSections) {
    await prisma.contentSection.upsert({
      where: {
        pageKey_sectionKey: {
          pageKey: s.pageKey,
          sectionKey: s.sectionKey,
        },
      },
      update: s,
      create: s,
    });
  }

  // 5. FAQs
  const faqs = [
    {
      pageKey: "all",
      category: "General",
      question: "How does the initial inquiry work?",
      answer: "You begin by completing our simple online wellness assessment. Our clinical care coordination team reviews your answers and reaches out within 24–48 hours with personalized program recommendations.",
      published: true,
      sortOrder: 1,
    },
    {
      pageKey: "all",
      category: "General",
      question: "What types of programs are available?",
      answer: "We offer programs in medical weight management, men's and women's hormonal vitality, metabolic nutrition, cellular longevity, hair wellness, and clinical skincare.",
      published: true,
      sortOrder: 2,
    },
    {
      pageKey: "all",
      category: "Pricing",
      question: "How much do the programs cost?",
      answer: "Pricing is transparent with no hidden clinic fees. Monthly programs start from $129 to $199 depending on the tier and clinical services required. Exact pricing is clearly outlined before any enrollment.",
      published: true,
      sortOrder: 3,
    },
    {
      pageKey: "all",
      category: "Clinical",
      question: "Can I speak with a licensed clinician before enrolling?",
      answer: "Yes. All medical programs include a comprehensive telehealth consultation with a licensed medical provider who reviews your medical history and answers all your questions.",
      published: true,
      sortOrder: 4,
    },
    {
      pageKey: "all",
      category: "Clinical",
      question: "Is clinical approval guaranteed?",
      answer: "No. All medical decisions and prescriptions are made solely at the discretion of the licensed healthcare provider following thorough clinical review. If a program is not medically suitable, alternative wellness options are suggested.",
      published: true,
      sortOrder: 5,
    },
    {
      pageKey: "all",
      category: "Privacy",
      question: "How is my personal information protected?",
      answer: "We employ industry-standard encryption, strict access controls, and secure data handling procedures. Your personal data is never sold to third-party marketers or advertisers.",
      published: true,
      sortOrder: 6,
    },
    {
      pageKey: "weight-loss",
      category: "Weight Loss",
      question: "What happens after submitting my weight inquiry?",
      answer: "Our care team will verify your initial questionnaire, prepare an overview of suitable program tracks, and invite you to schedule your digital clinical intake consultation.",
      published: true,
      sortOrder: 7,
    },
    {
      pageKey: "weight-loss",
      category: "Weight Loss",
      question: "Can I adjust or cancel my program at any time?",
      answer: "Yes, our programs operate on flexible month-to-month memberships without punitive cancellation lock-ins. You can modify or pause your participation through your care coordinator.",
      published: true,
      sortOrder: 8,
    },
  ];

  for (const faq of faqs) {
    const existing = await prisma.fAQ.findFirst({
      where: { question: faq.question },
    });
    if (!existing) {
      await prisma.fAQ.create({ data: faq });
    }
  }

  // 6. Testimonials (Demonstration Placeholders with verified consent flag)
  const testimonials = [
    {
      name: "Marcus Sterling",
      roleOrLocation: "Austin, TX • Verified Patient",
      quote: "Working with the Suzzmed care team completely changed my mindset on metabolic health. The clinician took 45 minutes to explain my blood markers rather than just handing me a standard printout.",
      rating: 5,
      serviceCategory: "Weight Management",
      consentVerified: true,
      status: "PUBLISHED",
      sortOrder: 1,
      showOnHome: true,
      showOnLanding: true,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Elena Rostova",
      roleOrLocation: "Denver, CO • Verified Patient",
      quote: "The personalized attention I received during my perimenopause transition gave me my energy and quality sleep back. The telehealth appointments were on time, empathetic, and truly comprehensive.",
      rating: 5,
      serviceCategory: "Women's Wellness",
      consentVerified: true,
      status: "PUBLISHED",
      sortOrder: 2,
      showOnHome: true,
      showOnLanding: true,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "David Chen",
      roleOrLocation: "Seattle, WA • Verified Patient",
      quote: "The clear pricing and zero-hassle delivery of program materials made staying consistent effortless. Having direct chat access to my dietitian keeps me accountable every single week.",
      rating: 5,
      serviceCategory: "Men's Wellness",
      consentVerified: true,
      status: "PUBLISHED",
      sortOrder: 3,
      showOnHome: true,
      showOnLanding: true,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Claire Davenport",
      roleOrLocation: "Chicago, IL • Verified Patient",
      quote: "I appreciated the honest clinical assessment. Rather than over-promising, my clinician set practical benchmarks that I was actually able to maintain with my demanding corporate career.",
      rating: 5,
      serviceCategory: "Weight Management",
      consentVerified: true,
      status: "PUBLISHED",
      sortOrder: 4,
      showOnHome: true,
      showOnLanding: true,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    },
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { name: t.name },
    });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }

  // 7. Navigation Items
  const navItems = [
    { label: "Home", href: "/", location: "HEADER", sortOrder: 1, visible: true },
    { label: "Weight Loss", href: "/weight-loss", location: "HEADER", sortOrder: 2, visible: true },
    { label: "Programs", href: "/programs", location: "HEADER", sortOrder: 3, visible: true },
    { label: "How It Works", href: "/how-it-works", location: "HEADER", sortOrder: 4, visible: true },
    { label: "Reviews", href: "/reviews", location: "HEADER", sortOrder: 5, visible: true },
    { label: "FAQ", href: "/faq", location: "HEADER", sortOrder: 6, visible: true },
    { label: "Contact", href: "/contact", location: "HEADER", sortOrder: 7, visible: true },
    // Footer Navigation
    { label: "Weight Management", href: "/weight-loss", location: "FOOTER", sortOrder: 1, visible: true },
    { label: "Peptides & Longevity", href: "/services/peptides-longevity", location: "FOOTER", sortOrder: 2, visible: true },
    { label: "Men's Wellness", href: "/services/mens-wellness", location: "FOOTER", sortOrder: 3, visible: true },
    { label: "Women's Wellness", href: "/services/womens-wellness", location: "FOOTER", sortOrder: 4, visible: true },
    { label: "Nutrition & Lifestyle", href: "/services/nutrition-lifestyle", location: "FOOTER", sortOrder: 5, visible: true },
    { label: "About Our Practice", href: "/about", location: "FOOTER", sortOrder: 6, visible: true },
    { label: "Clinical Team", href: "/about#team", location: "FOOTER", sortOrder: 7, visible: true },
    { label: "How It Works", href: "/how-it-works", location: "FOOTER", sortOrder: 8, visible: true },
    { label: "Reviews & Outcomes", href: "/reviews", location: "FOOTER", sortOrder: 9, visible: true },
    { label: "Contact Us", href: "/contact", location: "FOOTER", sortOrder: 10, visible: true },
  ];

  for (const n of navItems) {
    const existing = await prisma.navigationItem.findFirst({
      where: { label: n.label, location: n.location },
    });
    if (!existing) {
      await prisma.navigationItem.create({ data: n });
    }
  }

  // 8. Legal Pages
  const legalPages = [
    {
      slug: "privacy",
      title: "Privacy Policy",
      body: `## 1. Introduction
At Suzzmed Healthcare ("we", "our", or "us"), we are dedicated to protecting your privacy and treating your personal health and demographic information with the highest degree of confidentiality and technical security.

## 2. Information We Collect
We collect personal information that you provide voluntarily when submitting inquiries, requesting consultations, or communicating with our team. This may include:
- Contact information: First name, last name, email address, phone number.
- Non-clinical goals: Areas of health interest (weight, nutrition, wellness), preferred contact channels.
- Usage data: Device type, browser information, pages visited, session duration.

## 3. How We Use Information
We use your information strictly to:
- Coordinate your non-clinical health inquiry and schedule telemedicine consultations.
- Connect you with appropriate licensed medical providers.
- Provide administrative updates, answers to your inquiries, and support.
- Comply with applicable legal, security, and regulatory requirements.

## 4. No Sale of Personal Information
We do not sell, rent, or trade your personal information to third-party data brokers or marketing firms.

## 5. Security Safeguards
We implement multi-layered encryption, secure cryptographic password hashing, access restrictions, and secure socket layers (SSL/TLS) to protect all transmitted and stored records.

## 6. Your Rights & Retention
You may request an export or deletion of your contact records at any time by contacting our privacy officer at privacy@suzzmed.local.`,
      published: true,
    },
    {
      slug: "terms",
      title: "Terms and Conditions of Use",
      body: `## 1. Acceptance of Terms
By accessing or using the Suzzmed website, you agree to comply with and be bound by these Terms of Use. If you do not agree with any portion of these terms, please discontinue use immediately.

## 2. Non-Clinical Informational Scope
The content published on this website is provided for informational, educational, and inquiry purposes only. Content on this site does not constitute medical diagnosis, personalized treatment plans, or prescription guarantees.

## 3. Consultation Requirements
Any medical treatment or prescription is dependent on an independent clinical evaluation conducted by a qualified and licensed healthcare provider. The provider reserves sole discretion regarding clinical eligibility.

## 4. Limitation of Liability
To the maximum extent permitted by applicable law, Suzzmed shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the platform.

## 5. Contact Information
For questions regarding these Terms of Use, please reach out to legal@suzzmed.local.`,
      published: true,
    },
    {
      slug: "medical-disclaimer",
      title: "Medical Disclaimer",
      body: `## 1. Not Medical Advice
The materials, calculators, program descriptions, and FAQs displayed on this website are for educational and informational purposes only and do not replace professional medical advice, clinical diagnosis, or medical treatment.

## 2. No Doctor-Patient Relationship Formed
Interactions through this website, including submitting the non-clinical assessment questionnaire or sending a contact message, do not establish a formal doctor-patient relationship until a formal clinical intake has been conducted and approved by a licensed medical provider.

## 3. Emergency Situations
If you believe you may be experiencing a medical emergency, please call your local emergency services (such as 911 in the United States) or proceed immediately to the nearest hospital emergency room. Do not rely on digital inquiries or messaging for urgent medical conditions.

## 4. Individual Results Vary
Testimonials, outcomes, and program timelines depicted on this website reflect individual experiences and do not guarantee identical results for any individual patient.`,
      published: true,
    },
  ];

  for (const lp of legalPages) {
    await prisma.legalPage.upsert({
      where: { slug: lp.slug },
      update: lp,
      create: lp,
    });
  }

  // 9. Site Settings
  const settings = [
    { key: "site_name", value: "Suzzmed Healthcare" },
    { key: "tagline", value: "Care designed around you." },
    { key: "contact_email", value: "care@suzzmed.local" },
    { key: "contact_phone", value: "+1 (800) 492-SUZZ" },
    { key: "contact_address", value: "500 Healthcare Way, Suite 400, Austin, TX 78701" },
    { key: "contact_hours", value: "Mon - Fri: 8am - 8pm EST | Sat: 9am - 5pm EST" },
    { key: "theme_primary", value: "#104D38" },
    { key: "theme_secondary", value: "#175840" },
    { key: "theme_sage", value: "#779B7C" },
    { key: "currency_default", value: "USD" },
    { key: "header_cta_label", value: "Get Started" },
    { key: "header_cta_link", value: "/assessment" },
    { key: "promo_banner_active", value: "true" },
    { key: "promo_banner_text", value: "✨ Complimentary Physician Consultation on All Initial Weight Care Programs" },
    { key: "promo_banner_link", value: "/weight-loss" },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  // 10. Sample Verified Metrics
  const metrics = [
    { label: "Patient Care Satisfaction", value: "98.4%", source: "Independent Patient Survey 2025", approved: true, visible: true, sortOrder: 1 },
    { label: "Specialized Clinical Programs", value: "14+", source: "Suzzmed Clinical Portfolio", approved: true, visible: true, sortOrder: 2 },
    { label: "Average Clinical Response Time", value: "< 24 hrs", source: "Care Concierge Metrics", approved: true, visible: true, sortOrder: 3 },
    { label: "Board-Certified Medical Clinicians", value: "100%", source: "State Licensure Verification", approved: true, visible: true, sortOrder: 4 },
  ];

  for (const m of metrics) {
    const existing = await prisma.verifiedMetric.findFirst({ where: { label: m.label } });
    if (!existing) {
      await prisma.verifiedMetric.create({ data: m });
    }
  }

  // 11. Initial Sample Leads (crm-lite testing)
  const initialLeads = [
    {
      referenceCode: "SUZZ-2026-8812",
      firstName: "Jonathan",
      lastName: "Miller",
      email: "jonathan.miller@example.com",
      phone: "+1 (555) 234-8901",
      goalCategory: "Weight Management",
      message: "Looking to explore physician-guided metabolic options. Need sustainable lifestyle guidance.",
      preferredContact: "email",
      source: "weight-loss",
      status: "NEW",
      internalNotes: "Prefers morning email contact. Initial assessment complete.",
      consentAcceptedAt: new Date(),
    },
    {
      referenceCode: "SUZZ-2026-8813",
      firstName: "Samantha",
      lastName: "Reed",
      email: "samantha.reed@example.com",
      phone: "+1 (555) 345-9012",
      goalCategory: "Women's Wellness",
      message: "Interested in hormonal balance consultation and blood work evaluation.",
      preferredContact: "phone",
      source: "assessment",
      status: "CONTACTED",
      internalNotes: "Left voicemail and sent introductory welcome email.",
      consentAcceptedAt: new Date(),
    },
  ];

  for (const lead of initialLeads) {
    await prisma.lead.upsert({
      where: { referenceCode: lead.referenceCode },
      update: {},
      create: lead,
    });
  }

  console.log("Database seeded successfully with Suzzmed identity!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
