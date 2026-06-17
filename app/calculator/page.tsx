import { createServerClient } from "@/supabase/server";
import { fetchSoraRate } from "@/lib/sora";
import CalculatorPageClient from "@/components/calculator/CalculatorPageClient";

export const metadata = {
  title: "Calculators — Do The Math",
  description:
    "Singapore property calculators: mortgage repayment and stamp duty (BSD & ABSD).",
};

export default async function CalculatorPage() {
  const supabase = createServerClient();

  const [{ data: rates }, sora] = await Promise.all([
    supabase.from("mortgage_rates").select("*"),
    fetchSoraRate(),
  ]);

  const topRates = (rates ?? [])
    .map((r) => ({
      id: r.id,
      bank: r.bank,
      product_name: r.product_name,
      interest_rate: r.interest_rate,
      lock_in_years: r.lock_in_years,
      isVariable: /SORA/i.test(r.product_name),
      effectiveRate: /SORA/i.test(r.product_name)
        ? sora.rate + r.interest_rate
        : r.interest_rate,
    }))
    .sort((a, b) => a.effectiveRate - b.effectiveRate)
    .slice(0, 3);

  return (
    <div className="py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Calculators</h1>
        <p className="text-neutral-500">
          Tools to help you make informed property decisions.
        </p>
      </div>

      <CalculatorPageClient topRates={topRates} />
    </div>
  );
}
