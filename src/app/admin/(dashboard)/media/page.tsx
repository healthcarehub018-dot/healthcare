import React from "react";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Image as ImageIcon, Plus, Trash2, Copy, ExternalLink } from "lucide-react";

export const revalidate = 0;

export default async function AdminMediaPage() {
  const media = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#779B7C] block">
            VISUAL ASSETS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#242824] tracking-tight">
            Media Library
          </h1>
          <p className="text-xs sm:text-sm text-[#6F7770] mt-0.5">
            Store and manage medical photography, product stills, lifestyle portraits, and banners.
          </p>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {media.map((asset) => (
          <div
            key={asset.id}
            className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden flex flex-col justify-between group"
          >
            <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
              <img
                src={asset.url}
                alt={asset.alt || asset.filename}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            <div className="p-4 space-y-2 text-xs">
              <p className="font-bold text-[#242824] truncate" title={asset.filename}>
                {asset.filename}
              </p>
              <p className="text-[#6F7770] text-[10px]">
                {Math.round(asset.sizeBytes / 1024)} KB • {asset.mimeType}
              </p>

              <div className="pt-2 border-t border-black/5 flex items-center justify-between">
                <a
                  href={asset.url}
                  target="_blank"
                  className="text-[#104D38] font-semibold hover:underline flex items-center gap-1 text-[11px]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open</span>
                </a>

                <form
                  action={async () => {
                    "use server";
                    await prisma.mediaAsset.delete({ where: { id: asset.id } });
                    revalidatePath("/admin/media");
                  }}
                >
                  <button
                    type="submit"
                    className="text-red-500 hover:text-red-700"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}

        {media.length === 0 && (
          <div className="col-span-full py-16 bg-white rounded-2xl border border-black/5 text-center text-[#6F7770] text-xs">
            No media assets in library yet. Add your first clinical photo below.
          </div>
        )}
      </div>

      {/* Add Media Item */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E9F1E8] text-[#104D38] flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#242824]">Register Media Asset</h3>
            <p className="text-xs text-[#6F7770]">Add an optimized image URL to the library</p>
          </div>
        </div>

        <form
          action={async (formData: FormData) => {
            "use server";
            const filename = formData.get("filename") as string;
            const url = formData.get("url") as string;
            const alt = formData.get("alt") as string;
            const mimeType = (formData.get("mimeType") as string) || "image/jpeg";

            await prisma.mediaAsset.create({
              data: {
                filename,
                url,
                alt,
                mimeType,
                sizeBytes: 250000,
              },
            });
            revalidatePath("/admin/media");
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Asset Name / File Label *
              </label>
              <input
                type="text"
                name="filename"
                required
                placeholder="e.g. metabolic-nutrition-bowl.jpg"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                Alt Text (Accessibility)
              </label>
              <input
                type="text"
                name="alt"
                placeholder="e.g. Healthy balanced meal prepared for metabolic program"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
              Image URL *
            </label>
            <input
              type="url"
              name="url"
              required
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#104D38]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#104D38] hover:bg-[#175840] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Library</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
