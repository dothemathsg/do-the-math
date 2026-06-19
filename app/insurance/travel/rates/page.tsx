import type { Metadata } from "next";
import Link from "next/link";
import { getInsuranceRates } from "@/lib/insuranceRates";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Travel Insurance Rates Singapore",
  description:
    "Compare travel insurance rates from FWD, Singlife, NTUC Income, AXA, Allianz, MSIG, DirectAsia and more. Prices for a 7-day ASEAN trip, 1 adult.",
  alternates: { canonical: "https://www.dothemath.sg/insurance/travel/rates" },
  openGraph: {
    title: "Travel Insurance Rates Singapore — Do The Math",
    description: "Compare travel insurance from all major Singapore insurers.",
    url: "https://www.dothemath.sg/insurance/travel/rates",
  },
};

const TIER_ORDER = ["basic", "standard", "premium"];

function tierLabel(tier: string) {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}

function formatSGD(n: number) {
  return `S$${n.toFixed(0)}`;
}

export default async function TravelRatesPage() {
  const rates = await getInsuranceRates("travel");

  const grouped = TIER_ORDER.reduce<Record<string, typeof rates>>((acc, t) => {
    acc[t] = rates.filter((r) => r.tier === t);
    return acc;
  }, {});

  const lastUpdated = rates[0]?.last_updated
    ? new Date(rates[0].last_updated).toLocaleDateString("en-SG", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="py-16 max-w-4xl">
      <Link href="/insurance/travel" className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors">
        ← Travel Insurance
      </Link>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Travel Insurance Rates</h1>
          <p className="mt-1.5 text-sm text-neutral-500">
            7-day ASEAN trip · 1 adult aged 30 · single trip · economy class
          </p>
        </div>
        {lastUpdated && (
          <p className="text-xs text-neutral-400 shrink-0">Updated {lastUpdated}</p>
        )}
      </div>

      {rates.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">
          No rates available. Run <code>npx tsx scripts/seedInsuranceRates.ts</code> to populate.
        </p>
      ) : (
        <div className="mt-8 space-y-10">
          {TIER_ORDER.map((tier) => {
            const rows = grouped[tier];
            if (!rows?.length) return null;
            return (
              <div key={tier}>
                <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">
                  {tierLabel(tier)}
                </h2>
                <div className="border border-neutral-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200">
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Insurer</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 hidden sm:table-cell">Plan</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500">Price</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 hidden md:table-cell">Medical cover</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 hidden lg:table-cell">Key features</th>
                        <th className="px-4 py-3 text-xs font-medium text-neutral-500"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => (
                        <tr key={r.id} className={`border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors ${i === 0 ? "bg-white" : ""}`}>
                          <td className="px-4 py-3.5 font-medium text-neutral-900">{r.insurer}</td>
                          <td className="px-4 py-3.5 text-neutral-500 hidden sm:table-cell">{r.plan_name}</td>
                          <td className="px-4 py-3.5 text-right">
                            <span className={`font-semibold ${i === 0 ? "text-neutral-900" : "text-neutral-700"}`}>
                              {formatSGD(r.price)}
                            </span>
                            {i === 0 && (
                              <span className="ml-2 text-xs bg-neutral-900 text-white px-1.5 py-0.5 rounded">
                                Lowest
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-right text-neutral-600 hidden md:table-cell">
                            {r.coverage_limit
                              ? `S$${(r.coverage_limit / 1000).toFixed(0)}K`
                              : "—"}
                          </td>
                          <td className="px-4 py-3.5 hidden lg:table-cell">
                            <ul className="space-y-0.5">
                              {r.key_features.slice(0, 2).map((f) => (
                                <li key={f} className="text-xs text-neutral-500">{f}</li>
                              ))}
                            </ul>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            {r.quote_url && (
                              <a
                                href={r.quote_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium text-neutral-900 hover:underline underline-offset-2 whitespace-nowrap"
                              >
                                Get quote →
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-xs text-neutral-400">
        Rates are indicative and based on the reference profile above. Actual premiums may vary.
        Verify with each insurer before purchase. Do The Math is not a licensed financial adviser.
      </p>

      <div className="mt-8 border-t border-neutral-100 pt-6">
        <Link href="/insurance/travel" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
          ← Back to Travel Insurance guide
        </Link>
      </div>
    </div>
  );
}
