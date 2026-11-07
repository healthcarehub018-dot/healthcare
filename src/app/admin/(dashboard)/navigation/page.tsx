import React from "react";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Compass, Plus, Trash2, ArrowUpDown } from "lucide-react";

export const revalidate = 0;

export default async function AdminNavigationPage() {
  const [headerNav, footerNav] = await Promise.all([
    prisma.navigationItem.findMany({
      where: { location: "HEADER" },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.navigationItem.findMany({
      where: { location: "FOOTER" },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#779B7C] block">
            SITE ARCHITECTURE
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#242824] tracking-tight">
            Navigation Menu Management
          </h1>
          <p className="text-xs sm:text-sm text-[#6F7770] mt-0.5">
            Configure header links, mobile menu targets, and footer directory items.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Header Links */}
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-[#242824]">Header Navigation Links</h2>
          <div className="space-y-2">
            {headerNav.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#F8F9F6] border border-black/5 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-[#242824]">{item.label}</span>
                  <span className="block text-[10px] font-mono text-[#6F7770]">{item.href}</span>
                </div>
                <form
                  action={async () => {
                    "use server";
                    await prisma.navigationItem.delete({ where: { id: item.id } });
                    revalidatePath("/", "layout");
                    revalidatePath("/admin/navigation");
                  }}
                >
                  <button type="submit" className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-[#242824]">Footer Directory Links</h2>
          <div className="space-y-2">
            {footerNav.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#F8F9F6] border border-black/5 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-[#242824]">{item.label}</span>
                  <span className="block text-[10px] font-mono text-[#6F7770]">{item.href}</span>
                </div>
                <form
                  action={async () => {
                    "use server";
                    await prisma.navigationItem.delete({ where: { id: item.id } });
                    revalidatePath("/", "layout");
                    revalidatePath("/admin/navigation");
                  }}
                >
                  <button type="submit" className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Navigation Link */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E9F1E8] text-[#104D38] flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#242824]">Add Navigation Link</h3>
            <p className="text-xs text-[#6F7770]">Create a new menu entry</p>
          </div>
        </div>

        <form
          action={async (formData: FormData) => {
            "use server";
            const label = formData.get("label") as string;
            const href = formData.get("href") as string;
            const location = formData.get("location") as string;

            await prisma.navigationItem.create({
              data: {
                label,
                href,
                location,
                sortOrder: 99,
                visible: true,
              },
            });

            revalidatePath("/", "layout");
            revalidatePath("/admin/navigation");
          }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
              Menu Label *
            </label>
            <input
              type="text"
              name="label"
              required
              placeholder="e.g. Clinical Research"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
              Target URL *
            </label>
            <input
              type="text"
              name="href"
              required
              placeholder="e.g. /programs"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
              Placement
            </label>
            <select
              name="location"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
            >
              <option value="HEADER">HEADER Navigation</option>
              <option value="FOOTER">FOOTER Directory</option>
            </select>
          </div>

          <div className="sm:col-span-3 pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#104D38] hover:bg-[#175840] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Link</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
