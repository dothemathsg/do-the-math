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
        className="mt-10 prose prose-neutral max-w-none article-body"
        dangerouslySetInnerHTML={{ __html: article.content ?? "" }}
      />
    </div>
  );
}
