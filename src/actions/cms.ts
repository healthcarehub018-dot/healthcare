"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

// Helper for security & auditing
async function ensureAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("Unauthorized. Please log in.");
  }
  return admin;
}

// 1. UPDATE CONTENT SECTION (CMS)
export async function updateContentSection(formData: FormData): Promise<void> {
  const admin = await ensureAdmin();
  const pageKey = formData.get("pageKey") as string;
  const sectionKey = formData.get("sectionKey") as string;
  const title = formData.get("title") as string;
  const eyebrow = formData.get("eyebrow") as string;
  const body = formData.get("body") as string;
  const ctaLabel = formData.get("ctaLabel") as string;
  const ctaHref = formData.get("ctaHref") as string;
  const backgroundVariant = formData.get("backgroundVariant") as string;
  const visible = formData.get("visible") === "true";

  await prisma.contentSection.upsert({
    where: { pageKey_sectionKey: { pageKey, sectionKey } },
    update: {
      title,
      eyebrow,
      body,
      ctaLabel,
      ctaHref,
      backgroundVariant,
      visible,
    },
    create: {
      pageKey,
      sectionKey,
      sectionType: "CMS_SECTION",
      title,
      eyebrow,
      body,
      ctaLabel,
      ctaHref,
      backgroundVariant,
      visible,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminUserId: admin.id,
      adminName: admin.name,
      entityType: "CMS",
      entityId: `${pageKey}:${sectionKey}`,
      action: "UPDATE",
      summary: `Updated CMS section [${sectionKey}] on page [${pageKey}]`,
    },
  });

  revalidatePath("/");
  revalidatePath("/weight-loss");
  revalidatePath("/admin/homepage");
  revalidatePath("/admin/landing-page");
}

// 2. SERVICES CRUD
export async function saveService(formData: FormData): Promise<void> {
  const admin = await ensureAdmin();
  const id = formData.get("id") as string | null;
  const slug = formData.get("slug") as string;
  const title = formData.get("title") as string;
  const eyebrow = formData.get("eyebrow") as string;
  const summary = formData.get("summary") as string;
  const description = formData.get("description") as string;
  const heroImage = formData.get("heroImage") as string;
  const status = formData.get("status") as string;
  const ctaText = formData.get("ctaText") as string;
  const ctaUrl = formData.get("ctaUrl") as string;

  if (id) {
    await prisma.service.update({
      where: { id },
      data: {
        slug,
        title,
        eyebrow,
        summary,
        description,
        heroImage,
        status,
        ctaText,
        ctaUrl,
      },
    });
  } else {
    await prisma.service.create({
      data: {
        slug,
        title,
        eyebrow,
        summary,
        description,
        heroImage,
        status: status || "ACTIVE",
        ctaText,
        ctaUrl,
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      adminUserId: admin.id,
      adminName: admin.name,
      entityType: "SERVICE",
      entityId: id || slug,
      action: id ? "UPDATE" : "CREATE",
      summary: `${id ? "Updated" : "Created"} service: ${title}`,
    },
  });

  revalidatePath("/");
  revalidatePath("/programs");
  revalidatePath(`/services/${slug}`);
  revalidatePath("/admin/services");
}

export async function deleteService(id: string): Promise<void> {
  const admin = await ensureAdmin();
  const s = await prisma.service.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      adminUserId: admin.id,
      adminName: admin.name,
      entityType: "SERVICE",
      entityId: id,
      action: "DELETE",
      summary: `Deleted service: ${s.title}`,
    },
  });

  revalidatePath("/");
  revalidatePath("/programs");
  revalidatePath("/admin/services");
}

// 3. PROGRAMS CRUD
export async function saveProgram(formData: FormData): Promise<void> {
  const admin = await ensureAdmin();
  const id = formData.get("id") as string | null;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const serviceId = (formData.get("serviceId") as string) || null;
  const description = formData.get("description") as string;
  const priceDisplay = formData.get("priceDisplay") as string;
  const priceNote = formData.get("priceNote") as string;
  const image = formData.get("image") as string;
  const availability = formData.get("availability") as string;
  const active = formData.get("active") === "true";
  const ctaLabel = formData.get("ctaLabel") as string;
  const ctaDestination = formData.get("ctaDestination") as string;

  if (id) {
    await prisma.program.update({
      where: { id },
      data: {
        title,
        slug,
        serviceId: serviceId || null,
        description,
        priceDisplay,
        priceNote,
        image,
        availability,
        active,
        ctaLabel,
        ctaDestination,
      },
    });
  } else {
    await prisma.program.create({
      data: {
        title,
        slug,
        serviceId: serviceId || null,
        description,
        priceDisplay,
        priceNote,
        image,
        availability: availability || "AVAILABLE",
        active,
        ctaLabel,
        ctaDestination,
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      adminUserId: admin.id,
      adminName: admin.name,
      entityType: "PROGRAM",
      entityId: id || slug,
      action: id ? "UPDATE" : "CREATE",
      summary: `${id ? "Updated" : "Created"} program: ${title}`,
    },
  });

  revalidatePath("/programs");
  revalidatePath("/weight-loss");
  revalidatePath("/admin/programs");
}

export async function deleteProgram(id: string): Promise<void> {
  const admin = await ensureAdmin();
  const p = await prisma.program.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      adminUserId: admin.id,
      adminName: admin.name,
      entityType: "PROGRAM",
      entityId: id,
      action: "DELETE",
      summary: `Deleted program: ${p.title}`,
    },
  });

  revalidatePath("/programs");
  revalidatePath("/weight-loss");
  revalidatePath("/admin/programs");
}

