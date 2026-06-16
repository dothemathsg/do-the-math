"use client";

import { useState, useMemo } from "react";
import type { PropertyTransaction } from "@/lib/propertyPrices";

type SortKey =
  | "project"
  | "floor_range"
  | "area_sqm"
  | "price"
  | "psf"
  | "property_type"
  | "type_of_sale"
  | "contract_date";

type SortDir = "asc" | "desc";

const PAGE_SIZE = 50;

function floorNum(s: string | null): number {
  if (!s) return -1;
  const m = s.match(/\d+/);
  return m ? parseInt(m[0]) : -1;
}

function formatSGD(n: number) {
  return "$" + n.toLocaleString("en-SG");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-SG", {
    month: "short",
    year: "numeric",
  });
}

export default function DistrictTable({
  transactions,
}: {
  transactions: PropertyTransaction[];
}) {
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: "contract_date",
    dir: "desc",
  });
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    return [...transactions].sort((a, b) => {
      const { key, dir } = sort;
      let cmp = 0;

      if (key === "project" || key === "property_type" || key === "type_of_sale") {
        cmp = (a[key] ?? "").localeCompare(b[key] ?? "");
      } else if (key === "area_sqm" || key === "price" || key === "psf") {
        cmp = (a[key] ?? 0) - (b[key] ?? 0);
      } else if (key === "contract_date") {
        cmp = a.contract_date.localeCompare(b.contract_date);
      } else if (key === "floor_range") {
        cmp = floorNum(a.floor_range) - floorNum(b.floor_range);
      }

      return dir === "asc" ? cmp : -cmp;
    });
  }, [transactions, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSort(key: SortKey) {
    setSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === "desc" ? "asc" : "desc",
    }));
    setPage(1);
  }

  function SortIndicator({ col }: { col: SortKey }) {
    if (sort.key !== col) return <span className="ml-1 opacity-30">↕</span>;
    return (
      <span className="ml-1 opacity-80">{sort.dir === "desc" ? "↓" : "↑"}</span>
    );
  }

  function Th({
    col,
    children,
    className = "",
  }: {
    col: SortKey;
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <th
        className={`px-4 py-3 font-medium whitespace-nowrap cursor-pointer select-none hover:text-neutral-800 ${
          sort.key === col ? "text-neutral-900" : "text-neutral-500"
        } ${className}`}
        onClick={() => handleSort(col)}
      >
        {children}
        <SortIndicator col={col} />
      </th>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-neutral-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200 text-left">
              <Th col="project">Project</Th>
              <Th col="floor_range" className="hidden sm:table-cell">
                Floor
              </Th>
              <Th col="area_sqm" className="text-right">Area (sqft)</Th>
              <Th col="price" className="text-right">Price</Th>
              <Th col="psf" className="text-right">PSF</Th>
              <Th col="property_type">Type</Th>
              <Th col="contract_date">Date</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {paged.map((tx) => (
              <tr key={tx.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-neutral-900">{tx.project}</p>
                  {tx.street && (
                    <p className="text-xs text-neutral-400">{tx.street}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-neutral-600 hidden sm:table-cell">
                  {tx.floor_range ?? "—"}
                </td>
                <td className="px-4 py-3 text-neutral-600 text-right">
                  {tx.area_sqm
                    ? Math.round(tx.area_sqm * 10.7639).toLocaleString()
                    : "—"}
                </td>
                <td className="px-4 py-3 font-medium text-neutral-900 text-right">
                  {formatSGD(tx.price)}
                </td>
                <td className="px-4 py-3 text-neutral-700 text-right">
                  {tx.psf ? formatSGD(Math.round(tx.psf)) : "—"}
                </td>
                <td className="px-4 py-3 text-neutral-500 text-xs">
                  <p>{tx.property_type ?? "—"}</p>
                  <p>{tx.type_of_sale ?? ""}</p>
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {formatDate(tx.contract_date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-neutral-600">
        <span>
          {sorted.length.toLocaleString()} transaction
          {sorted.length !== 1 ? "s" : ""}
          {totalPages > 1 && (
            <span className="text-neutral-400">
              {" "}
              · showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, sorted.length)}
            </span>
          )}
        </span>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded border border-neutral-200 disabled:opacity-30 hover:bg-neutral-50 disabled:cursor-default"
            >
              Previous
            </button>
            <span className="text-neutral-500">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded border border-neutral-200 disabled:opacity-30 hover:bg-neutral-50 disabled:cursor-default"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
