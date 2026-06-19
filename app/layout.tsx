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
    default: "Do The Math — Singapore Property & Mortgage Tools",
    template: "%s | Do The Math",
  },
  description:
    "Singapore's property finance platform. Compare live mortgage rates, calculate BSD & ABSD stamp duty, explore property prices by district, and learn with expert guides.",
  keywords: ["Singapore mortgage rates", "HDB BTO", "stamp duty calculator", "ABSD", "BSD", "property prices Singapore", "SORA home loan"],
  authors: [{ name: "Do The Math", url: "https://www.dothemath.sg" }],
  openGraph: {
    type: "website",
    locale: "en_SG",
    url: "https://www.dothemath.sg",
    siteName: "Do The Math",
    title: "Do The Math — Singapore Property & Mortgage Tools",
    description:
      "Compare live mortgage rates, calculate stamp duty, explore property prices by district, and make smarter property decisions in Singapore.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Do The Math" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Do The Math — Singapore Property & Mortgage Tools",
    description:
      "Compare live mortgage rates, calculate stamp duty, explore property prices by district, and make smarter property decisions in Singapore.",
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