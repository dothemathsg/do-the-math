-- Add content-manager columns to articles
ALTER TABLE articles ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS scheduled_at timestamptz;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS og_image_url text;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS excerpt text;

CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);

-- Content plans (research output)
CREATE TABLE IF NOT EXISTS content_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  angle text NOT NULL,
  target_keywords text[] DEFAULT '{}',
  research_notes text,
  sources jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'pending',  -- pending, approved, rejected, written
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_plans_status ON content_plans(status);

ALTER TABLE content_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to content_plans"
  ON content_plans FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Page views for analytics
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  viewed_at timestamptz NOT NULL DEFAULT now(),
  referrer text
);

CREATE INDEX IF NOT EXISTS idx_page_views_slug ON page_views(slug);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views(viewed_at DESC);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can insert page_views"
  ON page_views FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Service role can read page_views"
  ON page_views FOR SELECT TO service_role USING (true);
