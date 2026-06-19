import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Life Insurance Singapore",
  description:
    "Term vs whole life vs ILP — understand life insurance in Singapore, how much cover you need, and how MAS regulates the industry.",
  alternates: { canonical: "https://www.dothemath.sg/insurance/life" },
  openGraph: {
    title: "Life Insurance Singapore — Do The Math",
    description:
      "Term vs whole life vs ILP — understand life insurance in Singapore, how much cover you need, and how MAS regulates the industry.",
    url: "https://www.dothemath.sg/insurance/life",
  },
};

const POLICY_TYPES = [
  {
    label: "Term Life",
    premium: "Lowest",
    cashValue: "None",
    desc: "Pure protection for a fixed period (e.g. 20 or 30 years). Pays out only on death or total permanent disability within the term. The most cost-efficient way to buy a large sum assured.",
    best: "Best for: income replacement, mortgage coverage, young families on a budget",
  },
  {
    label: "Whole Life",
    premium: "Higher",
    cashValue: "Yes — grows over time",
    desc: "Coverage for life with a savings component. Premiums are significantly higher than term for the same sum assured, but the policy builds cash value you can surrender or borrow against.",
    best: "Best for: legacy planning, those who want guaranteed lifelong cover with a savings element",
  },
  {
    label: "Investment-Linked Policy (ILP)",
    premium: "Variable",
    cashValue: "Yes — invested in funds",
    desc: "Premiums are split between protection and investment in unit trusts. Returns are not guaranteed and coverage can lapse if fund value falls too low. MAS requires advisors to disclose all charges.",
    best: "Best for: only if the investment component suits your risk profile; often better to separate insurance and investing",
  },
  {
    label: "Critical Illness (CI)",
    premium: "Moderate",
    cashValue: "No (for term CI)",
    desc: "Pays a lump sum on diagnosis of a covered condition — typically the 37 critical illnesses defined by LIA Singapore. Does not replace life insurance; supplements it for medical expenses and income during recovery.",
    best: "Best for: complementing a term or whole life policy, especially with family history of serious illness",
  },
];

const COVERAGE_GUIDE = [
  { need: "Income replacement", rule: "9–12× annual income" },
  { need: "Mortgage payoff", rule: "Outstanding loan balance" },
  { need: "Dependant education", rule: "Estimated future costs" },
  { need: "Final expenses", rule: "S$15,000–S$30,000" },
];

export default function LifeInsurancePage() {
  return (
    <div className="py-16 max-w-2xl">
      <Link href="/insurance" className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors">
        ← Insurance
      </Link>

      <h1 className="mt-6 text-3xl font-semibold text-neutral-900">Life Insurance in Singapore</h1>
      <p className="mt-4 text-neutral-600 leading-relaxed">
        Life insurance exists to replace your income and settle your obligations if you
        can no longer provide for your dependants. In Singapore, the market is regulated
        by MAS and the Life Insurance Association (LIA). Despite high policy ownership,
        most Singaporeans remain significantly underinsured relative to their actual income
        replacement needs.
      </p>

      {/* Policy types */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Types of life insurance</h2>
        <div className="space-y-4">
          {POLICY_TYPES.map((p) => (
            <div key={p.label} className="border border-neutral-200 rounded-lg p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <p className="text-sm font-semibold text-neutral-900">{p.label}</p>
                <div className="flex gap-3 text-xs">
                  <span className="bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded">
                    Premium: {p.premium}
                  </span>
                  <span className="bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded">
                    Cash value: {p.cashValue}
                  </span>
                </div>
              </div>
              <p className="text-sm text-neutral-600 mt-2 leading-relaxed">{p.desc}</p>
              <p className="text-xs text-neutral-400 mt-2">{p.best}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How much cover */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900 mb-2">How much cover do you need?</h2>
        <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
          A common starting point is the DIME method — add up your Debts, Income
          replacement need, Mortgage, and Education costs for dependants. LIA's
          industry data suggests most Singaporeans are covered for less than half
          their actual income replacement need.
        </p>
        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Component</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500">Rule of thumb</th>
              </tr>
            </thead>
            <tbody>
              {COVERAGE_GUIDE.map((row) => (
                <tr key={row.need} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3 text-neutral-700">{row.need}</td>
                  <td className="px-4 py-3 text-right text-neutral-600">{row.rule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MediShield & CPF */}
      <div className="mt-10 bg-neutral-50 rounded-xl p-6 border border-neutral-200">
        <h2 className="text-sm font-semibold text-neutral-900 mb-3">What CPF already covers</h2>
        <ul className="space-y-2.5 text-sm text-neutral-600">
          {[
            "MediShield Life covers large hospitalisation bills — it is not life insurance.",
            "Home Protection Scheme (HPS) covers your HDB mortgage on death or TPD — check your CPF statement to confirm coverage.",
            "Dependants' Protection Scheme (DPS) provides up to S$70,000 term cover, auto-enrolled when you first use CPF. Low cost but low sum assured.",
            "DPS and HPS together are rarely sufficient as standalone cover for a family with dependants.",
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-neutral-400 shrink-0 mt-0.5">—</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Key questions */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Questions to ask before you buy</h2>
        <ul className="space-y-2 text-sm text-neutral-600">
          {[
            "What is the total sum assured, and does it cover my actual income replacement need?",
            "Is this term or permanent cover — and do I need it for life or just until my dependants are independent?",
            "What are the exclusions, especially for pre-existing conditions?",
            "What are the total charges over the policy lifetime, including distribution costs?",
            "If there is a savings or investment component, what is the guaranteed vs non-guaranteed return?",
            "Is the advisor independent (FA) or tied to one insurer?",
          ].map((q) => (
            <li key={q} className="flex gap-2">
              <span className="text-neutral-300 shrink-0">—</span>
              {q}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
