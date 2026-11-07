import React from "react";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Calendar, Clock, Phone, Mail, CheckCircle, Save } from "lucide-react";

export const revalidate = 0;

export default async function AdminAppointmentsPage() {
  const appointments = await prisma.appointment.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#779B7C] block">
            SCHEDULING & INTAKE
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#242824] tracking-tight">
            Consultation Requests
          </h1>
          <p className="text-xs sm:text-sm text-[#6F7770] mt-0.5">
            Manage requested telehealth consultations and provider coordination.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-black/5">
          <h2 className="text-sm font-bold text-[#242824]">All Booking Inquiries ({appointments.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9F6] text-[#6F7770] uppercase font-bold border-b border-black/5">
              <tr>
                <th className="py-3 px-6">Patient</th>
                <th className="py-3 px-6">Preferred Date & Time</th>
                <th className="py-3 px-6">Service Area</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-[#242824]">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-4 px-6 font-semibold">
                    <div>{apt.name}</div>
                    <div className="text-[10px] text-[#6F7770]">{apt.email} • {apt.phone}</div>
                  </td>
                  <td className="py-4 px-6 text-[#242824]">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-[#104D38]" />
                      <span>{apt.preferredDate}</span>
                    </div>
                    <div className="text-[10px] text-[#6F7770]">{apt.preferredTime}</div>
                  </td>
                  <td className="py-4 px-6 text-[#6F7770]">
                    {apt.service || "General Consultation"}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <form
                      action={async (formData: FormData) => {
                        "use server";
                        const id = formData.get("id") as string;
                        const status = formData.get("status") as string;
                        await prisma.appointment.update({
                          where: { id },
                          data: { status },
                        });
                        revalidatePath("/admin/appointments");
                      }}
                      className="inline-flex items-center gap-2"
                    >
                      <input type="hidden" name="id" value={apt.id} />
                      <select
                        name="status"
                        defaultValue={apt.status}
                        className="px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-semibold"
                      >
                        <option value="REQUESTED">REQUESTED</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                      <button
                        type="submit"
                        className="px-2.5 py-1 rounded-lg bg-[#104D38] text-white font-bold text-xs hover:bg-[#175840]"
                      >
                        Update
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    No scheduled consultation requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
