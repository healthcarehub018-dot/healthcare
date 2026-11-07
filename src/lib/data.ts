import { prisma } from "./db";

export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const settings = await prisma.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    return map;
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return {};
  }
}

export async function getNavigation(location: "HEADER" | "FOOTER" = "HEADER") {
  try {
    return await prisma.navigationItem.findMany({
      where: { location, visible: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch navigation:", error);
    return [];
  }
}

export async function getContentSections(pageKey: string) {
  try {
    const sections = await prisma.contentSection.findMany({
      where: { pageKey, visible: true },
      orderBy: { sortOrder: "asc" },
    });
    const map: Record<string, (typeof sections)[0]> = {};
    for (const sec of sections) {
      map[sec.sectionKey] = sec;
    }
    return { list: sections, map };
  } catch (error) {
    console.error(`Failed to fetch sections for ${pageKey}:`, error);
    return { list: [], map: {} };
  }
}

export async function getServices(onlyActive = true) {
  try {
    return await prisma.service.findMany({
      where: onlyActive ? { status: "ACTIVE" } : undefined,
      orderBy: { sortOrder: "asc" },
      include: {
        programs: {
          where: { active: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    return await prisma.service.findUnique({
      where: { slug },
      include: {
        programs: {
          where: { active: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });
  } catch (error) {
    console.error(`Failed to fetch service ${slug}:`, error);
    return null;
  }
}

export async function getPrograms(featuredOnly = false) {
  try {
    return await prisma.program.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      include: { service: true },
    });
  } catch (error) {
    console.error("Failed to fetch programs:", error);
    return [];
  }
}

export async function getFAQs(pageKey?: string) {
  try {
    return await prisma.fAQ.findMany({
      where: {
        published: true,
        ...(pageKey ? { OR: [{ pageKey: "all" }, { pageKey }] } : {}),
      },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch FAQs:", error);
    return [];
  }
}

export async function getTestimonials(placement: "home" | "landing" | "all" = "all") {
  try {
    return await prisma.testimonial.findMany({
      where: {
        status: "PUBLISHED",
        consentVerified: true,
        ...(placement === "home" ? { showOnHome: true } : {}),
        ...(placement === "landing" ? { showOnLanding: true } : {}),
      },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return [];
  }
}

export async function getLegalPage(slug: string) {
  try {
    return await prisma.legalPage.findUnique({
      where: { slug, published: true },
    });
  } catch (error) {
    console.error(`Failed to fetch legal page ${slug}:`, error);
    return null;
  }
}

export async function getVerifiedMetrics() {
  try {
    return await prisma.verifiedMetric.findMany({
      where: { approved: true, visible: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch verified metrics:", error);
    return [];
  }
}
