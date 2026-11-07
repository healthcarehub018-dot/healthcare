import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

interface HomeFooterProps {
  settings?: Record<string, string>;
}

const LEGAL_LINKS = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Privacy Practices", href: "/privacy#privacy-practices" },
  { label: "Medical Consent", href: "/medical-disclaimer" },
  { label: "Refund Policy", href: "/terms#refund-policy" },
  { label: "For California Residents", href: "/privacy#california" },
  { label: "Bill of Rights", href: "/terms#bill-of-rights" },
];

const MOBILE_LINKS = [
  { label: "Weight Care", href: "/weight-loss" },
  { label: "Women's Health", href: "/services/womens-wellness" },
  { label: "Metabolic Nutrition", href: "/services/nutrition-lifestyle" },
  { label: "Supplements", href: "/programs" },
  { label: "Men's Health", href: "/services/mens-wellness" },
  { label: "Peptides & Longevity", href: "/services/peptides-longevity" },
  { label: "Hair Regrowth", href: "/services/hair-wellness" },
  { label: "Skincare", href: "/services/skincare-aesthetics" },
];

export function HomeFooter({ settings = {} }: HomeFooterProps) {
  const currentYear = new Date().getFullYear();
  const siteName = settings.site_name || "Suzzmed Healthcare";
  const wordmark = settings.site_name ? settings.site_name.split(" ")[0] : "Suzzmed";
  const contactEmail = settings.contact_email || "care@suzzmed.local";
  const contactPhone = settings.contact_phone || "+1 (800) 492-SUZZ";
  const contactAddress =
    settings.contact_address || "500 Healthcare Way, Suite 400, Austin, TX 78701";
  const phoneHref = `tel:${contactPhone.replace(/[^\d+]/g, "")}`;

  return (
    <footer className="bg-white text-ink">
      <div className="mx-auto max-w-[1060px] px-6 py-14 lg:px-0 lg:pb-[110px] lg:pt-[60px]">
        {/* Wordmark + contact pills */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <Link
            href="/"
            className="text-[30px] font-bold leading-none tracking-[-0.045em] text-ink transition-opacity hover:opacity-70"
            aria-label={`${wordmark} home`}
          >
            {wordmark}
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-nowrap lg:justify-end">
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex h-[52px] items-center gap-3 rounded-full bg-[#F5F4F2] px-6 text-[13px] font-medium text-ink transition-colors hover:bg-[#EDEBE8]"
            >
              <Mail className="h-[18px] w-[18px]" strokeWidth={1.8} />
              <span>{contactEmail}</span>
            </a>
            <a
              href={phoneHref}
              className="inline-flex h-[52px] items-center gap-3 rounded-full bg-[#F5F4F2] px-6 text-[13px] font-medium text-ink transition-colors hover:bg-[#EDEBE8]"
            >
              <Phone className="h-[18px] w-[18px]" strokeWidth={1.8} />
              <span>{contactPhone}</span>
            </a>
            <span className="inline-flex min-h-[52px] max-w-full items-center gap-3 rounded-full bg-[#F5F4F2] px-6 py-2 text-[13px] font-medium leading-[18px] text-ink">
              <MapPin className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />
              <span>{contactAddress}</span>
            </span>
          </div>
        </div>

        {/* Mobile quick links, mirroring the reference's small-screen footer */}
        <nav
          className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-black/[0.08] py-6 lg:hidden"
          aria-label="Care programs"
        >
          {MOBILE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] leading-[20px] text-ink/80 transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Legal disclosures */}
        <div className="mt-14 space-y-6 text-[12.5px] leading-[1.7] text-ink sm:text-[13px]">
          <p>
            <strong className="font-semibold">Telehealth disclosure.</strong> The assessment made
            available on the {siteName} website does not create a doctor-patient relationship
            between the individual completing the assessment and {siteName}. A licensed clinician
            will meet with an individual after intake to determine whether a prescription is
            appropriate. The clinician retains the decision to prescribe any treatment, and not
            every individual will qualify. Program participation and any prescription medication
            are subject to clinical approval following a comprehensive telehealth intake.
          </p>

          <p>
            <strong className="font-semibold">About program information.</strong> Content on this
            website is provided for informational and educational purposes only and does not
            constitute medical advice, diagnosis, or clinical treatment. Always consult a qualified
            healthcare professional with questions about a medical condition, medication, or
            treatment plan. If you are experiencing a medical emergency, call 911 immediately.
          </p>

          <p>
            <strong className="font-semibold">Pharmacy & fulfillment.</strong> Prescriptions, where
            clinically appropriate and permitted by state law, are dispensed by state-licensed
            pharmacies. {siteName} does not manufacture medications and does not act as a pharmacy.
            Compounded medications are not FDA-approved or evaluated for safety, efficacy, or
            quality. The decision to use a compounded medication is guided by the licensed
            provider&rsquo;s medical judgment, which is informed by a telehealth consultation and
            medical history.
          </p>

          <p>
            <strong className="font-semibold">Results & testimonials.</strong> Individual results
            vary based on starting point, clinical appropriateness, and adherence to a care plan.
            Nothing on this website should be interpreted as a guarantee of a particular outcome.
            Testimonials reflect individual experiences and are not a guarantee of results. Images
            representing testimonials may include models or stock photography, and certain
            materials on this website may be generated or enhanced using artificial intelligence
            technologies.
          </p>

          <p>
            <strong className="font-semibold">Privacy & security.</strong> {siteName} is committed
            to protecting the confidentiality of the health information you share with us. We use
            administrative, technical, and physical safeguards designed to protect personal
            information, and we limit access to those who need it to provide care and support. You
            can review how information is collected, used, and disclosed in our{" "}
            <Link href="/privacy" className="underline decoration-black/25 underline-offset-2 hover:text-accent">
              Privacy Policy
            </Link>
            .
          </p>

          <p>
            By accepting our Terms of Use, you understand and agree that {siteName} is not acting
            as a pharmacy and does not control or interfere with pharmacy services. You may be
            entering into a relationship with a pharmacy, pharmacist, or pharmacy group as part of
            your care. Partner pharmacies are licensed in the states where they operate and are
            responsible for dispensing and shipping prescription products.
          </p>

          <div>
            <p>
              <strong className="font-semibold">Pharmacy partners.</strong> Prescriptions are
              fulfilled through a network of state-licensed pharmacy partners. Partner
              requirements include:
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-6">
              <li>Active licensure in the states where they dispense</li>
              <li>Compliance with applicable state and federal requirements</li>
              <li>Secure, temperature-appropriate packaging and shipping</li>
              <li>Direct coordination with your care team when questions arise</li>
            </ul>
          </div>

          <p>
            <strong className="font-semibold">Prescription safety.</strong> Before starting any
            treatment, tell your clinician about all medications, supplements, allergies, and
            medical conditions. Do not start, stop, or change a prescription without speaking with
            your provider. Seek immediate medical attention if you experience a serious reaction or
            any symptom that concerns you.
          </p>

          <p>
            <strong className="font-semibold">Accessibility.</strong> We are committed to making our
            website and services usable by as many people as possible. If you need assistance
            accessing content, completing an intake, or communicating with our care team, contact
            us and we will work with you to provide a reasonable accommodation.
          </p>

          <p>
            <strong className="font-semibold">Non-discrimination.</strong> {siteName} does not
            discriminate on the basis of race, color, national origin, religion, sex, gender
            identity, sexual orientation, age, disability, or any other characteristic protected by
            applicable law. Care is provided without unlawful discrimination, and language
            assistance is available on request.
          </p>

          <p>
            <strong className="font-semibold">Your rights.</strong> You have the right to be treated
            with respect, to receive clear information about your care, to ask questions, to
            request access to your records, and to make informed decisions about treatment. You may
            also ask how your information is used and disclosed, request an amendment, or request
            restrictions as described in our privacy practices.
          </p>

          <p>
            <strong className="font-semibold">Website use.</strong> This website is provided on an
            &ldquo;as is&rdquo; basis for general information. External links are provided for
            convenience and do not imply endorsement. We may update content, services, and these
            disclosures from time to time, and the version posted here is the current version.
          </p>

          <p>
            <strong className="font-semibold">Contact.</strong> Questions about your care, an order,
            or this website can be directed to{" "}
            <a href={`mailto:${contactEmail}`} className="underline decoration-black/25 underline-offset-2 hover:text-accent">
              {contactEmail}
            </a>{" "}
            or{" "}
            <a href={phoneHref} className="underline decoration-black/25 underline-offset-2 hover:text-accent">
              {contactPhone}
            </a>
            . Our care team is available during the hours listed on our{" "}
            <Link href="/contact" className="underline decoration-black/25 underline-offset-2 hover:text-accent">
              contact page
            </Link>
            .
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-5 border-t border-black/[0.12] pt-6 text-[11.5px] text-ink/75 lg:flex-row lg:items-center lg:justify-between">
          <p>
            &copy; {currentYear} {siteName}. All rights reserved.
          </p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Legal">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Compliance badge */}
        <div className="mt-9">
          <div
            className="inline-flex h-[92px] w-[86px] flex-col items-center justify-center gap-1.5 rounded-[16px] bg-[#10233F] text-white"
            aria-label="Secure patient portal"
          >
            <ShieldCheck className="h-8 w-8 text-[#8FC7AC]" strokeWidth={1.6} />
            <span className="px-2 text-center text-[8px] font-semibold uppercase leading-[11px] tracking-[0.6px] text-white/85">
              Secure patient portal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
