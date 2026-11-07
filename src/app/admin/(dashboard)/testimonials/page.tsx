import React from "react";
import { prisma } from "@/lib/db";
import { saveTestimonial, deleteTestimonial } from "@/actions/cms";
import { Star, ShieldCheck, Plus, Trash2, Quote } from "lucide-react";

export const revalidate = 0;

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#779B7C] block">
            PATIENT ADVOCACY & SOCIAL PROOF
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#242824] tracking-tight">
            Member Reviews & Outcomes
          </h1>
          <p className="text-xs sm:text-sm text-[#6F7770] mt-0.5">
            Manage authentic, consent-verified patient testimonials and feedback.
          </p>
        </div>
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-[#C8AC72]">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      t.status === "PUBLISHED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {t.status}
                  </span>
                  {t.consentVerified ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Consent Verified</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                      Awaiting Consent
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#242824] italic mb-4">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3">
                {t.image ? (
                  <img src={t.image} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#104D38] text-white flex items-center justify-center font-bold text-sm">
                    {t.name[0]}
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-[#242824]">{t.name}</h4>
                  <span className="text-[10px] text-[#6F7770]">{t.roleOrLocation || "Patient"} • {t.serviceCategory || "General Care"}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-black/5 flex justify-end">
              <form
                action={async () => {
                  "use server";
                  await deleteTestimonial(t.id);
                }}
              >
                <button
                  type="submit"
                  className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {/* Add Testimonial Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E9F1E8] text-[#104D38] flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#242824]">Add Patient Testimonial</h3>
            <p className="text-xs text-[#6F7770]">Add approved feedback with verified written consent</p>
          </div>
        </div>

        <form action={saveTestimonial} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Patient Name / Initials *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Rachel K."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Location or Role
              </label>
              <input
                type="text"
                name="roleOrLocation"
                placeholder="e.g. Austin, TX • Verified Patient"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Service Category
              </label>
              <input
                type="text"
                name="serviceCategory"
                placeholder="e.g. Weight Management"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
              Patient Quote *
            </label>
            <textarea
              name="quote"
              rows={3}
              required
              placeholder="Detailed description of clinical experience, empathy, and outcomes..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Avatar Photo URL (Optional)
              </label>
              <input
                type="url"
                name="image"
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Rating (1 to 5 Stars)
              </label>
              <select
                name="rating"
                defaultValue="5"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              >
                <option value="5">★★★★★ (5 Stars)</option>
                <option value="4">★★★★☆ (4 Stars)</option>
                <option value="3">★★★☆☆ (3 Stars)</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#E9F1E8]/60 border border-[#104D38]/15 space-y-3">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs font-semibold text-[#242824]">
              <input
                type="checkbox"
                name="consentVerified"
                value="true"
                required
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#104D38] focus:ring-[#104D38]"
              />
              <span>
                <strong>Written Patient Consent Verified:</strong> I verify that explicit written patient consent and authorization has been obtained to publish this testimonial and portrait in accordance with healthcare privacy regulations.
              </span>
            </label>

            <input type="hidden" name="status" value="PUBLISHED" />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#104D38] hover:bg-[#175840] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Verified Review</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
