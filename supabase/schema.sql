-- ============================================================
-- Do The Math — initial schema
-- Run this in the Supabase SQL editor to create all tables.
-- ============================================================

-- mortgage_rates
create table public.mortgage_rates (
  id          uuid        primary key default gen_random_uuid(),
  bank        text        not null,
  product_name text       not null,
  interest_rate numeric(6,3) not null,
  lock_in_years integer   not null default 0,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.mortgage_rates enable row level security;

create policy "Public read mortgage_rates"
  on public.mortgage_rates
  for select to anon
  using (true);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger mortgage_rates_updated_at
  before update on public.mortgage_rates
  for each row execute procedure public.set_updated_at();

-- banks
create table public.banks (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  website    text,
  logo_url   text,
  created_at timestamptz not null default now()
);

alter table public.banks enable row level security;

create policy "Public read banks"
  on public.banks
  for select to anon
  using (true);

-- articles
create table public.articles (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  content      text,
  published_at timestamptz,
  created_at   timestamptz not null default now()
);

alter table public.articles enable row level security;

create policy "Public read published articles"
  on public.articles
  for select to anon
  using (published_at is not null and published_at <= now());

-- calculators
create table public.calculators (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  created_at  timestamptz not null default now()
);

alter table public.calculators enable row level security;

create policy "Public read calculators"
  on public.calculators
  for select to anon
  using (true);
