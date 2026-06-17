"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createBrowserClient } from "@/supabase/client";
import DistrictMapWrapper from "./DistrictMapWrapper";
import type { DistrictSummary } from "@/lib/propertyPrices";

type PropertyFilter = "all" | "hdb" | "private" | "landed";

const FILTER_OPTIONS: Array<{ id: PropertyFilter; label: string }> = [
  { id: "all",     label: "All" },
  { id: "hdb",     label: "HDB" },
  { id: "private", label: "Private" },
  { id: "landed",  label: "Landed" },
];

function SearchIcon() {
  return (
    <svg
      className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
      />
    </svg>
  );
}

export default function PropertyPricesClient({ data }: { data: DistrictSummary[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<PropertyFilter>("all");
  const [activeDistricts, setActiveDistricts] = useState<Set<number> | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const supabase = createBrowserClient();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runQuery = useCallback(
    async (q: string, f: PropertyFilter) => {
      if (q.trim() === "" && f === "all") {
        setActiveDistricts(null);
        setMatchCount(null);
        return;
      }

      setIsQuerying(true);

      let query = supabase
        .from("property_transactions")
        .select("district");

      if (q.trim()) {
        query = query.or(
          `project.ilike.%${q.trim()}%,street.ilike.%${q.trim()}%`
        );
      }

      if (f === "hdb") {
        query = query.ilike("property_type", "HDB%");
      } else if (f === "private") {
        query = query.in("property_type", [
          "Condominium",
          "Apartment",
          "Executive Condominium",
        ]);
      } else if (f === "landed") {
        query = query.in("property_type", [
          "Semi-Detached House",
          "Terrace House",
          "Detached House",
        ]);
      }

      const { data: rows } = await query;
      const districts = new Set((rows ?? []).map((r) => r.district as number));
      setActiveDistricts(districts);
      setMatchCount(districts.size);
      setIsQuerying(false);
    },
    [supabase]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runQuery(search, filter), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search, filter, runQuery]);

  const totalTransactions = data.reduce((s, d) => s + d.transaction_count, 0);

  return (
    <div className="space-y-4">
      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <SearchIcon />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search project or street name…"
            className="w-full py-2.5 pl-9 pr-4 text-sm border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-all"
          />
          {isQuerying && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
          )}
        </div>

        {/* Property type filter */}
        <div className="flex gap-1.5 shrink-0">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
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

      {/* Status line */}
      <p className="text-sm text-neutral-500">
        {activeDistricts === null ? (
          <>
            Based on{" "}
            <span className="text-neutral-700 font-medium">
              {totalTransactions.toLocaleString()}
            </span>{" "}
            transactions across{" "}
            <span className="text-neutral-700 font-medium">{data.length}</span>{" "}
            districts in the last 3 months.
          </>
        ) : matchCount === 0 ? (
          <span className="text-neutral-400">No districts found — try a different search.</span>
        ) : (
          <>
            Showing{" "}
            <span className="text-neutral-700 font-medium">{matchCount}</span>{" "}
            matching district{matchCount !== 1 ? "s" : ""}.{" "}
            <button
              onClick={() => { setSearch(""); setFilter("all"); }}
              className="text-neutral-400 hover:text-neutral-700 underline underline-offset-2 transition-colors"
            >
              Clear
            </button>
          </>
        )}
      </p>

      <DistrictMapWrapper data={data} activeDistricts={activeDistricts} />
    </div>
  );
}
