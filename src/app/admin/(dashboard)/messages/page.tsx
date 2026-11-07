import React from "react";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { MessageSquare, Mail, Phone, Clock, CheckCircle } from "lucide-react";

export const revalidate = 0;

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#779B7C] block">
            PATIENT INBOX
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#242824] tracking-tight">
            Contact Form Submissions
          </h1>
          <p className="text-xs sm:text-sm text-[#6F7770] mt-0.5">
            General patient inquiries, care questions, and communications.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/5">
              <div>
                <span className="text-base font-bold text-[#242824]">{msg.name}</span>
                <div className="flex items-center gap-3 text-xs text-[#6F7770] mt-0.5">
                  <a href={`mailto:${msg.email}`} className="text-[#104D38] hover:underline font-semibold">
                    {msg.email}
                  </a>
                  {msg.phone && <span>• {msg.phone}</span>}
                  <span>• {new Date(msg.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    msg.status === "UNREAD"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {msg.status}
                </span>

                <form
                  action={async () => {
                    "use server";
                    await prisma.contactMessage.update({
                      where: { id: msg.id },
                      data: { status: msg.status === "UNREAD" ? "READ" : "UNREAD" },
                    });
                    revalidatePath("/admin/messages");
                  }}
                >
                  <button
                    type="submit"
                    className="text-xs text-[#104D38] hover:underline font-semibold"
                  >
                    Mark as {msg.status === "UNREAD" ? "Read" : "Unread"}
                  </button>
                </form>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#242824] mb-1">
                Subject: {msg.subject || "General Inquiry"}
              </h4>
              <p className="text-sm text-[#6F7770] leading-relaxed bg-[#F8F9F6] p-4 rounded-xl border border-black/5">
                {msg.message}
              </p>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center text-[#6F7770] border border-black/5">
            No contact messages received yet.
          </div>
        )}
      </div>
    </div>
  );
}
