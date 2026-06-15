import MortgageCalculator from "@/components/mortgage/MortgageCalculator";

export const metadata = {
  title: "Mortgage Calculator — Do The Math",
  description: "Calculate your monthly mortgage installment, total interest, and repayment for Singapore home loans.",
};

export default function CalculatorPage() {
  return (
    <div className="py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Mortgage Calculator</h1>
        <p className="text-neutral-500">
          Estimate your monthly installment and total cost for a Singapore home loan.
        </p>
      </div>

      <MortgageCalculator />
    </div>
  );
}
