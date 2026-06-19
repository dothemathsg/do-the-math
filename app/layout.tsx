import "./globals.css";

import type { Metadata } from "next";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dothemath.sg"),
  title: {
    default: "Do The Math — Singapore Personal Finance",
    template: "%s | Do The Math",
  },
  description:
    "Singapore's personal finance platform. Compare mortgage rates, calculate stamp duty, track property prices, and make smarter decisions across every major financial milestone.",
  keywords: ["Singapore personal finance", "mortgage rates Singapore", "stamp duty calculator", "ABSD", "BSD", "property prices Singapore", "SORA home loan", "HDB BTO"],
  authors: [{ name: "Do The Math", url: "https://www.dothemath.sg" }],
  openGraph: {
    type: "website",
    locale: "en_SG",
    url: "https://www.dothemath.sg",
    siteName: "Do The Math",
    title: "Do The Math — Singapore Personal Finance",
    description:
      "Singapore's personal finance platform. Compare mortgage rates, calculate stamp duty, track property prices, and make smarter financial decisions.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Do The Math" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Do The Math — Singapore Personal Finance",
    description:
      "Singapore's personal finance platform. Compare mortgage rates, calculate stamp duty, track property prices, and make smarter financial decisions.",
    images: ["/og-default.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.dothemath.sg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans light", geist.variable)}>
      <body className="bg-white text-neutral-900 antialiased">
        <div className="min-h-screen flex flex-col">
          <Navbar />

          <main className="flex-1">
            <div className="mx-auto w-full max-w-6xl px-4">
              {children}
            </div>
          </main>

          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}