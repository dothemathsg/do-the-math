"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createBrowserClient } from "@/supabase/client";
import DistrictMapWrapper from "./DistrictMapWrapper";
import type { DistrictSummary } from "@/lib/propertyPrices";

export type PropertyFilter = "all" | "hdb" | "condo" | "landed";

const FILTER_OPTIONS: Array<{ id: PropertyFilter; label: string }> = [
  { id: "all",    label: "All" },
  { id: "hdb",    label: "HDB" },
  { id: "condo",  label: "Condo" },
  { id: "landed", label: "Landed" },
];

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

// Build DistrictSummary[] from raw (district, psf) rows
function aggregateSummary(
  rows: Array<{ district: number; psf: number | null }>
): DistrictSummary[] {
  const groups = new Map<number, number[]>();
  for (const { district, psf } of rows) {
    if (psf == null || psf <= 0) continue;
    const list = groups.get(district) ?? [];
    list.push(psf);
    groups.set(district, list);
  }
  return [...groups.entries()].map(([district, psfs]) => ({
    district,
    transaction_count: psfs.length,
    median_psf: Math.round(median(psfs)),
    latest_date: null,
  }));
}

export default function PropertyPricesClient({ data }: { data: DistrictSummary[] }) {
  const [filter, setFilter] = useState<PropertyFilter>("all");
  const [displayData, setDisplayData] = useState<DistrictSummary[]>(data);
  const [isLoading, setIsLoading] = useState(false);
  const supabaseRef = useRef(createBrowserClient());
  const abortRef = useRef<AbortController | null>(null);

  const fetchFiltered = useCallback(
    async (f: PropertyFilter) => {
      if (f === "all") {
        setDisplayData(data);
        return;
      }

      // Cancel any in-flight fetch
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      setIsLoading(true);

      const cutoff = new Date();
      cutoff.setMonth(cutoff.getMonth() - 3);
      const cutoffStr = cutoff.toISOString().split("T")[0];

      const supabase = supabaseRef.current;
      let q = supabase
        .from("property_transactions")
        .select("district, psf")
        .gte("contract_date", cutoffStr)
        .not("psf", "is", null)
        .limit(50000);

      if (f === "hdb") {
        q = q.ilike("property_type", "HDB%");
      } else if (f === "condo") {
        q = q.in("property_type", [
          "Condominium",
          "Apartment",
          "Executive Condominium",
          "Strata Terrace",
        ]);
      } else if (f === "landed") {
        q = q.in("property_type", [
          "Semi-detached",
          "Terrace",
          "Detached",
        ]);
      }

      const { data: rows, error } = await q;
      if (error) {
        console.error("PropertyPricesClient fetch error:", error.message);
      } else if (rows) {
        setDisplayData(aggregateSummary(rows as Array<{ district: number; psf: number | null }>));
      }
      setIsLoading(false);
    },
    [data]
  );

  useEffect(() => {
    fetchFiltered(filter);
  }, [filter, fetchFiltered]);

  const totalTransactions = data.reduce((s, d) => s + d.transaction_count, 0);

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-500">
          Based on{" "}
          <span className="text-neutral-700 font-medium">
            {totalTransactions.toLocaleString()}
          </span>{" "}
          transactions across{" "}
          <span className="text-neutral-700 font-medium">{data.length}</span>{" "}
          districts in the last 3 months.
        </p>

        <div className="flex gap-1.5 shrink-0">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                filter === opt.id
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 rounded-xl pointer-events-none">
            <span className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-700 rounded-full animate-spin" />
          </div>
        )}
        <DistrictMapWrapper data={displayData} activeFilter={filter} />
      </div>
    </div>
  );
}
