import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Car Insurance Singapore",
  description:
    "Everything you need to know about car insurance in Singapore — comprehensive vs third-party, no-claim bonus, workshop choices, and how to compare quotes.",
  alternates: { canonical: "https://www.dothemath.sg/insurance/car" },
  openGraph: {
    title: "Car Insurance Singapore — Do The Math",
    description:
      "Comprehensive vs third-party, no-claim bonus, workshop choices, and how to compare car insurance quotes in Singapore.",
    url: "https://www.dothemath.sg/insurance/car",
  },
};

const COVER_TYPES = [
  {
    label: "Comprehensive",
    desc: "Covers damage to your own vehicle (accident, fire, theft, flood) plus third-party liability. The most complete — and most common — option for newer or financed cars.",
    best: "Best for: cars under 10 years old, financed vehicles",
  },
  {
    label: "Third-party, Fire & Theft",
    desc: "Covers damage to third parties plus fire and theft of your own vehicle. No cover for accident damage to your own car.",
    best: "Best for: older paid-off cars with lower market value",
  },
  {
    label: "Third-party Only",
    desc: "The legal minimum — covers damage or injury you cause to others only. No cover for your own vehicle under any circumstances.",
    best: "Best for: very old cars where repair costs exceed value",
  },
];

const NCB = [
  { years: "1 year claim-free", discount: "10%" },
  { years: "2 years claim-free", discount: "20%" },
  { years: "3 years claim-free", discount: "30%" },
  { years: "4 years claim-free", discount: "40%" },
  { years: "5+ years claim-free", discount: "50%" },
];

const CHECKLIST = [
  "Compare at least 3 quotes — premiums vary significantly for identical cover",
  "Check the workshop clause: authorised workshops vs free choice affects premiums and convenience",
  "Confirm your NCB percentage and whether it's protected",
  "Read the excess carefully — a low premium with a high excess may cost more after a claim",
  "Check if the policy covers named or unnamed drivers, and the age restrictions",
  "Confirm flood cover if you park in a low-lying area or basement",
];

export default function CarInsurancePage() {
  return (
    <div className="py-16 max-w-2xl">
      <Link href="/insurance" className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors">
        ← Insurance
      </Link>

      <h1 className="mt-6 text-3xl font-semibold text-neutral-900">Car Insurance in Singapore</h1>
      <p className="mt-4 text-neutral-600 leading-relaxed">
        Car insurance is mandatory for all registered vehicles in Singapore — you must
        have at minimum third-party cover to drive legally. In practice, most car owners
        and all finance companies require comprehensive cover. Here's how to understand
        what you're buying and how to compare effectively.
      </p>

      {/* Cover types */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Types of cover</h2>
        <div className="space-y-4">
          {COVER_TYPES.map((c) => (
            <div key={c.label} className="border border-neutral-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-neutral-900">{c.label}</p>
              <p className="text-sm text-neutral-600 mt-1.5 leading-relaxed">{c.desc}</p>
              <p className="text-xs text-neutral-400 mt-2">{c.best}</p>
            </div>
          ))}
        </div>
      </div>

      {/* NCB */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900 mb-1">No-Claim Bonus (NCB)</h2>
        <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
          NCB is a discount on your premium for every claim-free year. It accumulates up
          to 50% and is one of the most valuable aspects of your policy — protect it.
          If you make a claim, you typically lose some or all of it depending on the insurer.
        </p>
        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Claim-free period</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500">Discount</th>
              </tr>
            </thead>
            <tbody>
              {NCB.map((row) => (
                <tr key={row.years} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3 text-neutral-700">{row.years}</td>
                  <td className="px-4 py-3 text-right font-semibold text-neutral-900">{row.discount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Workshop clause */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900 mb-3">Authorised vs free-choice workshops</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border border-neutral-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-neutral-900">Authorised workshops</p>
            <p className="text-sm text-neutral-500 mt-1.5 leading-relaxed">
              You must send your car to the insurer's approved panel for repairs. Premiums
              are typically 10–20% lower. Most major insurers have large workshop networks.
            </p>
          </div>
          <div className="border border-neutral-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-neutral-900">Free-choice workshops</p>
            <p className="text-sm text-neutral-500 mt-1.5 leading-relaxed">
              You choose where to repair. Premiums are higher but you can use your preferred
              workshop or authorised dealer. Often preferred for newer or luxury cars.
            </p>
          </div>
        </div>
      </div>

      {/* Key factors */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900 mb-3">What affects your premium</h2>
        <ul className="space-y-2 text-sm text-neutral-600">
          {[
            "Vehicle age, make, and market value",
            "Your age and years of driving experience",
            "NCB percentage",
            "Named vs unnamed additional drivers",
            "Annual mileage",
            "Excess amount chosen",
            "Workshop clause (authorised or free-choice)",
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-neutral-300 shrink-0">—</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Checklist */}
      <div className="mt-10 bg-neutral-50 rounded-xl p-6 border border-neutral-200">
        <h2 className="text-sm font-semibold text-neutral-900 mb-4">Before you buy — checklist</h2>
        <ul className="space-y-2.5">
          {CHECKLIST.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm text-neutral-600">
              <span className="text-neutral-400 shrink-0 mt-0.5">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Compare CTA */}
      <div className="mt-10 border border-neutral-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-neutral-900">Ready to compare?</p>
          <p className="mt-1 text-sm text-neutral-500">
            See comprehensive plans and indicative starting premiums from all major Singapore insurers.
          </p>
        </div>
        <Link
          href="/insurance/car/rates"
          className="shrink-0 inline-flex items-center gap-1.5 bg-neutral-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-neutral-700 transition-colors"
        >
          Compare car insurance rates →
        </Link>
      </div>
    </div>
  );
}
