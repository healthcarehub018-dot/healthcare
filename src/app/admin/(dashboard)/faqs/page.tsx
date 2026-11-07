import React from "react";
import { prisma } from "@/lib/db";
import { saveFAQ, deleteFAQ } from "@/actions/cms";
import { Plus, Trash2, HelpCircle } from "lucide-react";

export const revalidate = 0;

export default async function AdminFaqsPage() {
  const faqs = await prisma.fAQ.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#779B7C] block">
            PATIENT EDUCATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#242824] tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-[#6F7770] mt-0.5">
            Manage clinical transparency, pricing explanations, and intake answers.
          </p>
        </div>
      </div>

      {/* FAQ Table */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-black/5 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#242824]">All Questions ({faqs.length})</h2>
        </div>

        <div className="divide-y divide-black/5 text-xs">
          {faqs.map((faq) => (
            <div key={faq.id} className="p-5 hover:bg-gray-50/80 transition-colors flex items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#E9F1E8] text-[#104D38] font-bold text-[10px] uppercase">
                    {faq.category || "General"}
                  </span>
                  <span className="text-[10px] text-[#6F7770]">Page: {faq.pageKey}</span>
                  {faq.published ? (
                    <span className="text-emerald-700 font-semibold text-[10px]">● Published</span>
                  ) : (
                    <span className="text-gray-400 font-semibold text-[10px]">● Draft</span>
                  )}
                </div>
                <h4 className="font-bold text-sm text-[#242824]">{faq.question}</h4>
                <p className="text-[#6F7770] leading-relaxed line-clamp-2">{faq.answer}</p>
              </div>

              <form
                action={async () => {
                  "use server";
                  await deleteFAQ(faq.id);
                }}
              >
                <button
                  type="submit"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>

      {/* Add FAQ Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E9F1E8] text-[#104D38] flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#242824]">Add FAQ Entry</h3>
            <p className="text-xs text-[#6F7770]">Provide clear answers for prospective members</p>
          </div>
        </div>

        <form action={saveFAQ} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Category
              </label>
              <input
                type="text"
                name="category"
                defaultValue="General"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Page Association
              </label>
              <select
                name="pageKey"
                defaultValue="all"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              >
                <option value="all">All Pages (Sitewide)</option>
                <option value="home">Homepage Only</option>
                <option value="weight-loss">Weight Loss Page Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
              Question *
            </label>
            <input
              type="text"
              name="question"
              required
              placeholder="e.g. Can I use HSA or FSA funds for program memberships?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
              Answer *
            </label>
            <textarea
              name="answer"
              rows={4}
              required
              placeholder="Clear, medically transparent answer..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#242824]">
              <input
                type="checkbox"
                name="published"
                value="true"
                defaultChecked
                className="h-4 w-4 rounded border-gray-300 text-[#104D38] focus:ring-[#104D38]"
              />
              <span>Published on live site</span>
            </label>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#104D38] hover:bg-[#175840] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Save FAQ</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
