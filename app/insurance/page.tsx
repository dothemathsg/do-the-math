import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Car, Heart, Home, Plane, Briefcase, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Insurance Singapore",
  description:
    "Compare car, life, home, travel, and corporate insurance in Singapore. Understand what you need, what to look for, and how to avoid overpaying.",
  alternates: { canonical: "https://www.dothemath.sg/insurance" },
  openGraph: {
    title: "Insurance Singapore — Do The Math",
    description:
      "Compare car, life, home, travel, and corporate insurance in Singapore. Understand what you need, what to look for, and how to avoid overpaying.",
    url: "https://www.dothemath.sg/insurance",
  },
};

const TYPES = [
  {
    href: "/insurance/life",
    icon: Heart,
    label: "Life Insurance",
    desc: "Term, whole life, and investment-linked policies. Understand how much cover you actually need and what MAS rules apply.",
    tags: ["Term", "Whole life", "ILP", "Critical illness"],
  },
  {
    href: "/insurance/car",
    icon: Car,
    label: "Car Insurance",
    desc: "Mandatory for all vehicle owners in Singapore. We break down comprehensive vs third-party cover, NCB, and how to compare quotes.",
    tags: ["Comprehensive", "Third-party", "NCB"],
  },
  {
    href: "/insurance/home",
    icon: Home,
    label: "Home Insurance",
    desc: "HDB fire insurance is compulsory — but it doesn't cover your contents. Here's what else you need as a homeowner or tenant.",
    tags: ["HDB", "Condo", "Contents", "Landlord"],
  },
  {
    href: "/insurance/travel",
    icon: Plane,
    label: "Travel Insurance",
    desc: "Single-trip vs annual plans, medical cover limits, and what to check before your next trip — especially for pre-existing conditions.",
    tags: ["Single trip", "Annual", "Medical", "Cancellation"],
  },
  {
    href: "/insurance/corporate",
    icon: Briefcase,
    label: "Corporate Insurance",
    desc: "Work injury compensation, group health, directors & officers, and professional indemnity — what every Singapore business needs to know.",
    tags: ["WICA", "Group health", "D&O", "PI"],
  },
];

const KEY_PRINCIPLES = [
  {
    title: "Buy cover, not products",
    body: "Insurance is risk transfer, not an investment vehicle. Separating your protection needs from your savings goals almost always leads to better outcomes.",
  },
  {
    title: "Understand the exclusions",
    body: "The headline premium is rarely the whole story. Pre-existing conditions, waiting periods, and sub-limits are where policies differ most.",
  },
  {
    title: "Adequate sum insured matters",
    body: "Under-insuring to save on premiums is a false economy. Calculate your actual exposure — replacement cost, income replacement, outstanding liabilities.",
  },
  {
    title: "Review at every life stage",
    body: "A policy that was right when you were 25 and single needs revisiting when you have a mortgage, dependants, or a business.",
  },
];

export default function InsurancePage() {
  return (
    <div className="py-16">

      {/* Hero */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={18} className="text-neutral-400" />
          <span className="text-sm text-neutral-400 uppercase tracking-wide font-medium">Insurance</span>
        </div>
        <h1 className="text-3xl font-semibold text-neutral-900">
          Insurance in Singapore
        </h1>
        <p className="mt-4 text-neutral-600 leading-relaxed">
          Singapore has some of the highest insurance penetration in Asia, yet most
          people are either under-covered or paying for the wrong things. This section
          helps you understand what each type of insurance does, what adequate cover
          looks like, and how to compare options without the sales pressure.
        </p>
      </div>

      {/* Insurance types */}
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TYPES.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              className="group block border border-neutral-200 rounded-xl p-5 hover:border-neutral-400 transition-colors"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <Icon size={16} className="text-neutral-500 shrink-0" />
                <h2 className="text-sm font-semibold text-neutral-900 group-hover:underline">
                  {t.label}
                </h2>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed">{t.desc}</p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Compare rates */}
      <div className="mt-14">
        <h2 className="text-lg font-semibold text-neutral-900 mb-1">Compare rates</h2>
        <p className="text-sm text-neutral-500 mb-5">Side-by-side premiums from all major Singapore insurers.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { href: "/insurance/life/rates",   label: "Life Insurance",   sub: "Monthly premiums, 30yo S$500K term" },
            { href: "/insurance/car/rates",    label: "Car Insurance",    sub: "Starting premiums + workshop type" },
            { href: "/insurance/home/rates",   label: "Home Insurance",   sub: "Annual premiums, HDB 4-room S$100K" },
            { href: "/insurance/travel/rates", label: "Travel Insurance", sub: "Per-trip prices, 7-day ASEAN" },
          ].map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group flex items-center justify-between gap-3 border border-neutral-200 rounded-xl px-4 py-3.5 hover:border-neutral-900 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-neutral-900">{r.label}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{r.sub}</p>
              </div>
              <ArrowRight size={14} className="text-neutral-300 group-hover:text-neutral-900 transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Key principles */}
      <div className="mt-16 max-w-2xl">
        <h2 className="text-lg font-semibold text-neutral-900 mb-6">
          How to think about insurance
        </h2>
        <div className="space-y-5">
          {KEY_PRINCIPLES.map((p) => (
            <div key={p.title} className="flex gap-4">
              <div className="w-1 bg-neutral-200 rounded-full shrink-0" />
              <div>
                <p className="text-sm font-medium text-neutral-900">{p.title}</p>
                <p className="text-sm text-neutral-500 mt-1 leading-relaxed">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Singapore context */}
      <div className="mt-16 max-w-2xl bg-neutral-50 rounded-xl p-6 border border-neutral-200">
        <h2 className="text-sm font-semibold text-neutral-900 mb-3">Singapore-specific context</h2>
        <ul className="space-y-2 text-sm text-neutral-600">
          <li className="flex gap-2">
            <span className="text-neutral-400 shrink-0">—</span>
            <span><strong className="text-neutral-800">MediShield Life</strong> is mandatory and covers large hospital bills. Integrated Shield Plans (IPs) top it up for private hospital cover.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-neutral-400 shrink-0">—</span>
            <span><strong className="text-neutral-800">HDB fire insurance</strong> is compulsory for all HDB flat owners with an outstanding mortgage, but only covers the structure — not your renovation or belongings.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-neutral-400 shrink-0">—</span>
            <span><strong className="text-neutral-800">CPF can pay premiums</strong> for MediShield Life, some Integrated Shield Plans, and Home Protection Scheme (HPS) for HDB buyers.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-neutral-400 shrink-0">—</span>
            <span><strong className="text-neutral-800">All insurers in Singapore</strong> are licensed and regulated by MAS. Check the MAS Financial Institutions Directory before purchasing any policy.</span>
          </li>
        </ul>
      </div>

    </div>
  );
}
