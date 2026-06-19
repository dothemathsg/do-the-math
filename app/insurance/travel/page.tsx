import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Travel Insurance Singapore",
  description:
    "Single-trip vs annual travel insurance in Singapore — what to compare, medical cover limits, pre-existing conditions, and what actually matters.",
  alternates: { canonical: "https://www.dothemath.sg/insurance/travel" },
  openGraph: {
    title: "Travel Insurance Singapore — Do The Math",
    description:
      "Single-trip vs annual travel insurance — what to compare, medical cover limits, pre-existing conditions, and what actually matters.",
    url: "https://www.dothemath.sg/insurance/travel",
  },
};

const PLAN_TYPES = [
  {
    label: "Single-trip",
    desc: "Covers one trip from departure to return to Singapore. Usually the most cost-effective for 1–2 trips a year. Prices vary significantly by destination region and duration.",
  },
  {
    label: "Annual multi-trip",
    desc: "Covers all trips within a 12-month period, usually with a per-trip duration cap (commonly 30, 60, or 90 days). Convenient for frequent travellers. Typically cost-effective at 3+ trips per year.",
  },
  {
    label: "Family plan",
    desc: "Covers a couple and their children under one policy. Usually cheaper than insuring each person individually. Check the definition of 'family' — some policies require all members to travel together.",
  },
];

const COVER_CHECKLIST = [
  { feature: "Emergency medical expenses", importance: "Critical", note: "Look for minimum S$500,000; S$1M+ for USA travel" },
  { feature: "Medical evacuation", importance: "Critical", note: "Should be unlimited or S$1M+ — evacuation flights are extremely expensive" },
  { feature: "Trip cancellation", importance: "High", note: "Check covered reasons; 'cancel for any reason' costs more but is broader" },
  { feature: "Travel delay", importance: "Medium", note: "Cash payout per X hours delayed; read the trigger conditions" },
  { feature: "Baggage loss / delay", importance: "Medium", note: "Limits per item matter; electronics often excluded or sub-limited" },
  { feature: "Personal liability", importance: "Medium", note: "Covers third-party damage or injury you cause abroad" },
  { feature: "Pre-existing conditions", importance: "Variable", note: "Usually excluded; some policies offer optional add-on" },
  { feature: "Adventure / extreme sports", importance: "Situational", note: "Add-on required for skiing, diving, trekking, etc." },
];

const DESTINATIONS = [
  { region: "ASEAN", note: "Most policies cover with a standard plan" },
  { region: "Asia Pacific (incl. Japan, Korea, Australia)", note: "Standard cover usually sufficient; check medical limits" },
  { region: "Europe / UK", note: "Higher medical costs; confirm at least S$500,000 medical" },
  { region: "USA / Canada", note: "Medical costs extremely high; insist on S$1M+ medical cover" },
  { region: "Worldwide incl. USA", note: "Priciest tier; necessary if your itinerary includes North America" },
];

export default function TravelInsurancePage() {
  return (
    <div className="py-16 max-w-2xl">
      <Link href="/insurance" className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors">
        ← Insurance
      </Link>

      <h1 className="mt-6 text-3xl font-semibold text-neutral-900">Travel Insurance in Singapore</h1>
      <p className="mt-4 text-neutral-600 leading-relaxed">
        Travel insurance is inexpensive relative to what it covers — a medical emergency
        abroad can cost tens of thousands of dollars, and a single medical evacuation can
        exceed S$100,000. Yet most travellers either skip it or pick the cheapest option
        without checking the medical cover limits. Here's what actually matters.
      </p>

      {/* Plan types */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Plan types</h2>
        <div className="space-y-4">
          {PLAN_TYPES.map((p) => (
            <div key={p.label} className="border border-neutral-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-neutral-900">{p.label}</p>
              <p className="text-sm text-neutral-600 mt-1.5 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cover checklist */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">What to compare</h2>
        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Cover</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 hidden sm:table-cell">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">What to check</th>
              </tr>
            </thead>
            <tbody>
              {COVER_CHECKLIST.map((row) => (
                <tr key={row.feature} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-neutral-800">{row.feature}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      row.importance === "Critical" ? "bg-red-50 text-red-600" :
                      row.importance === "High" ? "bg-amber-50 text-amber-600" :
                      "bg-neutral-100 text-neutral-500"
                    }`}>
                      {row.importance}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 text-xs leading-relaxed">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Destination tiers */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Cover by destination</h2>
        <p className="text-sm text-neutral-600 mb-4">
          Policies are priced by destination region. Medical cover adequacy varies significantly — the most important factor is the medical cost level at your destination.
        </p>
        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Destination</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Note</th>
              </tr>
            </thead>
            <tbody>
              {DESTINATIONS.map((d) => (
                <tr key={d.region} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-neutral-800">{d.region}</td>
                  <td className="px-4 py-3 text-neutral-500">{d.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pre-existing conditions */}
      <div className="mt-10 bg-neutral-50 rounded-xl p-6 border border-neutral-200">
        <h2 className="text-sm font-semibold text-neutral-900 mb-3">Pre-existing conditions</h2>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Most standard travel policies exclude medical treatment related to conditions
          you had before buying the policy. If you have a chronic condition (e.g. diabetes,
          heart disease, asthma), look specifically for policies that offer pre-existing
          condition cover as an add-on, or specialised policies from providers like NTUC
          Income or AXA that cater to this segment. Always declare honestly — a claim
          rejected for non-disclosure is worse than paying a higher premium.
        </p>
      </div>
    </div>
  );
}
