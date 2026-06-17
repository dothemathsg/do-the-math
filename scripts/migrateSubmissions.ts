import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

const sql = `
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
  id              uuid        primary key default gen_random_uuid(),
  name            text        not null,
  email           text        not null,
  message         text        not null,
  allow_followup  boolean     not null default false,
  submitted_at    timestamptz not null default now()
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
`;

async function main() {
  const { error } = await supabase.rpc("exec_sql", { sql }).single();
  if (error) {
    // exec_sql may not exist — try raw REST approach via pg_meta isn't available
    // Fall back: run each statement individually via supabase.from workaround
    console.error("exec_sql RPC not available:", error.message);
    console.log("Please run the SQL in supabase/migrations/001_submissions.sql manually via the Supabase dashboard SQL editor.");
    process.exit(1);
  }
  console.log("Tables created successfully.");
}

main().catch(console.error);
