-- Partnership and feedback submission tables

create table if not exists public.partnership_submissions (
  id           uuid        primary key default gen_random_uuid(),
  name         text        not null,
  title        text        not null,
  email        text        not null,
  organisation text        not null,
  message      text        not null,
  consent      boolean     not null default false,
  submitted_at timestamptz not null default now()
);

alter table public.partnership_submissions enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'partnership_submissions'
    and policyname = 'Anon insert partnership_submissions'
  ) then
    create policy "Anon insert partnership_submissions"
      on public.partnership_submissions for insert to anon with check (true);
  end if;
end $$;

create table if not exists public.feedback_submissions (
  id             uuid        primary key default gen_random_uuid(),
  name           text        not null,
  email          text        not null,
  message        text        not null,
  allow_followup boolean     not null default false,
  submitted_at   timestamptz not null default now()
);

alter table public.feedback_submissions enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'feedback_submissions'
    and policyname = 'Anon insert feedback_submissions'
  ) then
    create policy "Anon insert feedback_submissions"
      on public.feedback_submissions for insert to anon with check (true);
  end if;
end $$;
