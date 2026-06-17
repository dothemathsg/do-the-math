"use client";

import { useState, useMemo } from "react";
import { formatSGD } from "@/lib/mortgage";

type Status = "Singapore Citizen" | "Permanent Resident" | "Foreigner";
type PropertyCount = 0 | 1 | 2;

// ABSD rates effective 27 April 2023
const ABSD_RATES: Record<Status, [number, number, number]> = {
  "Singapore Citizen":  [0.00, 0.20, 0.30],
  "Permanent Resident": [0.05, 0.30, 0.35],
  "Foreigner":          [0.60, 0.60, 0.60],
};

const BSD_BRACKETS: Array<{ label: string; limit: number; rate: number }> = [
  { label: "First S$180,000",                limit: 180_000,   rate: 0.01 },
  { label: "Next S$180,000",                 limit: 180_000,   rate: 0.02 },
  { label: "Next S$640,000",                 limit: 640_000,   rate: 0.03 },
  { label: "Next S$500,000",                 limit: 500_000,   rate: 0.04 },
  { label: "Next S$1,500,000",               limit: 1_500_000, rate: 0.05 },
  { label: "Amount above S$3,000,000",       limit: Infinity,  rate: 0.06 },
];

interface BSDLine {
  label: string;
  taxable: number;
  rate: number;
  amount: number;
}

function computeBSD(price: number): { lines: BSDLine[]; total: number } {
  let remaining = price;
  let total = 0;
  const lines: BSDLine[] = [];

  for (const { label, limit, rate } of BSD_BRACKETS) {
    const taxable = Math.min(remaining, limit);
    if (taxable <= 0) break;
    const amount = taxable * rate;
    lines.push({ label, taxable, rate, amount });
    total += amount;
    remaining -= taxable;
    if (remaining <= 0) break;
  }

  return { lines, total };
}

function CurrencyInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);

  const displayValue =
    !focused && value !== ""
      ? (parseFloat(value) || 0).toLocaleString("en-SG")
      : value;

  return (
    <div className="flex items-center border border-neutral-200 rounded-md bg-white focus-within:ring-1 focus-within:ring-neutral-900 focus-within:border-neutral-900 transition-all">
      <span className="pl-3 pr-1 text-neutral-400 text-sm select-none">S$</span>
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        placeholder="e.g. 1,500,000"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value.replace(/,/g, ""))}
        className="w-full py-2.5 px-2 text-sm text-neutral-900 bg-transparent outline-none"
      />
    </div>
  );
}

function ToggleGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        {label}
      </p>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <button
            key={String(opt.value)}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2.5 rounded-md text-sm font-medium text-left transition-colors border ${
              value === opt.value
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function StampDutyCalculator() {
  const [price, setPrice] = useState("1500000");
  const [status, setStatus] = useState<Status>("Singapore Citizen");
  const [propertyCount, setPropertyCount] = useState<PropertyCount>(0);

  const results = useMemo(() => {
    const p = parseFloat(price);
    if (isNaN(p) || p <= 0) return null;

    const { lines: bsdLines, total: bsd } = computeBSD(p);
    const absdRate = ABSD_RATES[status][Math.min(propertyCount, 2) as PropertyCount];
    const absd = p * absdRate;
    const total = bsd + absd;

    return { bsdLines, bsd, absdRate, absd, total };
  }, [price, status, propertyCount]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Inputs */}
      <div className="space-y-6">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium uppercase tracking-wide text-neutral-500">
            Property Price
          </label>
          <CurrencyInput value={price} onChange={setPrice} />
        </div>

        <ToggleGroup
          label="Residential Status"
          options={[
            { value: "Singapore Citizen" as Status, label: "Singapore Citizen" },
            { value: "Permanent Resident" as Status, label: "Permanent Resident" },
            { value: "Foreigner" as Status, label: "Foreigner" },
          ]}
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPropertyCount(0);
          }}
        />

        {status !== "Foreigner" && (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Properties Currently Owned
            </p>
            <div className="flex gap-2">
              {(
                [
                  { value: 0 as PropertyCount, label: "None" },
                  { value: 1 as PropertyCount, label: "1" },
                  { value: 2 as PropertyCount, label: "2 or more" },
                ] as Array<{ value: PropertyCount; label: string }>
              ).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPropertyCount(opt.value)}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors border ${
                    propertyCount === opt.value
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {results ? (
          <>
            {/* ABSD summary card — most impactful, show first */}
            <div
              className={`rounded-lg p-4 ${
                results.absdRate === 0
                  ? "bg-neutral-50 border border-neutral-200"
                  : "bg-neutral-900 text-white"
              }`}
            >
              <p
                className={`text-xs font-medium uppercase tracking-wide mb-1 ${
                  results.absdRate === 0 ? "text-neutral-500" : "text-neutral-400"
                }`}
              >
                Additional Buyer&apos;s Stamp Duty (ABSD)
              </p>
              {results.absdRate === 0 ? (
                <>
                  <p className="text-2xl font-semibold text-neutral-400">—</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    0% — not applicable for Singapore Citizens buying their first
                    property.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-semibold text-white">
                    {formatSGD(results.absd)}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    {(results.absdRate * 100).toFixed(0)}% rate applies to{" "}
                    {status === "Foreigner"
                      ? "all foreigners"
                      : status === "Permanent Resident"
                      ? `PR buying ${propertyCount === 0 ? "1st" : propertyCount === 1 ? "2nd" : "3rd+"} property`
                      : `SC buying ${propertyCount === 0 ? "1st" : propertyCount === 1 ? "2nd" : "3rd+"} property`}
                  </p>
                </>
              )}
            </div>

            {/* BSD breakdown */}
            <div className="border border-neutral-200 rounded-lg overflow-hidden">
              <div className="bg-neutral-50 px-4 py-3 flex justify-between items-baseline">
                <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Buyer&apos;s Stamp Duty (BSD)
                </span>
                <span className="text-lg font-semibold text-neutral-900">
                  {formatSGD(results.bsd)}
                </span>
              </div>
              <div className="px-4 py-3 divide-y divide-neutral-100">
                {results.bsdLines.map((line, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-1.5 text-xs text-neutral-500"
                  >
                    <span>
                      {line.label} × {(line.rate * 100).toFixed(0)}%
                    </span>
                    <span className="text-neutral-700 font-medium tabular-nums">
                      {formatSGD(line.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border border-neutral-200 rounded-lg px-4 py-3 flex justify-between items-baseline">
              <span className="text-sm font-medium text-neutral-700">
                Total Stamp Duty
              </span>
              <span className="text-xl font-semibold text-neutral-900 tabular-nums">
                {formatSGD(results.total)}
              </span>
            </div>

            <p className="text-xs text-neutral-400">
              Based on IRAS rates effective 27 April 2023. Payable within 14 days
              of signing the S&amp;P agreement.
            </p>
          </>
        ) : (
          <div className="flex items-center justify-center h-48 text-sm text-neutral-400">
            Enter a property price to calculate stamp duty.
          </div>
        )}
      </div>
    </div>
  );
}
