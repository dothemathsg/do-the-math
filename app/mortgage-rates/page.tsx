import MortgageTable from "@/components/mortgage/MortgageTable";

export default function MortgageRatesPage() {
  return (
    <div className="py-10 space-y-6">
      <h1 className="text-3xl font-semibold">
        Mortgage Rates
      </h1>

      <p className="text-zinc-600">
        Compare the latest home loan packages in Singapore.
      </p>

      <MortgageTable />
    </div>
  );
}