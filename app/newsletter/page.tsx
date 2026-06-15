import type { Metadata } from "next";
import SubscribeForm from "./SubscribeForm";

export const metadata: Metadata = {
  title: "Get Updates — Do The Math",
  description:
    "Weekly Singapore mortgage rate updates, property market insights, and finance guides straight to your inbox.",
};

const PERKS = [
  {
    title: "Rate change alerts",
    desc: "Know when DBS, OCBC, UOB, or Standard Chartered adjust their mortgage rates.",
  },
  {
    title: "MAS & market updates",
    desc: "Plain-English breakdowns of SORA moves and what they mean for your loan.",
  },
  {
    title: "Property finance guides",
    desc: "Practical guides on TDSR, BSD, refinancing timing, and more.",
  },
  {
    title: "No noise",
    desc: "One email when something worth knowing happens — not a daily digest.",
  },
];

export default function NewsletterPage() {
  return (
    <div className="py-16 max-w-xl">

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">
          Newsletter
        </p>
        <h1 className="text-3xl font-semibold leading-snug text-neutral-900">
          Stay ahead of Singapore's mortgage market
        </h1>
        <p className="text-base text-neutral-500 leading-relaxed">
          Rate changes, MAS policy moves, and property finance guides — sent only
          when something worth knowing happens.
        </p>
      </div>

      <div className="mt-10">
        <SubscribeForm />
      </div>

      <div className="mt-12 space-y-5">
        {PERKS.map((p) => (
          <div key={p.title} className="flex gap-4">
            <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-neutral-900 flex items-center justify-center">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">{p.title}</p>
              <p className="text-sm text-neutral-500 mt-0.5">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
