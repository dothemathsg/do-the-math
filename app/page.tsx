import Hero from "@/components/home/Hero";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Do The Math — Singapore Personal Finance",
  description:
    "Singapore's personal finance platform. Compare mortgage rates, calculate stamp duty, track property prices, and make smarter financial decisions — no jargon, no conflict of interest.",
  alternates: { canonical: "https://www.dothemath.sg" },
  openGraph: {
    title: "Do The Math — Singapore Personal Finance",
    description:
      "Singapore's personal finance platform. Compare mortgage rates, calculate stamp duty, track property prices, and make smarter financial decisions.",
    url: "https://www.dothemath.sg",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Do The Math",
  url: "https://www.dothemath.sg",
  description: "Singapore personal finance platform — mortgage rates, stamp duty calculator, property prices, insurance, and investments.",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: "https://www.dothemath.sg/articles?q={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

export default function Home() {
  return (
    <div className="space-y-16 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <Hero />
    </div>
  );
}
