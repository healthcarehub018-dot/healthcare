"use client";

import React, { useState } from "react";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { Mail, Phone, MapPin, Clock, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { submitContactMessage } from "@/actions/contact";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const res = await submitContactMessage(formData);

    if (res.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMessage(res.error || "Failed to send message.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9F6] text-[#242824] flex flex-col font-sans">
      <Header transparentOnHero={false} />

      <div className="bg-[#104D38] text-white py-16 sm:py-24 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest uppercase text-[#779B7C] block mb-3">
            GET IN TOUCH
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">
            Connect With Our Care Team
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Have questions about our programs, clinical intake, or partnership opportunities? Reach out below.
          </p>
        </div>
      </div>

      <div className="max-w-medvi mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Contact info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-[#779B7C] block mb-2">
                COORDINATION CHANNELS
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#242824] mb-4">
                We are here to assist your care journey.
              </h2>
              <p className="text-base text-[#6F7770] leading-relaxed">
                Our care concierges and patient coordination specialists respond to all non-emergency inquiries within 24 business hours.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-black/5 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-[#E9F1E8] text-[#104D38] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#104D38]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#242824]">Email Us</h4>
                  <a href="mailto:care@suzzmed.local" className="text-sm text-[#104D38] hover:underline font-medium">
                    care@suzzmed.local
                  </a>
                  <p className="text-xs text-[#6F7770] mt-0.5">Average reply time: under 4 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-black/5 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-[#E9F1E8] text-[#104D38] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#104D38]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#242824]">Call Our Care Team</h4>
                  <p className="text-sm text-[#242824] font-medium">+1 (800) 492-SUZZ</p>
                  <p className="text-xs text-[#6F7770] mt-0.5">Toll-free nationwide</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-black/5 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-[#E9F1E8] text-[#104D38] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#104D38]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#242824]">Support Hours</h4>
                  <p className="text-sm text-[#242824]">Mon – Fri: 8:00 AM – 8:00 PM EST</p>
                  <p className="text-xs text-[#6F7770]">Saturday: 9:00 AM – 5:00 PM EST</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#E9F1E8] text-xs text-[#104D38] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#104D38] shrink-0 mt-0.5" />
              <p>
                <strong>Clinical Privacy Notice:</strong> Do not submit sensitive medical records, laboratory photos, or emergency clinical data through this general inquiry form. For emergencies, please call 911.
              </p>
            </div>
          </div>

          {/* Right Column: Contact form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-black/5 shadow-sm">
              <h3 className="text-2xl font-bold text-[#242824] mb-2">Send a Message</h3>
              <p className="text-sm text-[#6F7770] mb-8">
                Please complete all required fields. We will follow up via your preferred channel.
              </p>

              {status === "success" ? (
                <div className="p-8 rounded-2xl bg-[#E9F1E8] text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#104D38] text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-[#779B7C]" />
                  </div>
                  <h4 className="text-xl font-bold text-[#104D38]">Thank you for reaching out!</h4>
                  <p className="text-sm text-[#242824] max-w-md mx-auto leading-relaxed">
                    Your message has been safely delivered to our care coordination desk. A representative will contact you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="px-6 py-2.5 rounded-full bg-[#104D38] text-white font-semibold text-sm"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {status === "error" && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Jane Doe"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#104D38] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="jane@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#104D38] text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-2">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#104D38] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        required
                        placeholder="Inquiry regarding weight care"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#104D38] text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#242824] mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      placeholder="How can our care team assist you today?"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#104D38] text-sm"
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      required
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-[#104D38] focus:ring-[#104D38]"
                    />
                    <label htmlFor="consent" className="text-xs text-[#6F7770] leading-relaxed">
                      I consent to Suzzmed contacting me regarding my healthcare inquiry at the email or phone number provided. I acknowledge that this form is not intended for medical emergencies.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-4 px-6 rounded-full bg-[#104D38] hover:bg-[#175840] disabled:bg-gray-400 text-white font-bold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>{status === "loading" ? "Sending..." : "Submit Message"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
