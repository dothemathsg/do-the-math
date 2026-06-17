import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createServerClient } from "@/supabase/server";
import { calculateMonthlyPayment, calculateTotalPayment, formatSGD } from "@/lib/mortgage";
import { fetchSoraRate } from "@/lib/sora";
import type { MortgageRate } from "@/supabase/types";

const LOAN_AMOUNT = 2_000_000;
const LOAN_TENURE = 25;

const BANK_URLS: Record<string, string> = {
  DBS: "https://www.dbs.com.sg/personal/rates-online/home-loans.page",
  OCBC: "https://www.ocbc.com/personal-banking/loans/new-purchase-of-hdb-private-property.page",
  UOB: "https://www.uob.com.sg/personal/borrow/property-loans/private-home-loan.page",
  "Standard Chartered": "https://www.sc.com/sg/borrow/mortgages/sora/",
  CIMB: "https://www.cimb.com.sg/en/personal/banking-with-us/loans-financing/property-loan/cimb-private-property-loan.html",
  Maybank: "https://www.maybank.com.sg/en/personal-banking/loans/home-loans.page",
  Citibank: "https://www1.citibank.com.sg/loans/mortgage",
  HSBC: "https://www.hsbc.com.sg/mortgages/",
  "Bank of China": "https://www.bankofchina.com/sg/bocinfo/bi3/",
};

function isVariableRate(rate: MortgageRate) {
  return /SORA/i.test(rate.product_name);
}

export default async function MortgageTable() {
  const supabase = createServerClient();

  const [{ data: rates, error }, sora] = await Promise.all([
    supabase.from("mortgage_rates").select("*").order("interest_rate", { ascending: true }),
    fetchSoraRate(),
  ]);

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
    const variable = isVariableRate(rate);
    const effectiveRate = variable ? sora.rate + rate.interest_rate : rate.interest_rate;
    const monthly = calculateMonthlyPayment(LOAN_AMOUNT, effectiveRate, LOAN_TENURE);
    const total = calculateTotalPayment(monthly, LOAN_TENURE);
    return { ...rate, effectiveRate, monthly, total, variable };
  });

  const bestTotal = Math.min(...enriched.map((r) => r.total));

  const soraDisplay = sora.rate.toFixed(2);
  const soraLabel = sora.isLive
    ? `3M SORA: ${soraDisplay}%${sora.date ? ` as at ${sora.date}` : ""}`
    : `*3M SORA estimated at ${soraDisplay}% — live data temporarily unavailable`;

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
              <TableCell className="font-medium text-neutral-900">
                {BANK_URLS[r.bank] ? (
                  <a
                    href={BANK_URLS[r.bank]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {r.bank}
                  </a>
                ) : (
                  r.bank
                )}
              </TableCell>
              <TableCell className="text-neutral-500" title={r.product_name}>
                {r.product_name}
              </TableCell>
              <TableCell className="text-neutral-900">
                {r.variable ? (
                  <span>
                    {r.effectiveRate.toFixed(2)}%{!sora.isLive && "*"}
                    <span className="ml-1.5 text-xs text-neutral-400">
                      (SORA +{r.interest_rate.toFixed(2)}%)
                    </span>
                  </span>
                ) : (
                  `${r.interest_rate.toFixed(2)}%`
                )}
              </TableCell>
              <TableCell className="text-neutral-500">
                {r.lock_in_years > 0 ? `${r.lock_in_years}yr` : "—"}
              </TableCell>
              <TableCell className="text-neutral-900">
                {formatSGD(r.monthly)}
              </TableCell>
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

      <p className="text-xs text-neutral-400 px-4 py-3 border-t border-neutral-100">
        Based on S$2,000,000 loan over 25 years. {soraLabel}.
      </p>
    </div>
  );
}
