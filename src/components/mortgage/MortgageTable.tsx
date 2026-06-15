import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createServerClient } from "@/supabase/server";
import { calculateMonthlyPayment, calculateTotalPayment } from "@/lib/mortgage";
import type { MortgageRate } from "@/supabase/types";

const LOAN_AMOUNT = 2_000_000;
const LOAN_TENURE = 25;

function isVariableRate(rate: MortgageRate) {
  return /SORA/i.test(rate.product_name);
}

function formatRate(rate: MortgageRate) {
  if (isVariableRate(rate)) {
    // Show the spread with a "+" prefix to signal it's added to SORA
    return `SORA +${rate.interest_rate.toFixed(2)}%`;
  }
  return `${rate.interest_rate.toFixed(2)}%`;
}

export default async function MortgageTable() {
  const supabase = createServerClient();

  const { data: rates, error } = await supabase
    .from("mortgage_rates")
    .select("*")
    .order("interest_rate", { ascending: true });

  if (error) {
    return (
      <p className="text-sm text-red-500">
        Failed to load rates: {error.message}
      </p>
    );
  }

  if (!rates || rates.length === 0) {
    return (
      <p className="text-sm text-neutral-500">
        No rates available. Run <code>npm run update-rates</code> to populate the database.
      </p>
    );
  }

  const enriched = rates.map((rate) => {
    const fixed = !isVariableRate(rate);
    const monthly = fixed
      ? calculateMonthlyPayment(LOAN_AMOUNT, rate.interest_rate, LOAN_TENURE)
      : null;
    return {
      ...rate,
      monthly,
      total: monthly ? calculateTotalPayment(monthly, LOAN_TENURE) : null,
    };
  });

  const fixedTotals = enriched
    .map((r) => r.total)
    .filter((t): t is number => t !== null);
  const bestTotal = fixedTotals.length > 0 ? Math.min(...fixedTotals) : null;

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-50">
            <TableHead className="text-neutral-500 font-medium text-xs uppercase tracking-wide">Bank</TableHead>
            <TableHead className="text-neutral-500 font-medium text-xs uppercase tracking-wide">Product</TableHead>
            <TableHead className="text-neutral-500 font-medium text-xs uppercase tracking-wide">Rate</TableHead>
            <TableHead className="text-neutral-500 font-medium text-xs uppercase tracking-wide">Lock-in</TableHead>
            <TableHead className="text-neutral-500 font-medium text-xs uppercase tracking-wide">Monthly</TableHead>
            <TableHead className="text-neutral-500 font-medium text-xs uppercase tracking-wide">Total Cost</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {enriched.map((r) => (
            <TableRow
              key={r.id}
              className="border-neutral-100 hover:bg-neutral-50 transition-colors"
            >
              <TableCell className="font-medium text-neutral-900">{r.bank}</TableCell>
              <TableCell className="text-neutral-500 max-w-[180px] truncate" title={r.product_name}>
                {r.product_name}
              </TableCell>
              <TableCell className="text-neutral-900">{formatRate(r)}</TableCell>
              <TableCell className="text-neutral-500">
                {r.lock_in_years > 0 ? `${r.lock_in_years}yr` : "—"}
              </TableCell>
              <TableCell className="text-neutral-900">
                {r.monthly ? `$${r.monthly.toFixed(0)}` : "Variable"}
              </TableCell>
              <TableCell>
                {r.total === null ? (
                  <span className="text-neutral-400">Variable</span>
                ) : r.total === bestTotal ? (
                  <span className="font-semibold text-neutral-900">
                    ${r.total.toFixed(0)}
                    <span className="ml-2 text-xs font-normal bg-neutral-900 text-white px-1.5 py-0.5 rounded">
                      Best
                    </span>
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
        Based on S$2,000,000 loan over 25 years. SORA rates show the spread only — actual rate varies with market.
      </p>
    </div>
  );
}
