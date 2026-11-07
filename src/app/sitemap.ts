import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suzzmed.local";

  const services = await prisma.service.findMany({
    where: { status: "ACTIVE" },
    select: { slug: true, updatedAt: true },
  });

  const staticRoutes = [
    "",
    "/weight-loss",
    "/programs",
    "/about",
    "/how-it-works",
    "/reviews",
    "/faq",
    "/contact",
    "/assessment",
    "/privacy",
    "/terms",
    "/medical-disclaimer",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...serviceRoutes];
}
