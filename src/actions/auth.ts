"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signToken, setAdminSessionCookie, clearAdminSessionCookie, getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAdmin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  try {
    const admin = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!admin || !admin.active) {
      return { success: false, error: "Invalid credentials or account inactive" };
    }

    const passwordMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordMatch) {
      return { success: false, error: "Invalid credentials" };
    }

    const token = signToken({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });

    await setAdminSessionCookie(token);

    // Audit log
    await prisma.auditLog.create({
      data: {
        adminUserId: admin.id,
        adminName: admin.name,
        entityType: "AUTH",
        entityId: admin.id,
        action: "LOGIN",
        summary: `Admin logged in successfully (${admin.email})`,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An unexpected authentication error occurred" };
  }
}

export async function logoutAdmin() {
  const admin = await getCurrentAdmin();
  if (admin) {
    try {
      await prisma.auditLog.create({
        data: {
          adminUserId: admin.id,
          adminName: admin.name,
          entityType: "AUTH",
          entityId: admin.id,
          action: "LOGOUT",
          summary: `Admin logged out (${admin.email})`,
        },
      });
    } catch {
      // ignore
    }
  }

  await clearAdminSessionCookie();
  redirect("/admin/login");
}
