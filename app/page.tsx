import Hero from "@/components/home/Hero";
import MortgageTable from "@/components/mortgage/MortgageTable";
import { Suspense } from "react";

export const revalidate = 3600;

function monthHeading() {
  return new Date().toLocaleDateString("en-SG", { month: "long", year: "numeric" });
}

export default function Home() {
  return (
    <div className="space-y-16 py-10">
      <Hero />
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-900">
          Mortgage Rates in {monthHeading()}
        </h2>
        <Suspense
          fallback={
            <div className="border border-neutral-200 rounded-lg p-8 text-sm text-neutral-400">
              Loading rates…
            </div>
          }
        >
          <MortgageTable />
        </Suspense>
      </section>
    </div>
  );
}
