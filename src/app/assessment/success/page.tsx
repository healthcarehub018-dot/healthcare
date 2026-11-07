import React, { Suspense } from "react";
import Link from "next/link";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { CheckCircle2, ShieldCheck, Clock, Calendar, ArrowRight } from "lucide-react";

export const revalidate = 0;

function SuccessContent({ searchParams }: { searchParams?: { ref?: string; interest?: string } }) {
  const reference = searchParams?.ref || "SUZZ-2026-CONFIRMED";
  const interest = searchParams?.interest || "Personalized Healthcare";

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center flex-1">
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-black/5">
        <div className="w-16 h-16 rounded-full bg-[#E9F1E8] text-[#104D38] flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-[#104D38]" />
        </div>

        <span className="text-xs font-bold tracking-widest uppercase text-[#779B7C] block mb-2">
          INQUIRY RECEIVED
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#242824] tracking-tight mb-4">
          Thank you for trusting Suzzmed.
        </h1>

        <p className="text-base text-[#6F7770] leading-relaxed mb-8">
          Your initial care intake has been securely transmitted to our clinical desk. A care concierge will review your goals and reach out with next steps.
        </p>

        {/* Reference Code Box */}
        <div className="p-4 rounded-2xl bg-[#F8F9F6] border border-black/5 mb-8">
          <span className="text-xs text-[#6F7770] block uppercase font-semibold">Your Reference Code</span>
          <span className="text-xl sm:text-2xl font-mono font-bold text-[#104D38] tracking-wider block mt-1">
            {reference}
          </span>
          <span className="text-[11px] text-[#6F7770] block mt-1">
            Keep this reference code for future communications.
          </span>
        </div>

        {/* What happens next */}
        <div className="text-left space-y-4 mb-8 p-5 rounded-2xl bg-[#E9F1E8]/40 border border-[#104D38]/10 text-xs text-[#242824]">
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-[#104D38] shrink-0 mt-0.5" />
            <p><strong>Timeline:</strong> An intake coordinator reviews profiles within 24 business hours.</p>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-[#104D38] shrink-0 mt-0.5" />
            <p><strong>Telehealth Matching:</strong> If clinically appropriate, you will receive an invitation to select a telemedicine appointment slot.</p>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-[#104D38] shrink-0 mt-0.5" />
            <p><strong>Discretion:</strong> All communications occur via encrypted, confidential channels.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#104D38] hover:bg-[#175840] text-white text-sm font-semibold transition-all shadow-sm"
          >
            Return to Homepage
          </Link>
          <Link
            href="/programs"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gray-100 hover:bg-gray-200 text-[#242824] text-sm font-semibold transition-all"
          >
            Browse Programs
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AssessmentSuccessPage({
  searchParams,
}: {
  searchParams?: { ref?: string; interest?: string };
}) {
  return (
    <div className="min-h-screen bg-[#F8F9F6] text-[#242824] flex flex-col font-sans">
      <Header transparentOnHero={false} />
      <Suspense fallback={<div className="p-12 text-center text-[#6F7770]">Loading...</div>}>
        <SuccessContent searchParams={searchParams} />
      </Suspense>
      <Footer />
    </div>
  );
}
