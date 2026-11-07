import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Safe CSV generation preventing spreadsheet formula injection
  const headers = [
    "ReferenceCode",
    "FirstName",
    "LastName",
    "Email",
    "Phone",
    "GoalCategory",
    "Status",
    "PreferredContact",
    "Source",
    "CreatedAt",
  ];

  const escapeCell = (str?: string | null) => {
    if (!str) return '""';
    let clean = String(str).replace(/"/g, '""');
    // Sanitize formula injection triggers (=, +, -, @)
    if (/^[=+\-@]/.test(clean)) {
      clean = `'${clean}`;
    }
    return `"${clean}"`;
  };

  const rows = leads.map((l) => [
    escapeCell(l.referenceCode),
    escapeCell(l.firstName),
    escapeCell(l.lastName),
    escapeCell(l.email),
    escapeCell(l.phone),
    escapeCell(l.goalCategory),
    escapeCell(l.status),
    escapeCell(l.preferredContact),
    escapeCell(l.source),
    escapeCell(l.createdAt.toISOString()),
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  await prisma.auditLog.create({
    data: {
      adminUserId: admin.id,
      adminName: admin.name,
      entityType: "LEAD",
      action: "EXPORT_CSV",
      summary: `Exported ${leads.length} lead records to CSV`,
    },
  });

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="suzzmed-leads-${Date.now()}.csv"`,
    },
  });
}
