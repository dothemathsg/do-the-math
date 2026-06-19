import type { MetadataRoute } from "next";
import { createServerClient } from "@/supabase/server";

const BASE = "https://www.dothemath.sg";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, published_at")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                              lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/mortgage-rates`,          lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/calculator`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/property-prices`,         lastModified: new Date(), changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE}/articles`,                lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/insurance`,               lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/insurance/car`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/insurance/car/rates`,     lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/insurance/life`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/insurance/life/rates`,    lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/insurance/home`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/insurance/home/rates`,    lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/insurance/travel`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/insurance/travel/rates`,  lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/insurance/corporate`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/newsletter`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/partnership`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/feedback`,                lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/about`,                   lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  const articlePages: MetadataRoute.Sitemap = (articles ?? []).map((a) => ({
    url: `${BASE}/articles/${a.slug}`,
    lastModified: new Date(a.published_at!),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages];
}
