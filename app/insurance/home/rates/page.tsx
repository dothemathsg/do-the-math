import type { Metadata } from "next";
import Link from "next/link";
import { getInsuranceRates } from "@/lib/insuranceRates";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Home Insurance Rates Singapore",
  description:
    "Compare home insurance annual premiums from FWD, Singlife, NTUC Income, AXA, MSIG, DirectAsia and more. Based on HDB 4-room flat, S$100K contents and renovation cover.",
  alternates: { canonical: "https://www.dothemath.sg/insurance/home/rates" },
  openGraph: {
    title: "Home Insurance Rates Singapore — Do The Math",
    description: "Compare home insurance premiums from all major Singapore insurers.",
    url: "https://www.dothemath.sg/insurance/home/rates",
  },
};

export default async function HomeRatesPage() {
  const rates = await getInsuranceRates("home");

  const lastUpdated = rates[0]?.last_updated
    ? new Date(rates[0].last_updated).toLocaleDateString("en-SG", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="py-16 max-w-4xl">
      <Link href="/insurance/home" className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors">
        ← Home Insurance
      </Link>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Home Insurance Rates</h1>
          <p className="mt-1.5 text-sm text-neutral-500">
            HDB 4-room flat · contents S$50K + renovation S$50K · annual premium
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
        <div className="mt-8 border border-neutral-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Insurer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 hidden sm:table-cell">Plan</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500">Annual</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 hidden lg:table-cell">Key features</th>
                <th className="px-4 py-3 text-xs font-medium text-neutral-500"></th>
              </tr>
            </thead>
            <tbody>
              {rates.map((r, i) => (
                <tr key={r.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3.5 font-medium text-neutral-900">{r.insurer}</td>
                  <td className="px-4 py-3.5 text-neutral-500 hidden sm:table-cell">{r.plan_name}</td>
                  <td className="px-4 py-3.5 text-right">
                    <span className={`font-semibold ${i === 0 ? "text-neutral-900" : "text-neutral-700"}`}>
                      S${r.price}/yr
                    </span>
                    {i === 0 && (
                      <span className="ml-2 text-xs bg-neutral-900 text-white px-1.5 py-0.5 rounded">
                        Lowest
                      </span>
                    )}
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
      )}

      <p className="mt-6 text-xs text-neutral-400">
        Rates are indicative based on the reference profile above. Actual premiums depend on your flat type,
        location, coverage amount, and chosen insurer. Verify before purchase.
        Do The Math is not a licensed financial adviser.
      </p>

      <div className="mt-8 border-t border-neutral-100 pt-6">
        <Link href="/insurance/home" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
          ← Back to Home Insurance guide
        </Link>
      </div>
    </div>
  );
}
