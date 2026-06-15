"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { mortgageRates } from "@/constants/mortgageRates";
import { calculateMonthlyPayment, calculateTotalPayment } from "@/lib/mortgage";

const LOAN_AMOUNT = 2000000;
const LOAN_TENURE = 25;

export default function MortgageTable() {
  const enriched = mortgageRates.map((rate) => {
    const monthly = calculateMonthlyPayment(
      LOAN_AMOUNT,
      rate.interestRate,
      LOAN_TENURE
    );

    return {
      ...rate,
      monthly,
      total: calculateTotalPayment(monthly, LOAN_TENURE),
    };
  });

  const best = Math.min(...enriched.map((r) => r.total));

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-50">
            <TableHead className="text-neutral-500 font-medium text-xs uppercase tracking-wide">Bank</TableHead>
            <TableHead className="text-neutral-500 font-medium text-xs uppercase tracking-wide">Type</TableHead>
            <TableHead className="text-neutral-500 font-medium text-xs uppercase tracking-wide">Rate</TableHead>
            <TableHead className="text-neutral-500 font-medium text-xs uppercase tracking-wide">Monthly</TableHead>
            <TableHead className="text-neutral-500 font-medium text-xs uppercase tracking-wide">Total Cost</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {enriched.map((r) => (
            <TableRow key={r.bank} className="border-neutral-100 hover:bg-neutral-50 transition-colors">
              <TableCell className="font-medium text-neutral-900">{r.bank}</TableCell>
              <TableCell className="text-neutral-500">{r.type}</TableCell>
              <TableCell className="text-neutral-900">{r.interestRate}%</TableCell>
              <TableCell className="text-neutral-900">${r.monthly.toFixed(0)}</TableCell>
              <TableCell>
                {r.total === best ? (
                  <span className="font-semibold text-neutral-900">
                    ${r.total.toFixed(0)}
                    <span className="ml-2 text-xs font-normal bg-neutral-900 text-white px-1.5 py-0.5 rounded">Best</span>
                  </span>
                ) : (
                  <span className="text-neutral-600">${r.total.toFixed(0)}</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <p className="text-xs text-neutral-400 px-4 py-3 border-t border-neutral-100">
        Based on S$2,000,000 loan over 25 years. Actual bank rates may vary.
      </p>
    </div>
  );
}