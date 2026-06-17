import { getDistrictSummaries } from "@/lib/propertyPrices";
import PropertyPricesClient from "@/components/property/PropertyPricesClient";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Singapore Property Prices by District | Do The Math",
  description:
    "Interactive map showing the latest residential transaction prices by Singapore postal district, sourced from URA and HDB.",
};

export default async function PropertyPricesPage() {
  const data = await getDistrictSummaries();

  return (
    <div className="py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Singapore Property Prices</h1>
        <p className="text-zinc-600 mt-2">
          Click a district to see individual transactions. Prices are median PSF
          (price per square foot) based on URA caveats and HDB resale data.
        </p>
      </div>

      <PropertyPricesClient data={data} />

      <p className="text-xs text-neutral-400">
        Sources:{" "}
        <a
          href="https://www.ura.gov.sg/reis/dataDictionary"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-neutral-600"
        >
          URA REALIS
        </a>{" "}
        (private residential) &amp;{" "}
        <a
          href="https://data.gov.sg/datasets/d_8b84c4ee58e3cfc0ece0d773c8ca6abc/view"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-neutral-600"
        >
          HDB Resale Flat Prices
        </a>
        . Updated monthly.
      </p>
    </div>
  );
}
