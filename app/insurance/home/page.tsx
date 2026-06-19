import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home Insurance Singapore",
  description:
    "HDB fire insurance is compulsory but covers only the structure. Here's what home insurance in Singapore actually covers and what you still need.",
  alternates: { canonical: "https://www.dothemath.sg/insurance/home" },
  openGraph: {
    title: "Home Insurance Singapore — Do The Math",
    description:
      "HDB fire insurance is compulsory but covers only the structure. Here's what home insurance in Singapore actually covers and what you still need.",
    url: "https://www.dothemath.sg/insurance/home",
  },
};

const COVER_TYPES = [
  {
    label: "HDB Fire Insurance (compulsory)",
    desc: "Required for all HDB flat owners with an outstanding HDB loan. Covers only the HDB-supplied structure — not your renovation, fixtures you installed, or any contents. Premium is very low (around S$1.50 per year per S$1,000 sum insured).",
  },
  {
    label: "Home contents insurance",
    desc: "Covers your furniture, appliances, clothing, and valuables against fire, theft, water damage, and other perils. Most policies also cover accidental breakage. Typically S$150–S$400/year for S$50,000–S$100,000 of cover.",
  },
  {
    label: "Renovation / fixtures insurance",
    desc: "Covers your renovation and built-in fittings that the basic fire policy excludes. Critical for any flat owner who has spent significantly on renovation — especially for condos where there is no compulsory fire insurance.",
  },
  {
    label: "Landlord insurance",
    desc: "If you rent out your property, standard home insurance may not apply. Landlord policies cover loss of rental income, tenant damage, and liability — all excluded from typical homeowner policies.",
  },
];

const WHAT_TO_CHECK = [
  { item: "Renovation cover limit", detail: "Must match your actual reno cost, not a standard default" },
  { item: "New-for-old vs indemnity", detail: "New-for-old replaces with equivalent new items; indemnity deducts depreciation" },
  { item: "Personal liability", detail: "Covers legal liability if someone is injured in your home" },
  { item: "Alternative accommodation", detail: "Pays for temporary housing if your home is uninhabitable" },
  { item: "Worldwide contents cover", detail: "Some policies cover laptops and valuables when taken outside the home" },
  { item: "Single article limit", detail: "High-value items (art, jewellery) may need separate scheduling" },
];

export default function HomeInsurancePage() {
  return (
    <div className="py-16 max-w-2xl">
      <Link href="/insurance" className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors">
        ← Insurance
      </Link>

      <h1 className="mt-6 text-3xl font-semibold text-neutral-900">Home Insurance in Singapore</h1>
      <p className="mt-4 text-neutral-600 leading-relaxed">
        Many Singapore homeowners believe they're covered because they have the compulsory
        HDB fire insurance policy. They're not — it insures only the original HDB structure,
        not the renovation you spent S$80,000 on, the appliances, or any of your belongings.
        Here's how to plug the gaps.
      </p>

      {/* Types */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Types of home cover</h2>
        <div className="space-y-4">
          {COVER_TYPES.map((c) => (
            <div key={c.label} className="border border-neutral-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-neutral-900">{c.label}</p>
              <p className="text-sm text-neutral-600 mt-1.5 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* HDB vs condo */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">HDB vs condo — key differences</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border border-neutral-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-neutral-900 mb-2">HDB flat</p>
            <ul className="space-y-1.5 text-sm text-neutral-600">
              <li className="flex gap-2"><span className="text-neutral-400 shrink-0">—</span>Compulsory fire insurance with HDB's appointed insurer</li>
              <li className="flex gap-2"><span className="text-neutral-400 shrink-0">—</span>Covers original structure only</li>
              <li className="flex gap-2"><span className="text-neutral-400 shrink-0">—</span>Add a home contents + renovation policy from any private insurer</li>
            </ul>
          </div>
          <div className="border border-neutral-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-neutral-900 mb-2">Condo / private property</p>
            <ul className="space-y-1.5 text-sm text-neutral-600">
              <li className="flex gap-2"><span className="text-neutral-400 shrink-0">—</span>No compulsory fire insurance</li>
              <li className="flex gap-2"><span className="text-neutral-400 shrink-0">—</span>MCST building insurance covers common areas — not your unit</li>
              <li className="flex gap-2"><span className="text-neutral-400 shrink-0">—</span>You need your own fire + contents + reno policy</li>
            </ul>
          </div>
        </div>
      </div>

      {/* What to check */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Key policy features to compare</h2>
        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Feature</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">What to look for</th>
              </tr>
            </thead>
            <tbody>
              {WHAT_TO_CHECK.map((row) => (
                <tr key={row.item} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-neutral-800">{row.item}</td>
                  <td className="px-4 py-3 text-neutral-500">{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tip box */}
      <div className="mt-10 bg-neutral-50 rounded-xl p-6 border border-neutral-200">
        <h2 className="text-sm font-semibold text-neutral-900 mb-3">Tip: insure your renovation correctly</h2>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Keep all renovation invoices. Insurers will ask for proof of value when you claim.
          If your renovation cost S$120,000 but you insure for S$60,000, you will only recover
          50% of any loss — this is called underinsurance averaging. Set the sum insured to your
          actual renovation cost and update it after any future works.
        </p>
      </div>
    </div>
  );
}