// 4. LEADS STATUS & NOTES
export async function updateLead(formData: FormData): Promise<void> {
  const admin = await ensureAdmin();
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  const internalNotes = formData.get("internalNotes") as string;

  const lead = await prisma.lead.update({
    where: { id },
    data: {
      status,
      internalNotes,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminUserId: admin.id,
      adminName: admin.name,
      entityType: "LEAD",
      entityId: id,
      action: "STATUS_CHANGE",
      summary: `Updated lead [${lead.referenceCode}] status to ${status}`,
    },
  });

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

// 5. TESTIMONIALS
export async function saveTestimonial(formData: FormData): Promise<void> {
  const admin = await ensureAdmin();
  const id = formData.get("id") as string | null;
  const name = formData.get("name") as string;
  const roleOrLocation = formData.get("roleOrLocation") as string;
  const quote = formData.get("quote") as string;
  const image = formData.get("image") as string;
  const rating = Number(formData.get("rating") || 5);
  const serviceCategory = formData.get("serviceCategory") as string;
  const consentVerified = formData.get("consentVerified") === "true";
  const status = formData.get("status") as string;

  const finalStatus = consentVerified ? status : "DRAFT";

  if (id) {
    await prisma.testimonial.update({
      where: { id },
      data: {
        name,
        roleOrLocation,
        quote,
        image,
        rating,
        serviceCategory,
        consentVerified,
        status: finalStatus,
      },
    });
  } else {
    await prisma.testimonial.create({
      data: {
        name,
        roleOrLocation,
        quote,
        image,
        rating,
        serviceCategory,
        consentVerified,
        status: finalStatus,
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      adminUserId: admin.id,
      adminName: admin.name,
      entityType: "TESTIMONIAL",
      entityId: id || name,
      action: id ? "UPDATE" : "CREATE",
      summary: `${id ? "Updated" : "Created"} testimonial for ${name}`,
    },
  });

  revalidatePath("/");
  revalidatePath("/reviews");
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonial(id: string): Promise<void> {
  const admin = await ensureAdmin();
  await prisma.testimonial.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      adminUserId: admin.id,
      adminName: admin.name,
      entityType: "TESTIMONIAL",
      entityId: id,
      action: "DELETE",
      summary: `Deleted testimonial ${id}`,
    },
  });

  revalidatePath("/");
  revalidatePath("/reviews");
  revalidatePath("/admin/testimonials");
}

// 6. FAQS
export async function saveFAQ(formData: FormData): Promise<void> {
  const admin = await ensureAdmin();
  const id = formData.get("id") as string | null;
  const pageKey = (formData.get("pageKey") as string) || "all";
  const category = (formData.get("category") as string) || "General";
  const question = formData.get("question") as string;
  const answer = formData.get("answer") as string;
  const published = formData.get("published") === "true";

  if (id) {
    await prisma.fAQ.update({
      where: { id },
      data: { pageKey, category, question, answer, published },
    });
  } else {
    await prisma.fAQ.create({
      data: { pageKey, category, question, answer, published },
    });
  }

  await prisma.auditLog.create({
    data: {
      adminUserId: admin.id,
      adminName: admin.name,
      entityType: "FAQ",
      entityId: id || question,
      action: id ? "UPDATE" : "CREATE",
      summary: `${id ? "Updated" : "Created"} FAQ: ${question}`,
    },
  });

  revalidatePath("/");
  revalidatePath("/faq");
  revalidatePath("/weight-loss");
  revalidatePath("/admin/faqs");
}

export async function deleteFAQ(id: string): Promise<void> {
  const admin = await ensureAdmin();
  await prisma.fAQ.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      adminUserId: admin.id,
      adminName: admin.name,
      entityType: "FAQ",
      entityId: id,
      action: "DELETE",
      summary: `Deleted FAQ ${id}`,
    },
  });

  revalidatePath("/");
  revalidatePath("/faq");
  revalidatePath("/admin/faqs");
}

// 7. SETTINGS
export async function saveSettings(formData: FormData): Promise<void> {
  const admin = await ensureAdmin();
  const keys = Array.from(formData.keys());

  for (const key of keys) {
    const val = formData.get(key) as string;
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: val },
      create: { key, value: val },
    });
  }

  await prisma.auditLog.create({
    data: {
      adminUserId: admin.id,
      adminName: admin.name,
      entityType: "SETTINGS",
      action: "UPDATE",
      summary: `Updated site settings`,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

// 8. LEGAL PAGES
export async function saveLegalPage(formData: FormData): Promise<void> {
  const admin = await ensureAdmin();
  const slug = formData.get("slug") as string;
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;

  await prisma.legalPage.upsert({
    where: { slug },
    update: { title, body },
    create: { slug, title, body, published: true },
  });

  await prisma.auditLog.create({
    data: {
      adminUserId: admin.id,
      adminName: admin.name,
      entityType: "LEGAL",
      entityId: slug,
      action: "UPDATE",
      summary: `Updated legal policy [${slug}]`,
    },
  });

  revalidatePath(`/${slug}`);
  revalidatePath("/admin/legal");
}
