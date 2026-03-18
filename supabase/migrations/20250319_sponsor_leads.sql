create table if not exists public.sponsor_leads (
  id uuid primary key default gen_random_uuid(),
  animal_id text not null,
  animal_name text not null,
  animal_type text not null check (animal_type in ('dog', 'cat')),
  donor_name text not null,
  donor_email text not null,
  message text,
  locale text,
  created_at timestamptz default now()
);

alter table public.sponsor_leads enable row level security;

create policy "Admin only"
  on public.sponsor_leads
  for all
  using (false);
