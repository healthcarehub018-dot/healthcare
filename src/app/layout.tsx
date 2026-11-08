import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suzzmed.local";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Suzzmed Healthcare | Care Designed Around You",
  description:
    "Evidence-informed telehealth programs tailored to medical weight management, men's vitality, women's hormonal balance, and cellular longevity.",
  keywords: [
    "telehealth",
    "weight management",
    "GLP-1",
    "men's vitality",
    "women's wellness",
    "metabolic care",
    "doctor consultations",
  ],
  authors: [{ name: "Suzzmed Clinical Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased min-h-screen bg-[#F8F9F6] text-[#242824]">
        {children}
      </body>
    </html>
  );
}
