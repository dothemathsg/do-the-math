import "./globals.css";

import type { Metadata } from "next";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Do The Math",
  description:
    "Helping Singaporeans make better property decisions.",
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
      </body>
    </html>
  );
}