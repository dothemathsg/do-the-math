import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Corporate Insurance Singapore",
  description:
    "Work injury compensation, group health, directors & officers, and professional indemnity — essential business insurance for Singapore companies.",
  alternates: { canonical: "https://www.dothemath.sg/insurance/corporate" },
  openGraph: {
    title: "Corporate Insurance Singapore — Do The Math",
    description:
      "WICA, group health, D&O, and professional indemnity — essential business insurance for Singapore companies.",
    url: "https://www.dothemath.sg/insurance/corporate",
  },
};

const POLICIES = [
  {
    label: "Work Injury Compensation (WICA)",
    required: "Legally required",
    desc: "All employers in Singapore must have WICA cover for employees doing manual work or earning up to S$2,600/month. Covers medical expenses, temporary and permanent incapacity, and death from work-related accidents or diseases.",
    who: "All employers with eligible workers",
  },
  {
    label: "Group Health / Hospitalisation",
    required: "Not mandatory",
    desc: "Provides inpatient and sometimes outpatient medical benefits to employees. A key part of the total compensation package. Plans range from basic ward cover to private hospital with specialist access.",
    who: "Any employer wanting to attract and retain talent",
  },
  {
    label: "Group Term Life & Group PA",
    required: "Not mandatory",
    desc: "Group term life pays a sum assured on employee death. Group personal accident covers death and disability from accidents. Often bundled and significantly cheaper per person than individual policies.",
    who: "Companies wanting to enhance employee benefits",
  },
  {
    label: "Professional Indemnity (PI)",
    required: "Required for some professions",
    desc: "Covers claims by clients for financial loss arising from your professional errors, omissions, or negligence. Mandatory for lawyers, architects, engineers, financial advisors, and medical professionals in Singapore.",
    who: "Service firms, consultants, licensed professionals",
  },
  {
    label: "Directors & Officers (D&O)",
    required: "Not mandatory",
    desc: "Protects company directors and officers from personal liability arising from decisions made in their corporate roles. Increasingly expected by investors, especially in funded startups and listed companies.",
    who: "Companies with external investors or board members",
  },
  {
    label: "Public Liability",
    required: "Not mandatory",
    desc: "Covers third-party bodily injury or property damage caused by your business operations. Essential for businesses with physical premises, events, or public-facing activities.",
    who: "Retail, F&B, events, contractors",
  },
  {
    label: "Cyber Liability",
    required: "Not mandatory",
    desc: "Covers costs from data breaches, ransomware, and cyber incidents — including regulatory fines under PDPA, notification costs, forensics, and third-party claims. Fast-growing category as PDPA enforcement increases.",
    who: "Any business handling customer or employee data",
  },
];

const WICA_LIMITS = [
  { item: "Medical expenses", limit: "Up to S$45,000 per accident" },
  { item: "Temporary incapacity", limit: "2/3 of monthly earnings, up to 1 year" },
  { item: "Permanent incapacity (total)", limit: "Up to S$340,000" },
  { item: "Death", limit: "Up to S$225,000" },
];

export default function CorporateInsurancePage() {
  return (
    <div className="py-16 max-w-2xl">
      <Link href="/insurance" className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors">
        ← Insurance
      </Link>

      <h1 className="mt-6 text-3xl font-semibold text-neutral-900">Corporate Insurance in Singapore</h1>
      <p className="mt-4 text-neutral-600 leading-relaxed">
        Every Singapore business needs at least one form of insurance by law, and most
        need several more depending on their industry and employee count. Getting this
        wrong creates regulatory exposure and uninsured liability gaps that can be
        existential. Here's a practical overview of what matters and why.
      </p>

      {/* Policies */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Key policies</h2>
        <div className="space-y-4">
          {POLICIES.map((p) => (
            <div key={p.label} className="border border-neutral-200 rounded-lg p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                <p className="text-sm font-semibold text-neutral-900">{p.label}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                  p.required === "Legally required"
                    ? "bg-red-50 text-red-600"
                    : p.required === "Required for some professions"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-neutral-100 text-neutral-500"
                }`}>
                  {p.required}
                </span>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed">{p.desc}</p>
              <p className="text-xs text-neutral-400 mt-2">Who needs it: {p.who}</p>
            </div>
          ))}
        </div>
      </div>

      {/* WICA limits */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900 mb-2">WICA compensation limits (2024)</h2>
        <p className="text-sm text-neutral-600 mb-4">
          WICA was significantly updated in 2020. Ensure your policy reflects the current limits — older policies may be underinsured.
        </p>
        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500">Compensation item</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500">Limit</th>
              </tr>
            </thead>
            <tbody>
              {WICA_LIMITS.map((row) => (
                <tr key={row.item} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3 text-neutral-700">{row.item}</td>
                  <td className="px-4 py-3 text-right text-neutral-600">{row.limit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key note */}
      <div className="mt-10 bg-neutral-50 rounded-xl p-6 border border-neutral-200">
        <h2 className="text-sm font-semibold text-neutral-900 mb-3">Working with a broker</h2>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Corporate insurance is complex enough that most businesses benefit from an
          independent commercial broker rather than buying direct. A broker can access
          multiple insurer markets, advise on coverage structure, and advocate on your
          behalf at claims time. Ensure any broker you work with is licensed by MAS and
          holds a Capital Markets Services licence if advising on investment products.
        </p>
      </div>
    </div>
  );
}
