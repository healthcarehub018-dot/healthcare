"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateRefCode } from "@/lib/utils";

const AssessmentSchema = z.object({
  areaOfInterest: z.string().min(1, "Please select an area of interest"),
  mainGoal: z.string().min(1, "Please select your primary goal"),
  preferredContact: z.string().default("email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().optional(),
  message: z.string().optional(),
  consentAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the privacy policy to submit your inquiry",
  }),
});

export async function submitAssessmentInquiry(data: {
  areaOfInterest: string;
  mainGoal: string;
  preferredContact: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
  consentAccepted: boolean;
  source?: string;
}) {
  try {
    const parsed = AssessmentSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Validation failed",
      };
    }

    const referenceCode = generateRefCode("SUZZ");

    // Match service if possible
    let serviceId: string | null = null;
    const serviceSlug = parsed.data.areaOfInterest.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const serviceMatch = await prisma.service.findFirst({
      where: {
        OR: [
          { slug: serviceSlug },
          { title: { contains: parsed.data.areaOfInterest } },
        ],
      },
    });
    if (serviceMatch) {
      serviceId = serviceMatch.id;
    }

    const lead = await prisma.lead.create({
      data: {
        referenceCode,
        serviceId,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        goalCategory: `${parsed.data.areaOfInterest} - ${parsed.data.mainGoal}`,
        message: parsed.data.message || null,
        preferredContact: parsed.data.preferredContact,
        source: data.source || "assessment_wizard",
        status: "NEW",
        consentAcceptedAt: new Date(),
        internalNotes: `Inquiry submitted via online assessment. Area: ${parsed.data.areaOfInterest}, Goal: ${parsed.data.mainGoal}`,
      },
    });

    return {
      success: true,
      referenceCode,
      leadId: lead.id,
    };
  } catch (error) {
    console.error("Failed to submit assessment:", error);
    return {
      success: false,
      error: "Unable to complete submission. Please try again or reach out to our team directly.",
    };
  }
}
