"use client";

import { useState } from "react";
import type { ReviewReport, RateVerdict } from "@/lib/ratesReviewAgent";

const VERDICT_STYLES = {
  likely_accurate: "bg-green-50 text-green-700",
  may_be_outdated:  "bg-amber-50 text-amber-700",
  unverifiable:     "bg-neutral-100 text-neutral-500",
};

const VERDICT_LABELS = {
  likely_accurate: "Accurate",
  may_be_outdated:  "Outdated?",
  unverifiable:     "Unverifiable",
};

const CONFIDENCE_OPACITY = {
  high:   "opacity-100",
  medium: "opacity-70",
  low:    "opacity-50",
};

function VerdictTable({ rows, title }: { rows: RateVerdict[]; title: string }) {
  const [filter, setFilter] = useState<RateVerdict["verdict"] | "all">("all");

  const counts = {
    likely_accurate: rows.filter((r) => r.verdict === "likely_accurate").length,
    may_be_outdated:  rows.filter((r) => r.verdict === "may_be_outdated").length,
    unverifiable:     rows.filter((r) => r.verdict === "unverifiable").length,
  };

  const visible = filter === "all" ? rows : rows.filter((r) => r.verdict === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-neutral-800">{title}</h3>
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "likely_accurate", "may_be_outdated", "unverifiable"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                filter === v
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "border-neutral-200 text-neutral-500 hover:border-neutral-400"
              }`}
            >
              {v === "all"
                ? `All (${rows.length})`
                : `${VERDICT_LABELS[v]} (${counts[v]})`}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-neutral-200 rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200 text-left">
              <th className="px-3 py-2.5 font-medium text-neutral-500">Insurer / Bank</th>
              <th className="px-3 py-2.5 font-medium text-neutral-500 hidden sm:table-cell">Plan</th>
              <th className="px-3 py-2.5 font-medium text-neutral-500 hidden md:table-cell">Stored value</th>
              <th className="px-3 py-2.5 font-medium text-neutral-500">Verdict</th>
              <th className="px-3 py-2.5 font-medium text-neutral-500 hidden lg:table-cell">Notes</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r, i) => (
              <tr
                key={i}
                className={`border-b border-neutral-100 last:border-0 ${CONFIDENCE_OPACITY[r.confidence]}`}
              >
                <td className="px-3 py-2.5 font-medium text-neutral-800">
                  {r.insurer}
                  {r.category && r.category !== "mortgage" && (
                    <span className="ml-1 text-neutral-400 font-normal capitalize">
                      {r.category}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-neutral-500 hidden sm:table-cell max-w-[200px] truncate">
                  {r.plan}
                </td>
                <td className="px-3 py-2.5 text-neutral-600 hidden md:table-cell font-mono">
                  {r.storedValue}
                </td>
                <td className="px-3 py-2.5">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${VERDICT_STYLES[r.verdict]}`}>
                    {VERDICT_LABELS[r.verdict]}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-neutral-500 hidden lg:table-cell max-w-xs">
                  {r.notes}
                  {r.sourceUrl && (
                    <a
                      href={r.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1.5 text-neutral-400 hover:text-neutral-700 underline underline-offset-2"
                    >
                      source ↗
                    </a>
                  )}
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-neutral-400">
                  No rates in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function RatesReviewSection() {
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [report, setReport] = useState<ReviewReport | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function runReview() {
    setStatus("running");
    setReport(null);
    setErrorMsg("");
    try {
      const res = await fetch("/api/agent/review-rates", { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const data: ReviewReport = await res.json();
      setReport(data);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  const outdatedCount = report
    ? [...report.mortgage, ...report.insurance].filter((r) => r.verdict === "may_be_outdated").length
    : 0;

  return (
    <section>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">Rates Accuracy Review</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Scrapes insurer and bank websites, then uses Claude to verify each stored rate.
            Takes 1–3 minutes.
          </p>
        </div>
        <button
          onClick={runReview}
          disabled={status === "running"}
          className="shrink-0 text-sm bg-neutral-900 text-white rounded-lg px-4 py-2 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status === "running" ? "Reviewing…" : "Run review"}
        </button>
      </div>

      {status === "running" && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 text-center">
          <div className="inline-block h-5 w-5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-neutral-500">
            Scraping {" "}insurer and bank pages, running Claude accuracy checks…
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {status === "done" && report && (
        <div className="space-y-6">
          {/* Summary bar */}
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-neutral-500">
              Reviewed{" "}
              <strong className="text-neutral-900">
                {report.mortgage.length + report.insurance.length}
              </strong>{" "}
              rates across{" "}
              <strong className="text-neutral-900">{report.scrapedUrls.length}</strong>{" "}
              pages
            </span>
            {outdatedCount > 0 && (
              <span className="text-amber-700 font-medium">
                ⚠ {outdatedCount} rate{outdatedCount !== 1 ? "s" : ""} may be outdated
              </span>
            )}
            {outdatedCount === 0 && (
              <span className="text-green-700 font-medium">✓ No obvious discrepancies found</span>
            )}
            <span className="text-neutral-400 text-xs ml-auto self-center">
              Reviewed{" "}
              {new Date(report.reviewedAt).toLocaleString("en-SG", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {report.errors.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 space-y-1">
              {report.errors.map((e, i) => <p key={i}>{e}</p>)}
            </div>
          )}

          {report.mortgage.length > 0 && (
            <VerdictTable rows={report.mortgage} title="Mortgage Rates" />
          )}

          {report.insurance.length > 0 && (
            <VerdictTable rows={report.insurance} title="Insurance Rates" />
          )}

          {/* Scraped sources */}
          <details className="text-xs text-neutral-400">
            <summary className="cursor-pointer hover:text-neutral-600">
              Scraped sources ({report.scrapedUrls.length})
            </summary>
            <ul className="mt-2 space-y-1 pl-4">
              {report.scrapedUrls.map((s) => (
                <li key={s.url} className={s.success ? "text-neutral-500" : "text-red-400"}>
                  {s.success ? "✓" : "✗"}{" "}
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                    {s.url}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </section>
  );
}
