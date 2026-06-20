"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type EnrichedRate = {
  id: string;
  bank: string;
  product_name: string;
  interest_rate: number;
  lock_in_years: number;
  notes: string | null;
  effectiveRate: number;
  monthly: number;
  total: number;
  variable: boolean;
};

export type SoraInfo = {
  rate: number;
  isLive: boolean;
  date?: string | null;
};

const BANK_URLS: Record<string, string> = {
  DBS: "https://www.dbs.com.sg/personal/rates-online/home-loans.page",
  OCBC: "https://www.ocbc.com/personal-banking/loans/new-purchase-of-hdb-private-property.page",
  UOB: "https://www.uob.com.sg/personal/borrow/property-loans/private-home-loan.page",
  "Standard Chartered": "https://www.sc.com/sg/borrow/mortgages/sora/",
  "Bank of China": "https://www.bankofchina.com/sg/bocinfo/bi3/",
  CIMB: "https://www.cimb.com.sg/en/personal/banking-with-us/loans-financing/property-loan/cimb-private-property-loan.html",
  Citibank: "https://www1.citibank.com.sg/loans/mortgage",
  HSBC: "https://www.hsbc.com.sg/mortgages/",
  Maybank: "https://www.maybank.com.sg/en/personal-banking/loans/home-loans.page",
};

function formatSGD(amount: number) {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function RateTable({
  rates,
  showSpread,
  soraIsLive,
}: {
  rates: EnrichedRate[];
  showSpread: boolean;
  soraIsLive: boolean;
}) {
  const bestTotal = Math.min(...rates.map((r) => r.total));

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-neutral-50">
          <TableHead className="text-neutral-500 font-medium text-xs uppercase tracking-wide">Bank</TableHead>
          <TableHead className="text-neutral-500 font-medium text-xs uppercase tracking-wide">Product</TableHead>
          <TableHead className="text-neutral-500 font-medium text-xs uppercase tracking-wide">
            {showSpread ? "Effective Rate*" : "Rate"}
          </TableHead>
          <TableHead className="text-neutral-500 font-medium text-xs uppercase tracking-wide">Lock-in</TableHead>
          <TableHead className="text-neutral-500 font-medium text-xs uppercase tracking-wide">Monthly</TableHead>
          <TableHead className="text-neutral-500 font-medium text-xs uppercase tracking-wide">Total Cost</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rates.map((r) => (
          <TableRow key={r.id} className="border-neutral-100 hover:bg-neutral-50 transition-colors">
            <TableCell className="font-medium text-neutral-900">
              {BANK_URLS[r.bank] ? (
                <a href={BANK_URLS[r.bank]} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {r.bank}
                </a>
              ) : (
                r.bank
              )}
            </TableCell>
            <TableCell className="text-neutral-500 text-sm">{r.product_name}</TableCell>
            <TableCell className="text-neutral-900 whitespace-nowrap">
              {showSpread ? (
                <span>
                  {r.effectiveRate.toFixed(2)}%{!soraIsLive && "*"}
                  <span className="ml-1.5 text-xs text-neutral-400">
                    (+{r.interest_rate.toFixed(2)}%)
                  </span>
                </span>
              ) : (
                `${r.interest_rate.toFixed(2)}%`
              )}
            </TableCell>
            <TableCell className="text-neutral-500">
              {r.lock_in_years > 0 ? `${r.lock_in_years}yr` : "—"}
            </TableCell>
            <TableCell className="text-neutral-900">{formatSGD(r.monthly)}</TableCell>
            <TableCell>
              {r.total === bestTotal ? (
                <span className="font-semibold text-neutral-900">
                  {formatSGD(r.total)}
                  <span className="ml-2 text-xs font-normal bg-neutral-900 text-white px-1.5 py-0.5 rounded">
                    Best
                  </span>
                </span>
              ) : (
                <span className="text-neutral-600">{formatSGD(r.total)}</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function MortgageRateTabs({
  rates,
  sora,
  loanAmount,
  loanTenure,
}: {
  rates: EnrichedRate[];
  sora: SoraInfo;
  loanAmount: number;
  loanTenure: number;
}) {
  const [tab, setTab] = useState<"fixed" | "floating">("fixed");

  const fixed = rates.filter((r) => !r.variable).sort((a, b) => a.interest_rate - b.interest_rate);
  const floating = rates.filter((r) => r.variable).sort((a, b) => a.interest_rate - b.interest_rate);

  const active = tab === "fixed" ? fixed : floating;

  const soraLabel = sora.isLive
    ? `3M SORA: ${sora.rate.toFixed(2)}%${sora.date ? ` as at ${sora.date}` : ""}`
    : `3M SORA estimated at ${sora.rate.toFixed(2)}% (live data temporarily unavailable)`;

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-neutral-100 rounded-lg w-fit mb-4">
        <button
          onClick={() => setTab("fixed")}
          className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
            tab === "fixed"
              ? "bg-white text-neutral-900 shadow-sm font-medium"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Fixed ({fixed.length})
        </button>
        <button
          onClick={() => setTab("floating")}
          className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
            tab === "floating"
              ? "bg-white text-neutral-900 shadow-sm font-medium"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Floating / SORA ({floating.length})
        </button>
      </div>

      {/* Table */}
      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        {active.length === 0 ? (
          <p className="p-8 text-sm text-neutral-400 text-center">No {tab} rates available.</p>
        ) : (
          <RateTable rates={active} showSpread={tab === "floating"} soraIsLive={sora.isLive} />
        )}

        <div className="flex items-center justify-between gap-4 px-4 py-3 border-t border-neutral-100">
          <p className="text-xs text-neutral-400">
            Based on S${(loanAmount / 1_000_000).toFixed(0)}M loan over {loanTenure} years.{" "}
            {tab === "floating" && <>{soraLabel}. *Effective rate = SORA + spread.</>}
          </p>
          <Link
            href="/calculator"
            className="text-xs font-medium text-neutral-900 hover:underline underline-offset-2 whitespace-nowrap transition-colors"
          >
            Calculate my loan →
          </Link>
        </div>
      </div>
    </div>
  );
}
