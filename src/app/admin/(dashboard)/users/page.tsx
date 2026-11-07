import React from "react";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { UserCheck, Plus, Trash2, Shield, Lock } from "lucide-react";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function AdminUsersPage() {
  const currentAdmin = await getCurrentAdmin();
  if (!currentAdmin || currentAdmin.role !== "SUPER_ADMIN") {
    return (
      <div className="p-8 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-sm">
        Access restricted. You must be a Super Administrator to manage administrative staff accounts.
      </div>
    );
  }

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#779B7C] block">
            ACCESS CONTROL
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#242824] tracking-tight">
            Administrative Staff & Clinicians
          </h1>
          <p className="text-xs sm:text-sm text-[#6F7770] mt-0.5">
            Manage administrative personnel, clinical editors, and care support accounts.
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-black/5">
          <h2 className="text-sm font-bold text-[#242824]">Active Admin Users ({users.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9F6] text-[#6F7770] uppercase font-bold border-b border-black/5">
              <tr>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-[#242824]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#104D38] text-white flex items-center justify-center font-bold text-xs">
                      {u.name[0]}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="py-4 px-6 font-mono text-[#6F7770]">{u.email}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.role === "SUPER_ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : u.role === "EDITOR"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-emerald-700 font-semibold text-[10px]">
                      ● Active
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-[#6F7770]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E9F1E8] text-[#104D38] flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#242824]">Add Administrator Account</h3>
            <p className="text-xs text-[#6F7770]">Grant administrative or coordinator portal access</p>
          </div>
        </div>

        <form
          action={async (formData: FormData) => {
            "use server";
            const name = formData.get("name") as string;
            const email = (formData.get("email") as string).toLowerCase().trim();
            const password = formData.get("password") as string;
            const role = formData.get("role") as string;

            const passwordHash = await bcrypt.hash(password, 10);
            await prisma.adminUser.create({
              data: {
                name,
                email,
                passwordHash,
                role: role || "EDITOR",
                active: true,
              },
            });

            revalidatePath("/admin/users");
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Staff Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Dr. Emily Hayes"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="emily@suzzmed.local"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Initial Password *
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="Minimum 8 characters"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Role & Permissions
              </label>
              <select
                name="role"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              >
                <option value="EDITOR">EDITOR (Content, Services, FAQs, Reviews)</option>
                <option value="SUPPORT">SUPPORT (Leads, Appointments, Messages only)</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN (Full platform permissions)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#104D38] hover:bg-[#175840] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Staff Member</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
