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

function extractDescription(html: string | null): string {
  if (!html) return "Singapore property and mortgage finance guide from Do The Math.";
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > 160 ? text.slice(0, 157) + "…" : text;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data } = await supabase
    .from("articles")
    .select("title, content")
    .eq("slug", slug)
    .single();
  if (!data) return { title: "Article — Do The Math" };
  const description = extractDescription(data.content);
  const url = `https://www.dothemath.sg/articles/${slug}`;
  return {
    title: data.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: data.title,
      description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description,
    },
  };
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.published_at,
    publisher: { "@type": "Organization", name: "Do The Math", url: "https://www.dothemath.sg" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.dothemath.sg/articles/${slug}` },
  };

  return (
    <div className="py-10 max-w-2xl">
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
