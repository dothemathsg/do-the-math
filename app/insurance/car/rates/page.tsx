import type { Metadata } from "next";
import Link from "next/link";
import { getInsuranceRates } from "@/lib/insuranceRates";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Car Insurance Rates Singapore",
  description:
    "Compare comprehensive car insurance plans from FWD, Singlife, NTUC Income, AXA, MSIG, DirectAsia, Etiqa and HL Assurance in Singapore.",
  alternates: { canonical: "https://www.dothemath.sg/insurance/car/rates" },
  openGraph: {
    title: "Car Insurance Rates Singapore — Do The Math",
    description: "Compare car insurance plans from all major Singapore insurers.",
    url: "https://www.dothemath.sg/insurance/car/rates",
  },
};

export default async function CarRatesPage() {
  const rates = await getInsuranceRates("car");

  const lastUpdated = rates[0]?.last_updated
    ? new Date(rates[0].last_updated).toLocaleDateString("en-SG", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <div className="py-16 max-w-4xl">
      <Link href="/insurance/car" className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors">
        ← Car Insurance
      </Link>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Car Insurance — Plan Comparison</h1>
          <p className="mt-1.5 text-sm text-neutral-500">
            Comprehensive cover · starting premiums are indicative · get a personalised quote for your vehicle
          </p>
        </div>
        {lastUpdated && (
          <p className="text-xs text-neutral-400 shrink-0">Updated {lastUpdated}</p>
        )}
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Car insurance rates are highly individual.</strong> Premiums depend on your vehicle make,
          age, market value, your driving history, age, and NCB. The figures below are indicative
          starting premiums — use the quote links to get your actual rate.
        </p>
      </div>

      {rates.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">
          No rates available. Run <code>npx tsx scripts/seedInsuranceRates.ts</code> to populate.
        </p>
      ) : (
        <div className="mt-6 border border-neutral-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Insurer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 hidden sm:table-cell">Plan</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500">From</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500 hidden md:table-cell">Workshop</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-neutral-500 hidden md:table-cell">Excess</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 hidden lg:table-cell">Features</th>
                <th className="px-4 py-3 text-xs font-medium text-neutral-500"></th>
              </tr>
            </thead>
            <tbody>
              {rates.map((r) => (
                <tr key={r.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3.5 font-medium text-neutral-900">{r.insurer}</td>
                  <td className="px-4 py-3.5 text-neutral-500 hidden sm:table-cell">{r.plan_name}</td>
                  <td className="px-4 py-3.5 text-right font-medium text-neutral-700">
                    S${r.price.toLocaleString()}/yr
                  </td>
                  <td className="px-4 py-3.5 text-center hidden md:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      r.workshop_type === "Free choice"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-neutral-100 text-neutral-600"
                    }`}>
                      {r.workshop_type ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center text-neutral-600 hidden md:table-cell">
                    {r.excess ? `S$${r.excess}` : "—"}
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
        Starting premiums are indicative. Actual rates vary significantly by vehicle and driver profile.
        Do The Math is not a licensed financial adviser.
      </p>

      <div className="mt-8 border-t border-neutral-100 pt-6">
        <Link href="/insurance/car" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
          ← Back to Car Insurance guide
        </Link>
      </div>
    </div>
  );
}
