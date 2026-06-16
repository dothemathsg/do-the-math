import { Suspense } from "react";
import DistrictMap from "@/components/property/DistrictMapWrapper";
import { getDistrictSummaries } from "@/lib/propertyPrices";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Singapore Property Prices by District | Do The Math",
  description:
    "Interactive map showing the latest private residential transaction prices by Singapore postal district, sourced from URA.",
};

async function MapSection() {
  const data = await getDistrictSummaries();

  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-8 text-center text-sm text-neutral-500">
          Transaction data is being imported. Check back soon.
        </div>
      ) : (
        <p className="text-sm text-neutral-500">
          Based on{" "}
          {data.reduce((s, d) => s + d.transaction_count, 0).toLocaleString()}{" "}
          transactions across {data.length} districts in the last 3 months.
        </p>
      )}
      <DistrictMap data={data} />
    </div>
  );
}

export default function PropertyPricesPage() {
  return (
    <div className="py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Singapore Property Prices</h1>
        <p className="text-zinc-600 mt-2">
          Click a district to see individual transactions. Prices are median PSF
          (price per square foot) of private residential properties based on
          URA&apos;s caveats data.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-[400px] bg-neutral-50 border border-neutral-200 rounded-xl animate-pulse" />
        }
      >
        <MapSection />
      </Suspense>

      <p className="text-xs text-neutral-400">
        Source:{" "}
        <a
          href="https://www.ura.gov.sg/reis/dataDictionary"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-neutral-600"
        >
          Urban Redevelopment Authority (URA) REALIS
        </a>
        . Updated monthly.
      </p>
    </div>
  );
}
