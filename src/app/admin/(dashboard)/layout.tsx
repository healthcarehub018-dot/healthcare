import React from "react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const revalidate = 0;

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentAdmin = await getCurrentAdmin();

  if (!currentAdmin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#F8F9F6] text-[#242824] flex flex-col lg:flex-row font-sans">
      <AdminSidebar user={currentAdmin} />
      <main className="flex-1 min-w-0 flex flex-col min-h-screen overflow-x-hidden">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
