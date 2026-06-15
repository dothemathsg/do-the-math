import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerClient } from "@/supabase/server";

export const revalidate = 3600;

export async function generateStaticParams() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("articles")
    .select("slug")
    .not("published_at", "is", null);
  return (data ?? []).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data } = await supabase
    .from("articles")
    .select("title")
    .eq("slug", slug)
    .single();
  return { title: data ? `${data.title} — Do The Math` : "Article — Do The Math" };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServerClient();

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .not("published_at", "is", null)
    .single();

  if (!article) notFound();

  return (
    <div className="py-10 max-w-2xl">
      <Link
        href="/articles"
        className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors"
      >
        ← Learn
      </Link>

      <div className="mt-6 space-y-4">
        <p className="text-sm text-neutral-400">
          {new Date(article.published_at!).toLocaleDateString("en-SG", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <h1 className="text-3xl font-semibold text-neutral-900">{article.title}</h1>
      </div>

      <div
        className="mt-10 prose prose-neutral max-w-none
          prose-headings:font-semibold prose-headings:text-neutral-900
          prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
          prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
          prose-p:text-neutral-600 prose-p:leading-7
          prose-li:text-neutral-600
          prose-strong:text-neutral-900 prose-strong:font-medium
          prose-a:text-neutral-900 prose-a:underline
          prose-table:text-sm prose-th:text-left prose-th:font-medium prose-th:text-neutral-500
          prose-td:text-neutral-600 prose-td:py-2 prose-th:py-2
          [&_.lead]:text-lg [&_.lead]:text-neutral-700 [&_.lead]:leading-8"
        dangerouslySetInnerHTML={{ __html: article.content ?? "" }}
      />
    </div>
  );
}
