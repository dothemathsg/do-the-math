-- ============================================================
-- Do The Math — initial schema (idempotent)
-- Safe to run multiple times — uses IF NOT EXISTS throughout.
-- ============================================================

-- mortgage_rates
create table if not exists public.mortgage_rates (
  id            uuid         primary key default gen_random_uuid(),
  bank          text         not null,
  product_name  text         not null,
  interest_rate numeric(6,3) not null,
  lock_in_years integer      not null default 0,
  notes         text,
  created_at    timestamptz  not null default now()
);

-- Add updated_at if it was not present at initial table creation
alter table public.mortgage_rates
  add column if not exists updated_at timestamptz not null default now();

alter table public.mortgage_rates enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'mortgage_rates' and policyname = 'Public read mortgage_rates'
  ) then
    create policy "Public read mortgage_rates"
      on public.mortgage_rates for select to anon using (true);
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$ begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'mortgage_rates_updated_at'
  ) then
    create trigger mortgage_rates_updated_at
      before update on public.mortgage_rates
      for each row execute procedure public.set_updated_at();
  end if;
end $$;

-- banks
create table if not exists public.banks (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  slug       text        not null unique,
  website    text,
  logo_url   text,
  created_at timestamptz not null default now()
);

alter table public.banks enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'banks' and policyname = 'Public read banks'
  ) then
    create policy "Public read banks"
      on public.banks for select to anon using (true);
  end if;
end $$;

-- articles
create table if not exists public.articles (
  id           uuid        primary key default gen_random_uuid(),
  title        text        not null,
  slug         text        not null unique,
  content      text,
  published_at timestamptz,
  created_at   timestamptz not null default now()
);

alter table public.articles enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'articles' and policyname = 'Public read published articles'
  ) then
    create policy "Public read published articles"
      on public.articles for select to anon
      using (published_at is not null and published_at <= now());
  end if;
end $$;

-- subscribers
create table if not exists public.subscribers (
  id            uuid        primary key default gen_random_uuid(),
  email         text        not null unique,
  status        text        not null default 'active',
  subscribed_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;

-- property_transactions (URA private residential)
create table if not exists public.property_transactions (
  id            uuid         primary key default gen_random_uuid(),
  project       text         not null,
  street        text,
  district      smallint     not null,
  price         integer      not null,
  area_sqm      numeric(8,2) not null,
  psf           numeric(10,2) generated always as (price / (area_sqm * 10.7639)) stored,
  floor_range   text,
  property_type text,
  tenure        text,
  type_of_sale  text,
  contract_date date         not null,
  imported_at   timestamptz  not null default now(),
  unique (project, district, price, area_sqm, contract_date, floor_range)
);

alter table public.property_transactions enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'property_transactions' and policyname = 'Public read property_transactions'
  ) then
    create policy "Public read property_transactions"
      on public.property_transactions for select to anon using (true);
  end if;
end $$;

create index if not exists idx_prop_tx_district on public.property_transactions (district);
create index if not exists idx_prop_tx_contract_date on public.property_transactions (contract_date desc);

-- district_summary: median PSF and transaction count per district (last 3 months)
create or replace view public.district_summary as
select
  district,
  count(*)::integer                                                          as transaction_count,
  round(percentile_cont(0.5) within group (order by psf)::numeric, 0)::integer as median_psf,
  max(contract_date)                                                         as latest_date
from public.property_transactions
where contract_date >= current_date - interval '3 months'
group by district
order by district;

grant select on public.district_summary to anon;

-- calculators
create table if not exists public.calculators (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  slug        text        not null unique,
  description text,
  created_at  timestamptz not null default now()
);

alter table public.calculators enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'calculators' and policyname = 'Public read calculators'
  ) then
    create policy "Public read calculators"
      on public.calculators for select to anon using (true);
  end if;
end $$;
