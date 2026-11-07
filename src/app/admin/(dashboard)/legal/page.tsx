import React from "react";
import { prisma } from "@/lib/db";
import { saveLegalPage } from "@/actions/cms";
import { Scale, Save, ExternalLink } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function AdminLegalPage({
  searchParams,
}: {
  searchParams?: { slug?: string };
}) {
  const activeSlug = searchParams?.slug || "privacy";

  const [allPages, currentPage] = await Promise.all([
    prisma.legalPage.findMany({ orderBy: { title: "asc" } }),
    prisma.legalPage.findUnique({ where: { slug: activeSlug } }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#779B7C] block">
            REGULATORY POLICIES
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#242824] tracking-tight">
            Legal & Compliance Documents
          </h1>
          <p className="text-xs sm:text-sm text-[#6F7770] mt-0.5">
            Manage terms, privacy notices, and clinical disclaimers.
          </p>
        </div>

        <Link
          href={`/${activeSlug}`}
          target="_blank"
          className="px-4 py-2 rounded-xl bg-white border border-black/10 text-xs font-semibold text-[#242824] hover:bg-gray-50 transition-colors shadow-sm inline-flex items-center gap-1.5"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#104D38]" />
          <span>View Live Page</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {allPages.map((p) => (
          <Link
            key={p.slug}
            href={`/admin/legal?slug=${p.slug}`}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSlug === p.slug
                ? "bg-[#104D38] text-white shadow-sm"
                : "bg-white text-[#242824] hover:bg-gray-100 border border-black/5"
            }`}
          >
            {p.title}
          </Link>
        ))}
      </div>

      {currentPage && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6">
          <form action={saveLegalPage} className="space-y-5">
            <input type="hidden" name="slug" value={currentPage.slug} />

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Document Title
              </label>
              <input
                type="text"
                name="title"
                defaultValue={currentPage.title}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Policy Content (Markdown supported)
              </label>
              <textarea
                name="body"
                rows={16}
                defaultValue={currentPage.body}
                className="w-full font-mono text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#104D38] hover:bg-[#175840] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Policy Content</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
