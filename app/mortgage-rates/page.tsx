import { Suspense } from "react";
import MortgageTable from "@/components/mortgage/MortgageTable";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Singapore Mortgage Rates — DBS, OCBC, UOB, Standard Chartered",
  description:
    "Compare the latest SORA-linked and fixed home loan rates from Singapore's major banks. Updated regularly so you always see current pricing.",
  robots: { index: false, follow: false },
};

function monthHeading() {
  return new Date().toLocaleDateString("en-SG", { month: "long", year: "numeric" });
}

export default function MortgageRatesPage() {
  return (
    <div className="py-10 space-y-6">
      <h1 className="text-3xl font-semibold">
        Mortgage Rates in {monthHeading()}
      </h1>

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
