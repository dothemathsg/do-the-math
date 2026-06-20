import { createServerClient } from "@/supabase/server";
import { calculateMonthlyPayment, calculateTotalPayment } from "@/lib/mortgage";
import { fetchSoraRate } from "@/lib/sora";
import type { MortgageRate } from "@/supabase/types";
import MortgageRateTabs from "./MortgageRateTabs";

const LOAN_AMOUNT = 2_000_000;
const LOAN_TENURE = 25;

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
    return <p className="text-sm text-red-500">Failed to load rates: {error.message}</p>;
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

  return (
    <MortgageRateTabs
      rates={enriched}
      sora={sora}
      loanAmount={LOAN_AMOUNT}
      loanTenure={LOAN_TENURE}
    />
  );
}
