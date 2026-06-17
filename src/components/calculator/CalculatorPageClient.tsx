"use client";

import { useState } from "react";
import MortgageCalculator, {
  type TopRateCard,
} from "@/components/mortgage/MortgageCalculator";
import StampDutyCalculator from "./StampDutyCalculator";

type Tab = "mortgage" | "stamp-duty";

const TABS: Array<{ id: Tab; label: string; description: string }> = [
  {
    id: "mortgage",
    label: "Mortgage",
    description: "Estimate your monthly installment and total loan cost.",
  },
  {
    id: "stamp-duty",
    label: "Stamp Duty",
    description: "Calculate BSD and ABSD based on your buyer profile.",
  },
];

export default function CalculatorPageClient({
  topRates,
}: {
  topRates: TopRateCard[];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("mortgage");
  const active = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="border-b border-neutral-200">
        <div className="flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-neutral-500">{active.description}</p>

      {activeTab === "mortgage" ? (
        <MortgageCalculator topRates={topRates} />
      ) : (
        <StampDutyCalculator />
      )}
    </div>
  );
}
