"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  calculateMonthlyPayment,
  calculateTotalInterest,
  formatSGD,
} from "@/lib/mortgage";

export interface TopRateCard {
  id: string;
  bank: string;
  product_name: string;
  interest_rate: number;
  lock_in_years: number;
  isVariable: boolean;
  effectiveRate: number;
}

const DEFAULTS = {
  propertyPrice: "1500000",
  downPaymentPct: "25",
  interestRate: "3.68",
  tenure: 25,
};

const MAX_TENURE = 30;

function validate(raw: string, min: number, max: number): string | null {
  if (raw.trim() === "") return "This field is required";
  const v = parseFloat(raw);
  if (isNaN(v)) return "Enter a valid number";
  if (v < min) return `Minimum is ${min.toLocaleString()}`;
  if (v > max) return `Maximum is ${max.toLocaleString()}`;
  return null;
}

function InputField({
  label,
  id,
  value,
  onChange,
  onTouch,
  min,
  max,
  step,
  prefix,
  suffix,
  error,
  format,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  onTouch: () => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  error?: string | null;
  format?: "currency";
}) {
  const [focused, setFocused] = useState(false);

  const displayValue =
    format === "currency" && !focused && value !== ""
      ? (parseFloat(value) || 0).toLocaleString("en-SG")
      : value;

  const isCurrency = format === "currency";

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-medium uppercase tracking-wide text-neutral-500"
      >
        {label}
      </label>
      <div
        className={`flex items-center border rounded-md bg-white focus-within:ring-1 transition-all ${
          error
            ? "border-red-300 focus-within:ring-red-400 focus-within:border-red-400"
            : "border-neutral-200 focus-within:ring-neutral-900 focus-within:border-neutral-900"
        }`}
      >
        {prefix && (
          <span className="pl-3 pr-1 text-neutral-400 text-sm select-none">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={isCurrency ? "text" : "number"}
          inputMode={isCurrency ? "numeric" : undefined}
          min={isCurrency ? undefined : min}
          max={isCurrency ? undefined : max}
          step={isCurrency ? undefined : step}
          value={displayValue}
          onFocus={() => isCurrency && setFocused(true)}
          onBlur={() => {
            if (isCurrency) setFocused(false);
            onTouch();
          }}
          onChange={(e) => {
            const raw = isCurrency
              ? e.target.value.replace(/,/g, "")
              : e.target.value;
            onChange(raw);
            onTouch();
          }}
          className="w-full py-2.5 px-3 text-sm text-neutral-900 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {suffix && (
          <span className="pr-3 pl-1 text-neutral-400 text-sm select-none">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function ResultCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-4 ${
        highlight
          ? "bg-neutral-900 text-white"
          : "bg-neutral-50 border border-neutral-200"
      }`}
    >
      <p
        className={`text-xs font-medium uppercase tracking-wide mb-1 ${
          highlight ? "text-neutral-400" : "text-neutral-500"
        }`}
      >
        {label}
      </p>
      <p
        className={`text-2xl font-semibold ${
          highlight ? "text-white" : "text-neutral-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default function MortgageCalculator({
  topRates = [],
}: {
  topRates?: TopRateCard[];
}) {
  const [propertyPrice, setPropertyPrice] = useState(DEFAULTS.propertyPrice);
  const [downPaymentPct, setDownPaymentPct] = useState(DEFAULTS.downPaymentPct);
  const [interestRate, setInterestRate] = useState(DEFAULTS.interestRate);
  const [tenure, setTenure] = useState(DEFAULTS.tenure);
  const [touched, setTouched] = useState<Set<string>>(new Set());

  function touch(field: string) {
    setTouched((prev) => new Set([...prev, field]));
  }

  function handleClear() {
    setPropertyPrice("");
    setDownPaymentPct("");
    setInterestRate("");
    setTenure(25);
    setTouched(new Set(["propertyPrice", "downPaymentPct", "interestRate"]));
  }

  function useRate(rate: TopRateCard) {
    setInterestRate(rate.effectiveRate.toFixed(2));
    touch("interestRate");
  }

  const { errors, results } = useMemo(() => {
    const errors = {
      propertyPrice: validate(propertyPrice, 100000, 50000000),
      downPaymentPct: validate(downPaymentPct, 5, 99),
      interestRate: validate(interestRate, 0.1, 15),
    };

    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) return { errors, results: null };

    const price = parseFloat(propertyPrice);
    const dpPct = parseFloat(downPaymentPct);
    const rate = parseFloat(interestRate);
    const downPayment = (price * dpPct) / 100;
    const loanAmount = price - downPayment;

    if (loanAmount <= 0) return { errors, results: null };

    const monthly = calculateMonthlyPayment(loanAmount, rate, tenure);
    const totalInterest = calculateTotalInterest(loanAmount, monthly, tenure);
    const totalCost = loanAmount + totalInterest;

    return { errors, results: { loanAmount, downPayment, monthly, totalInterest, totalCost } };
  }, [propertyPrice, downPaymentPct, interestRate, tenure]);

  const activeRateValue = parseFloat(interestRate);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-700">Loan details</span>
            <button
              onClick={handleClear}
              className="text-xs text-neutral-400 hover:text-neutral-700 underline underline-offset-2 transition-colors"
            >
              Clear all
            </button>
          </div>

          <InputField
            label="Property Price"
            id="property-price"
            value={propertyPrice}
            onChange={setPropertyPrice}
            onTouch={() => touch("propertyPrice")}
            min={100000}
            max={50000000}
            step={50000}
            prefix="S$"
            format="currency"
            error={touched.has("propertyPrice") ? errors.propertyPrice : null}
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Down Payment"
              id="down-payment"
              value={downPaymentPct}
              onChange={setDownPaymentPct}
              onTouch={() => touch("downPaymentPct")}
              min={5}
              max={99}
              step={1}
              suffix="%"
              error={touched.has("downPaymentPct") ? errors.downPaymentPct : null}
            />
            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Down Payment Amount
              </p>
              <div className="py-2.5 px-3 text-sm text-neutral-900 border border-neutral-100 rounded-md bg-neutral-50">
                {results ? formatSGD(results.downPayment) : "—"}
              </div>
            </div>
          </div>

          <InputField
            label="Annual Interest Rate"
            id="interest-rate"
            value={interestRate}
            onChange={setInterestRate}
            onTouch={() => touch("interestRate")}
            min={0.1}
            max={15}
            step={0.01}
            suffix="% p.a."
            error={touched.has("interestRate") ? errors.interestRate : null}
          />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label
                htmlFor="tenure-slider"
                className="text-xs font-medium uppercase tracking-wide text-neutral-500"
              >
                Loan Tenure
              </label>
              <span className="text-sm font-medium text-neutral-900">
                {tenure} years
              </span>
            </div>
            <input
              id="tenure-slider"
              type="range"
              min={1}
              max={MAX_TENURE}
              step={1}
              value={tenure}
              onChange={(e) => setTenure(parseInt(e.target.value))}
              className="w-full h-1.5 bg-neutral-200 rounded-full appearance-none cursor-pointer accent-neutral-900"
            />
            <div className="flex justify-between text-xs text-neutral-400">
              <span>1 yr</span>
              <span>{MAX_TENURE} yrs</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <ResultCard
            label="Monthly Installment"
            value={results ? `${formatSGD(results.monthly)}/mo` : "—"}
            highlight
          />

          <div className="grid grid-cols-2 gap-4">
            <ResultCard
              label="Loan Amount"
              value={results ? formatSGD(results.loanAmount) : "—"}
            />
            <ResultCard
              label="Total Interest"
              value={results ? formatSGD(results.totalInterest) : "—"}
            />
          </div>

          <ResultCard
            label="Total Repayment"
            value={results ? formatSGD(results.totalCost) : "—"}
          />

          {results && (
            <div className="pt-2">
              <div className="flex rounded-full overflow-hidden h-2">
                <div
                  className="bg-neutral-900 transition-all"
                  style={{
                    width: `${(results.loanAmount / results.totalCost) * 100}%`,
                  }}
                />
                <div
                  className="bg-neutral-300 transition-all"
                  style={{
                    width: `${(results.totalInterest / results.totalCost) * 100}%`,
                  }}
                />
              </div>
              <div className="flex gap-4 mt-2 text-xs text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-neutral-900" />
                  Principal{" "}
                  {((results.loanAmount / results.totalCost) * 100).toFixed(0)}%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-neutral-300" />
                  Interest{" "}
                  {((results.totalInterest / results.totalCost) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          )}

          <p className="text-xs text-neutral-400 pt-1">
            Estimates only. Does not account for CPF usage, legal fees, or other
            costs.
          </p>
        </div>
      </div>

      {/* Top rates */}
      {topRates.length > 0 && (
        <div className="space-y-3 border-t border-neutral-100 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-neutral-700">Current best rates</p>
              <p className="text-xs text-neutral-400 mt-0.5">
                Click a card to populate the interest rate field
              </p>
            </div>
            <Link
              href="/mortgage-rates"
              className="text-xs text-neutral-500 hover:text-neutral-900 underline underline-offset-2 whitespace-nowrap mt-0.5 transition-colors"
            >
              View all rates →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {topRates.map((rate) => {
              const isActive =
                !isNaN(activeRateValue) &&
                Math.abs(activeRateValue - rate.effectiveRate) < 0.005;
              return (
                <button
                  key={rate.id}
                  onClick={() => useRate(rate)}
                  className={`text-left p-4 rounded-lg border transition-all group ${
                    isActive
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"
                  }`}
                >
                  <p
                    className={`text-xs font-medium uppercase tracking-wide ${
                      isActive ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  >
                    {rate.bank}
                  </p>
                  <p
                    className={`text-xs mt-0.5 leading-snug line-clamp-2 ${
                      isActive ? "text-neutral-300" : "text-neutral-400"
                    }`}
                  >
                    {rate.product_name}
                  </p>
                  <p
                    className={`text-2xl font-semibold mt-2 ${
                      isActive ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {rate.effectiveRate.toFixed(2)}%
                  </p>
                  <div
                    className={`text-xs mt-0.5 space-y-0.5 ${
                      isActive ? "text-neutral-400" : "text-neutral-400"
                    }`}
                  >
                    {rate.isVariable && (
                      <p>SORA + {rate.interest_rate.toFixed(2)}%</p>
                    )}
                    {rate.lock_in_years > 0 && (
                      <p>{rate.lock_in_years}yr lock-in</p>
                    )}
                  </div>
                  <p
                    className={`text-xs font-medium mt-3 ${
                      isActive
                        ? "text-neutral-300"
                        : "text-neutral-500 group-hover:text-neutral-900"
                    }`}
                  >
                    {isActive ? "In use" : "Use this rate →"}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
