import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Do The Math is Singapore's personal finance platform — mortgage rates, stamp duty, property prices, and more. No jargon, no conflict of interest.",
  alternates: { canonical: "https://www.dothemath.sg/about" },
  openGraph: {
    title: "About Do The Math",
    description:
      "Do The Math is Singapore's personal finance platform — mortgage rates, stamp duty, property prices, and more. No jargon, no conflict of interest.",
    url: "https://www.dothemath.sg/about",
  },
};

const TOOLS = [
  {
    href: "/mortgage-rates",
    label: "Mortgage Rates",
    desc: "Live rates from every major Singapore bank, updated daily.",
  },
  {
    href: "/calculator",
    label: "Stamp Duty Calculator",
    desc: "Instant BSD and ABSD figures for any purchase price and buyer profile.",
  },
  {
    href: "/property-prices",
    label: "Property Prices",
    desc: "Transaction data by district — see what homes are actually selling for.",
  },
  {
    href: "/articles",
    label: "Guides",
    desc: "Plain-English explainers on TDSR, CPF usage, BTO, and more.",
  },
];

const COMING_SOON = [
  { label: "Insurance", desc: "Compare home, life, car, and travel policies side by side." },
  { label: "Investments", desc: "Brokerages, robo-advisors, and platforms reviewed and compared." },
];

export default function AboutPage() {
  return (
    <div className="py-16 max-w-2xl">
      <h1 className="text-3xl font-semibold text-neutral-900">About Do The Math</h1>

      <div className="mt-8 space-y-5 text-neutral-600 leading-relaxed">
        <p>
          Every major financial decision in Singapore comes with a spreadsheet's worth
          of numbers — mortgage rates, stamp duties, TDSR limits, insurance premiums,
          brokerage fees. The information is out there, but it's scattered across bank
          websites, government portals, and documents designed for compliance, not clarity.
        </p>
        <p>
          Do The Math is a single platform that does the legwork for you. We pull live
          data from banks and government sources, run the calculations, and present the
          results plainly — so you can compare your options and make confident decisions
          without needing a financial advisor for every question.
        </p>
        <p>
          We have no products to sell and no commissions to earn. Our only job is to
          give you accurate, unbiased numbers.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-semibold text-neutral-900 mb-5">What's available now</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="block border border-neutral-200 rounded-lg p-4 hover:border-neutral-400 transition-colors group"
            >
              <p className="text-sm font-medium text-neutral-900 group-hover:underline">
                {t.label}
              </p>
              <p className="text-sm text-neutral-500 mt-1">{t.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900 mb-5">Coming soon</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {COMING_SOON.map((t) => (
            <div
              key={t.label}
              className="border border-dashed border-neutral-200 rounded-lg p-4"
            >
              <p className="text-sm font-medium text-neutral-400">{t.label}</p>
              <p className="text-sm text-neutral-400 mt-1">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 space-y-4 text-neutral-600 leading-relaxed">
        <h2 className="text-lg font-semibold text-neutral-900">Get in touch</h2>
        <p>
          If something's wrong, missing, or could be clearer, we want to know.{" "}
          <Link
            href="/feedback"
            className="text-neutral-900 underline underline-offset-2 hover:text-neutral-600"
          >
            Send us feedback
          </Link>{" "}
          or{" "}
          <Link
            href="/partnership"
            className="text-neutral-900 underline underline-offset-2 hover:text-neutral-600"
          >
            reach out about a partnership
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
