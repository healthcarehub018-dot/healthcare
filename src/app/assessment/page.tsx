"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Target,
  Sparkles,
  Heart,
  Activity,
  Apple,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import { submitAssessmentInquiry } from "@/actions/assessment";

function AssessmentWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialInterest = searchParams.get("interest") || "";

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Form State
  const [formData, setFormData] = useState({
    areaOfInterest: "",
    mainGoal: "",
    preferredContact: "email",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    consentAccepted: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Map initial interest
  useEffect(() => {
    if (initialInterest) {
      const map: Record<string, string> = {
        "weight-loss": "Weight Management",
        "weight-management": "Weight Management",
        "peptides-longevity": "Peptides & Longevity",
        "mens-wellness": "Men's Wellness",
        "womens-wellness": "Women's Wellness",
        nutrition: "Nutrition & Lifestyle",
        "nutrition-lifestyle": "Nutrition & Lifestyle",
      };
      if (map[initialInterest]) {
        setFormData((prev) => ({ ...prev, areaOfInterest: map[initialInterest] }));
      }
    }
  }, [initialInterest]);

  // Step 1 Options
  const interestOptions = [
    { title: "Weight Management", desc: "Metabolic care, GLP-1 therapy & lifestyle support", icon: Target },
    { title: "Men's Wellness", desc: "Energy, hormone balance, stamina & vitality", icon: Activity },
    { title: "Women's Wellness", desc: "Endocrine balance, perimenopause & whole-life health", icon: Heart },
    { title: "Nutrition & Lifestyle", desc: "Chef-designed meal frameworks & dietitian coaching", icon: Apple },
    { title: "Peptides & Longevity", desc: "Restorative cellular protocols & vitality benchmarks", icon: Sparkles },
    { title: "General Inquiry / Not Sure", desc: "Help me explore what options fit my current health goals", icon: HelpCircle },
  ];

  // Step 2 Options
  const goalOptions = [
    "Explore available medical & lifestyle programs",
    "Partner with a licensed healthcare clinician",
    "Build sustainable everyday metabolic habits",
    "Discuss transparent pricing and membership options",
    "Speak directly with a patient care concierge",
  ];

  const handleNext = () => {
    setError("");
    if (step === 1 && !formData.areaOfInterest) {
      setError("Please select an area of interest to continue.");
      return;
    }
    if (step === 2 && !formData.mainGoal) {
      setError("Please select your primary goal to continue.");
      return;
    }
    if (step === 3 && !formData.preferredContact) {
      setError("Please select your contact preference.");
      return;
    }
    if (step === 4) {
      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
        setError("Please provide your first name, last name, and a valid email.");
        return;
      }
      if (!formData.email.includes("@")) {
        setError("Please provide a valid email address.");
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const handlePrev = () => {
    setError("");
    if (step > 1) {
      setStep((s) => s - 1);
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!formData.consentAccepted) {
      setError("Please confirm your consent to continue.");
      return;
    }

    setIsSubmitting(true);

    const res = await submitAssessmentInquiry({
      ...formData,
      source: "assessment_multi_step",
    });

    if (res.success && res.referenceCode) {
      router.push(`/assessment/success?ref=${res.referenceCode}&interest=${encodeURIComponent(formData.areaOfInterest)}`);
    } else {
      setIsSubmitting(false);
      setError(res.error || "An error occurred during submission. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex-1">
      {/* Progress Bar & Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9F1E8] text-[#104D38] text-xs font-bold uppercase tracking-wider mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-[#779B7C]" />
          <span>Non-Clinical Care Intake</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#242824] tracking-tight mb-2">
          Personalized Health Intake
        </h1>
        <p className="text-sm text-[#6F7770]">
          Step {step} of {totalSteps}
        </p>

        {/* Visual Progress Bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-[#104D38] h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Wizard Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-black/5">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Area of Interest */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#242824] mb-2">
                What would you like support with?
              </h2>
              <p className="text-sm text-[#6F7770]">
                Choose the primary health category you would like to explore.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {interestOptions.map((opt) => {
                const isSelected = formData.areaOfInterest === opt.title;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.title}
                    type="button"
                    onClick={() => setFormData({ ...formData, areaOfInterest: opt.title })}
                    className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-[#104D38] bg-[#E9F1E8]/60 ring-2 ring-[#104D38]"
                        : "border-gray-200 hover:border-[#104D38]/40 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isSelected ? "bg-[#104D38] text-white" : "bg-gray-100 text-[#104D38]"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          isSelected
                            ? "bg-[#104D38] border-[#104D38] text-white"
                            : "border-gray-300 text-transparent"
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#242824] mb-0.5">{opt.title}</h3>
                      <p className="text-xs text-[#6F7770]">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Main Goal */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#242824] mb-2">
                What is your main priority?
              </h2>
              <p className="text-sm text-[#6F7770]">
                Let us know what outcome or guidance matters most to you right now.
              </p>
            </div>

            <div className="space-y-3">
              {goalOptions.map((goal) => {
                const isSelected = formData.mainGoal === goal;
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setFormData({ ...formData, mainGoal: goal })}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-[#104D38] bg-[#E9F1E8]/60 ring-2 ring-[#104D38]"
                        : "border-gray-200 hover:border-[#104D38]/40 hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-semibold text-sm text-[#242824]">{goal}</span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                        isSelected
                          ? "bg-[#104D38] border-[#104D38] text-white"
                          : "border-gray-300 text-transparent"
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Contact Preference */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#242824] mb-2">
                How would you prefer our care team to follow up?
              </h2>
              <p className="text-sm text-[#6F7770]">
                We respect your time and privacy.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: "email", label: "Email Only", desc: "Detailed program summaries sent to your inbox" },
                { id: "phone", label: "Phone Call", desc: "Brief introductory phone conversation" },
                { id: "either", label: "Either Channel", desc: "Whichever is most convenient" },
              ].map((c) => {
                const isSelected = formData.preferredContact === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredContact: c.id })}
                    className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-[#104D38] bg-[#E9F1E8]/60 ring-2 ring-[#104D38]"
                        : "border-gray-200 hover:border-[#104D38]/40 hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-bold text-sm text-[#242824] mb-1">{c.label}</span>
                    <p className="text-xs text-[#6F7770]">{c.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Contact Details */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#242824] mb-2">
                Your Contact Information
              </h2>
              <p className="text-sm text-[#6F7770]">
                We use this information solely to coordinate your care review.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g. Alex"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#104D38] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g. Morgan"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#104D38] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#104D38] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-1.5">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#104D38] text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Additional Notes */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#242824] mb-2">
                Any specific questions for the care team?
              </h2>
              <p className="text-sm text-[#6F7770]">
                Optional: Share anything specific about your schedule, past experience, or goals.
              </p>
            </div>

            <div>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="e.g. Interested in learning whether telehealth consultations are covered by HSA/FSA or how follow-up check-ins are structured..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#104D38] text-sm"
              />
            </div>
          </div>
        )}

        {/* STEP 6: Review & Consent */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#242824] mb-2">
                Review & Confirm Consent
              </h2>
              <p className="text-sm text-[#6F7770]">
                Please review your selected inquiry before final transmission to our clinical desk.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8F9F6] border border-black/5 space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-black/5">
                <span className="text-[#6F7770]">Interest:</span>
                <span className="font-bold text-[#242824]">{formData.areaOfInterest}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/5">
                <span className="text-[#6F7770]">Goal:</span>
                <span className="font-bold text-[#242824] text-right max-w-xs">{formData.mainGoal}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/5">
                <span className="text-[#6F7770]">Name:</span>
                <span className="font-bold text-[#242824]">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/5">
                <span className="text-[#6F7770]">Email:</span>
                <span className="font-bold text-[#242824]">{formData.email}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#6F7770]">Contact Preference:</span>
                <span className="font-bold text-[#242824] capitalize">{formData.preferredContact}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#E9F1E8]/50 border border-[#104D38]/15">
              <input
                type="checkbox"
                id="consentCheck"
                checked={formData.consentAccepted}
                onChange={(e) => setFormData({ ...formData, consentAccepted: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#104D38] focus:ring-[#104D38]"
              />
              <label htmlFor="consentCheck" className="text-xs text-[#242824] leading-relaxed cursor-pointer">
                I acknowledge that this intake is non-clinical and does not establish a formal doctor-patient relationship until an independent licensed clinician conducts an evaluation. I consent to Suzzmed contacting me regarding my inquiry.
              </label>
            </div>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-[#242824] hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-3.5 rounded-full bg-[#104D38] hover:bg-[#175840] text-white text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.consentAccepted}
              className="px-9 py-3.5 rounded-full bg-[#104D38] hover:bg-[#175840] disabled:bg-gray-300 text-white text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <span>{isSubmitting ? "Transmitting..." : "Submit Inquiry"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-[#F8F9F6] text-[#242824] flex flex-col font-sans">
      <Header transparentOnHero={false} />
      <Suspense fallback={<div className="p-12 text-center text-[#6F7770]">Loading assessment...</div>}>
        <AssessmentWizardContent />
      </Suspense>
      <Footer />
    </div>
  );
}
