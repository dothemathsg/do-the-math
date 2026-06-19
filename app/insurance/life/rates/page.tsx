import type { Metadata } from "next";
import Link from "next/link";
import { getInsuranceRates } from "@/lib/insuranceRates";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Term Life Insurance Rates Singapore",
  description:
    "Compare term life insurance monthly premiums from Singlife, FWD, AIA, NTUC Income, Great Eastern, Manulife and Prudential. Based on 30yo male, S$500K cover, 20-year term.",
  alternates: { canonical: "https://www.dothemath.sg/insurance/life/rates" },
  openGraph: {
    title: "Term Life Insurance Rates Singapore — Do The Math",
    description: "Compare term life insurance from all major Singapore insurers.",
    url: "https://www.dothemath.sg/insurance/life/rates",
  },
};

export default async function LifeRatesPage() {
  const rates = await getInsuranceRates("life");

  const lastUpdated = rates[0]?.last_updated
    ? new Date(rates[0].last_updated).toLocaleDateString("en-SG", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="py-16 max-w-4xl">
      <Link href="/insurance/life" className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors">
        ← Life Insurance
      </Link>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Term Life Insurance Rates</h1>
          <p className="mt-1.5 text-sm text-neutral-500">
            30-year-old male · non-smoker · S$500K sum assured · 20-year term
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
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500">Monthly</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 hidden md:table-cell">Annual</th>
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
                      S${r.price}/mo
                    </span>
                    {i === 0 && (
                      <span className="ml-2 text-xs bg-neutral-900 text-white px-1.5 py-0.5 rounded">
                        Lowest
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right text-neutral-600 hidden md:table-cell">
                    S${(r.price * 12).toFixed(0)}/yr
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
        Rates are indicative based on the reference profile above. Actual premiums vary by age, gender,
        smoking status, health history, and sum assured. Get a personalised quote from each insurer.
        Do The Math is not a licensed financial adviser.
      </p>

      <div className="mt-6 bg-neutral-50 border border-neutral-200 rounded-lg p-4">
        <p className="text-xs text-neutral-600 leading-relaxed">
          <strong className="text-neutral-800">Note:</strong> Term life premiums increase significantly with age.
          A 40-year-old male will typically pay 1.8–2.5× the premium of a 30-year-old for the same cover.
          Lock in your rate early if you intend to buy.
        </p>
      </div>

      <div className="mt-8 border-t border-neutral-100 pt-6">
        <Link href="/insurance/life" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
          ← Back to Life Insurance guide
        </Link>
      </div>
    </div>
  );
}
