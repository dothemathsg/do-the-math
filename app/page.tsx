import Hero from "@/components/home/Hero";
import MortgageTable from "@/components/mortgage/MortgageTable";
import { Suspense } from "react";

export const revalidate = 3600;

export default function Home() {
  return (
    <div className="space-y-16 py-10">
      <Hero />
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
