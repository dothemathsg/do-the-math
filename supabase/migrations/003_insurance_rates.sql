CREATE TABLE IF NOT EXISTS insurance_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,          -- 'car' | 'life' | 'home' | 'travel'
  insurer text NOT NULL,
  plan_name text NOT NULL,
  tier text NOT NULL DEFAULT 'standard',  -- 'basic' | 'standard' | 'premium'
  price numeric NOT NULL,
  price_unit text NOT NULL,        -- 'per-trip' | 'annual' | 'monthly'
  coverage_limit numeric,          -- medical limit, sum assured, contents cover
  coverage_limit_label text,       -- e.g. 'Medical cover', 'Sum assured'
  key_features text[] DEFAULT '{}',
  excess numeric,                  -- car plans
  workshop_type text,              -- car: 'Authorised' | 'Free choice'
  quote_url text,
  is_active boolean NOT NULL DEFAULT true,
  last_updated date NOT NULL DEFAULT current_date
);

CREATE INDEX IF NOT EXISTS idx_insurance_rates_category ON insurance_rates(category);
CREATE INDEX IF NOT EXISTS idx_insurance_rates_price ON insurance_rates(price);

ALTER TABLE insurance_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read insurance_rates"
  ON insurance_rates FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Service role full access insurance_rates"
  ON insurance_rates FOR ALL TO service_role USING (true) WITH CHECK (true);
