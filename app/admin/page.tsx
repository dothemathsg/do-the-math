import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import ResearchButton from "./ResearchButton";
import WriteButton from "./WriteButton";
import ScheduleForm from "./ScheduleForm";
import RatesReviewSection from "./RatesReviewSection";
import { approvePlan, rejectPlan, deleteDraft } from "./actions";

export const dynamic = "force-dynamic";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmtDatetime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-SG", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminPage() {
  const supabase = getSupabase();

  const [plansRes, draftsRes, scheduledRes] = await Promise.all([
    supabase
      .from("content_plans")
      .select("*")
      .in("status", ["pending", "approved"])
      .order("created_at", { ascending: false }),
    supabase
      .from("articles")
      .select("id, title, slug, status, created_at, og_image_url, excerpt")
      .eq("status", "draft")
      .order("created_at", { ascending: false }),
    supabase
      .from("articles")
      .select("id, title, slug, status, scheduled_at")
      .eq("status", "scheduled")
      .order("scheduled_at", { ascending: true }),
  ]);

  const plans = plansRes.data ?? [];
  const drafts = draftsRes.data ?? [];
  const scheduled = scheduledRes.data ?? [];

  // Published count
  const { count: publishedCount } = await supabase
    .from("articles")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");

  return (
    <div className="space-y-10">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Pending plans", value: plans.filter((p) => p.status === "pending").length },
          { label: "Approved plans", value: plans.filter((p) => p.status === "approved").length },
          { label: "Drafts", value: drafts.length },
          { label: "Scheduled", value: scheduled.length },
          { label: "Published", value: publishedCount ?? 0, span: true },
        ].map((s) => (
          <div
            key={s.label}
            className={`bg-white border border-neutral-200 rounded-lg p-4 ${s.span ? "col-span-2 sm:col-span-1" : ""}`}
          >
            <p className="text-2xl font-semibold text-neutral-900">{s.value}</p>
            <p className="text-xs text-neutral-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Research */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-neutral-900">
            Step 1 — Research
          </h2>
          <ResearchButton />
        </div>
        <p className="text-sm text-neutral-500">
          Scrapes HDB, URA, CNA, and PropertyGuru then uses Claude to generate article ideas.
          Takes ~60 seconds.
        </p>
      </section>

      {/* Content Plans */}
      {plans.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-neutral-900 mb-4">
            Step 2 — Review Plans
          </h2>
          <div className="space-y-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white border border-neutral-200 rounded-lg p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{plan.topic}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{plan.angle}</p>
                  </div>
                  <span
                    className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                      plan.status === "approved"
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {plan.status}
                  </span>
                </div>

                {plan.research_notes && (
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {plan.research_notes}
                  </p>
                )}

                {plan.target_keywords?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {(plan.target_keywords as string[]).map((kw: string) => (
                      <span
                        key={kw}
                        className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  {plan.status === "pending" && (
                    <>
                      <form action={approvePlan.bind(null, plan.id)}>
                        <button
                          type="submit"
                          className="text-xs bg-neutral-900 text-white rounded px-3 py-1.5 hover:bg-neutral-700 transition-colors"
                        >
                          Approve
                        </button>
                      </form>
                      <form action={rejectPlan.bind(null, plan.id)}>
                        <button
                          type="submit"
                          className="text-xs border border-neutral-300 rounded px-3 py-1.5 hover:border-red-400 hover:text-red-600 transition-colors"
                        >
                          Reject
                        </button>
                      </form>
                    </>
                  )}
                  {plan.status === "approved" && (
                    <WriteButton planId={plan.id} />
                  )}
                  <span className="text-xs text-neutral-400 ml-auto">
                    {fmt(plan.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Drafts */}
      {drafts.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-neutral-900 mb-4">
            Step 3 — Review Drafts
          </h2>
          <div className="space-y-3">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-white border border-neutral-200 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{draft.title}</p>
                    {draft.excerpt && (
                      <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                        {draft.excerpt}
                      </p>
                    )}
                  </div>
                  {draft.og_image_url && (
                    <img
                      src={draft.og_image_url}
                      alt=""
                      className="w-20 h-12 object-cover rounded shrink-0"
                    />
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/articles/${draft.slug}?preview=1`}
                    target="_blank"
                    className="text-xs border border-neutral-300 rounded px-3 py-1.5 hover:border-neutral-600 transition-colors"
                  >
                    Preview
                  </Link>
                  <ScheduleForm articleId={draft.id} />
                  <form action={deleteDraft.bind(null, draft.id)} className="ml-auto">
                    <button
                      type="submit"
                      className="text-xs text-neutral-400 hover:text-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Scheduled */}
      {scheduled.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-neutral-900 mb-4">Scheduled</h2>
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-neutral-500">Title</th>
                  <th className="px-4 py-3 text-xs font-medium text-neutral-500">Publishes</th>
                </tr>
              </thead>
              <tbody>
                {scheduled.map((a) => (
                  <tr key={a.id} className="border-b border-neutral-50 last:border-0">
                    <td className="px-4 py-3 text-neutral-800">{a.title}</td>
                    <td className="px-4 py-3 text-neutral-500">{fmtDatetime(a.scheduled_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Rates Review */}
      <RatesReviewSection />

      {/* Analytics */}
      <section>
        <h2 className="text-base font-semibold text-neutral-900 mb-2">Analytics</h2>
        <p className="text-sm text-neutral-500">
          Page views and audience data are tracked by Vercel Analytics.{" "}
          <a
            href="https://vercel.com/dothemathsg/do-the-math/analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Open Vercel Analytics →
          </a>
        </p>
      </section>
    </div>
  );
}
