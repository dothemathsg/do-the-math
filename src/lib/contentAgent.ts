import { getAnthropic } from "./anthropic";
import { getOpenAI } from "./dalle";
import { createClient } from "@supabase/supabase-js";
import FirecrawlApp from "@mendable/firecrawl-js";

const SOURCES = [
  "https://www.hdb.gov.sg/about-us/news-and-publications/press-releases",
  "https://www.ura.gov.sg/Corporate/Media-Room/Media-Releases",
  "https://www.channelnewsasia.com/topic/property",
  "https://www.propertyguru.com.sg/property-news",
];

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function ensureImageBucket() {
  const supabase = getSupabase();
  const { data, error } = await supabase.storage.getBucket("article-images");
  if (!data || error) {
    await supabase.storage.createBucket("article-images", { public: true });
  }
}

async function uploadImage(
  imageUrl: string,
  slug: string
): Promise<string | null> {
  try {
    await ensureImageBucket();
    const res = await fetch(imageUrl);
    const buf = await res.arrayBuffer();
    const supabase = getSupabase();
    const path = `${slug}/og.png`;
    const { error } = await supabase.storage
      .from("article-images")
      .upload(path, buf, { contentType: "image/png", upsert: true });
    if (error) return null;
    const { data } = supabase.storage.from("article-images").getPublicUrl(path);
    return data.publicUrl;
  } catch {
    return null;
  }
}

async function generateImage(
  title: string,
  topic: string
): Promise<string | null> {
  if (!process.env.OPENAI_API_KEY) return null;
  try {
    const prompt =
      `Professional editorial photograph for a Singapore property finance article titled "${title}". ` +
      `Topic: ${topic}. ` +
      `Clean, modern aesthetic. Singapore skyline or residential estates, warm natural lighting. ` +
      `16:9 wide format, no text overlays.`;

    const result = await getOpenAI().images.generate({
      model: "dall-e-3",
      prompt,
      size: "1792x1024",
      quality: "standard",
      n: 1,
    });
    return result.data?.[0]?.url ?? null;
  } catch {
    return null;
  }
}

export interface ContentPlan {
  id: string;
  topic: string;
  angle: string;
  target_keywords: string[];
  research_notes: string;
  sources: string[];
  status: string;
  created_at: string;
}

export async function runResearch(): Promise<{ count: number }> {
  if (!process.env.FIRECRAWL_API_KEY) {
    throw new Error("FIRECRAWL_API_KEY is not set");
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
  const scraped: string[] = [];

  for (const url of SOURCES) {
    try {
      const result = await firecrawl.scrapeUrl(url, { formats: ["markdown"] });
      if (result.markdown) {
        scraped.push(`### ${url}\n${result.markdown.slice(0, 3000)}`);
      }
    } catch {
      // skip failing sources
    }
  }

  if (scraped.length === 0) {
    throw new Error("All sources failed to scrape");
  }

  const prompt = `You are a content strategist for Do The Math, a Singapore personal finance platform focused on property and mortgages.

Here is recent Singapore property news scraped from authoritative sources:

${scraped.join("\n\n---\n\n")}

Based on this research, identify 4 high-value article opportunities for Singapore property buyers, sellers, and investors.
For each, return a JSON object. Respond ONLY with a JSON array — no markdown fences, no explanation.

Format:
[
  {
    "topic": "short topic label",
    "angle": "specific angle or hook for this article — what question does it answer?",
    "target_keywords": ["keyword1", "keyword2", "keyword3"],
    "research_notes": "2-3 sentences summarising the most relevant facts from the scraped content"
  }
]

Requirements:
- Articles must be relevant to Singapore buyers/sellers/investors right now
- Mix educational evergreen content with timely news-driven pieces
- Avoid duplicating topics already common on PropertyGuru or 99.co
- Focus on actionable, numbers-driven content (TDSR, CPF, costs, timelines)`;

  const response = await getAnthropic().messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  let plans: Array<{
    topic: string;
    angle: string;
    target_keywords: string[];
    research_notes: string;
  }>;

  try {
    // strip possible markdown fences
    const cleaned = text.replace(/^```json\n?|```$/gm, "").trim();
    plans = JSON.parse(cleaned);
  } catch {
    throw new Error(`Claude returned non-JSON: ${text.slice(0, 200)}`);
  }

  const supabase = getSupabase();
  const rows = plans.map((p) => ({
    topic: p.topic,
    angle: p.angle,
    target_keywords: p.target_keywords ?? [],
    research_notes: p.research_notes ?? "",
    sources: SOURCES,
    status: "pending",
  }));

  const { error } = await supabase.from("content_plans").insert(rows);
  if (error) throw error;

  return { count: rows.length };
}

export async function writeArticle(planId: string): Promise<{ slug: string }> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const supabase = getSupabase();

  const { data: plan, error: planErr } = await supabase
    .from("content_plans")
    .select("*")
    .eq("id", planId)
    .single();

  if (planErr || !plan) throw new Error("Content plan not found");

  const prompt = `You are a financial writer for Do The Math (dothemath.sg), Singapore's property finance platform.

Write a complete, publication-ready article for the following brief:

TOPIC: ${plan.topic}
ANGLE: ${plan.angle}
TARGET KEYWORDS: ${(plan.target_keywords as string[]).join(", ")}
RESEARCH NOTES: ${plan.research_notes}

Output a JSON object with exactly these fields (no markdown fences):
{
  "title": "SEO-optimised title (60-70 chars)",
  "excerpt": "2-sentence teaser that captures the article's value (150-160 chars)",
  "content": "<HTML article body>"
}

HTML content requirements:
- 900-1200 words
- Open with a short introductory paragraph (no heading)
- 4-6 h2 sections covering the topic thoroughly
- Use <ul>/<li> lists where practical
- End with a <div class=\"key-takeaways\"><h3>Key Takeaways</h3><ul>...</ul></div> block (3-5 bullet points)
- No <html>, <head>, <body> tags — just the inner content
- Singapore context throughout: reference CPF, HDB, MAS, TDSR, ABSD, BSD where relevant
- Specific numbers and figures where possible
- Link to https://dothemath.sg/calculator for stamp duty calculations where relevant
- Professional but accessible tone — explain jargon the first time it appears`;

  const response = await getAnthropic().messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  let article: { title: string; excerpt: string; content: string };
  try {
    const cleaned = text.replace(/^```json\n?|```$/gm, "").trim();
    article = JSON.parse(cleaned);
  } catch {
    throw new Error(`Claude returned non-JSON: ${text.slice(0, 200)}`);
  }

  // Unique slug
  let slug = slugify(article.title);
  const { data: existing } = await supabase
    .from("articles")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();
  if (existing) slug = `${slug}-${Date.now()}`;

  // Generate + upload OG image
  let ogImageUrl: string | null = null;
  const tempUrl = await generateImage(article.title, plan.topic);
  if (tempUrl) {
    ogImageUrl = await uploadImage(tempUrl, slug);
  }

  const { error: articleErr } = await supabase.from("articles").insert({
    title: article.title,
    slug,
    excerpt: article.excerpt,
    content: article.content,
    status: "draft",
    og_image_url: ogImageUrl,
    published_at: null,
  });

  if (articleErr) throw articleErr;

  await supabase
    .from("content_plans")
    .update({ status: "written" })
    .eq("id", planId);

  return { slug };
}
