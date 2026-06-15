import Link from "next/link";
import { createServerClient } from "@/supabase/server";

export const metadata = {
  title: "Learn — Do The Math",
  description: "Singapore mortgage and personal finance guides to help you make smarter property decisions.",
};

export const revalidate = 3600;

export default async function ArticlesPage() {
  const supabase = createServerClient();

  const { data: articles, error } = await supabase
    .from("articles")
    .select("id, title, slug, published_at")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  return (
    <div className="py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Learn</h1>
        <p className="text-neutral-500">
          Singapore mortgage and personal finance guides.
        </p>
      </div>

      {error ? (
        <p className="text-sm text-red-500">Failed to load articles: {error.message}</p>
      ) : !articles?.length ? (
        <p className="text-sm text-neutral-500">No articles yet.</p>
      ) : (
        <div className="divide-y divide-neutral-100">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group flex flex-col gap-1 py-5 hover:opacity-70 transition-opacity"
            >
              <span className="text-xs text-neutral-400">
                {new Date(article.published_at!).toLocaleDateString("en-SG", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <h2 className="text-lg font-medium text-neutral-900 group-hover:underline">
                {article.title}
              </h2>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
