"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";

const ContactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(5, "Message must be at least 5 characters"),
  consent: z.boolean().refine((v) => v === true, {
    message: "You must consent to be contacted",
  }),
});

export async function submitContactMessage(formData: FormData) {
  try {
    const raw = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || undefined,
      subject: formData.get("subject"),
      message: formData.get("message"),
      consent: formData.get("consent") === "on",
    };

    const parsed = ContactSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Validation failed",
      };
    }

    const message = await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        subject: parsed.data.subject,
        message: parsed.data.message,
        status: "UNREAD",
      },
    });

    return {
      success: true,
      messageId: message.id,
    };
  } catch (error) {
    console.error("Failed to submit contact message:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again or email us directly.",
    };
  }
}
