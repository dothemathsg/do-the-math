import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getDistrictTransactions } from "@/lib/propertyPrices";
import { DISTRICT_NAMES } from "@/constants/districts";
import DistrictTable from "@/components/property/DistrictTable";
import type { Metadata } from "next";

export const revalidate = 3600;

const VALID_FILTERS = new Set(["hdb", "condo", "landed"]);

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const district = parseInt(id);
  const name = DISTRICT_NAMES[district] ?? `District ${district}`;
  return {
    title: `D${String(district).padStart(2, "0")} ${name} Property Prices | Do The Math`,
    description: `Private residential transaction data for Singapore District ${district} — ${name}.`,
  };
}

export default async function DistrictPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { type } = await searchParams;
  const district = parseInt(id);

  if (!district || district < 1 || district > 28) notFound();

  const name = DISTRICT_NAMES[district];
  if (!name) notFound();

  const initialFilter = type && VALID_FILTERS.has(type) ? type : "all";
  const transactions = await getDistrictTransactions(district);

  return (
    <div className="py-10 space-y-6">
      <div>
        <Link
          href="/property-prices"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Property Prices Map
        </Link>
        <h1 className="text-3xl font-semibold">
          D{String(district).padStart(2, "0")} &mdash; {name}
        </h1>
        <p className="text-zinc-600 mt-2">
          {transactions.length > 0
            ? `${transactions.length.toLocaleString()} transactions loaded`
            : "No transaction data yet."}
        </p>
      </div>

      {transactions.length > 0 ? (
        <DistrictTable transactions={transactions} initialFilter={initialFilter} />
      ) : (
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-8 text-center text-sm text-neutral-500">
          Transaction data for this district will appear once the next data import
          runs. Check back soon.
        </div>
      )}

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
