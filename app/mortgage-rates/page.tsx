import { Suspense } from "react";
import MortgageTable from "@/components/mortgage/MortgageTable";

export const revalidate = 3600; // re-fetch from Supabase at most once per hour

export default function MortgageRatesPage() {
  return (
    <div className="py-10 space-y-6">
      <h1 className="text-3xl font-semibold">Mortgage Rates</h1>

      <p className="text-zinc-600">
        Compare the latest home loan packages in Singapore.
      </p>

      <Suspense
        fallback={
          <div className="border border-neutral-200 rounded-lg p-8 text-sm text-neutral-400">
            Loading rates…
          </div>
        }
      >
        <MortgageTable />
      </Suspense>
    </div>
  );
}
