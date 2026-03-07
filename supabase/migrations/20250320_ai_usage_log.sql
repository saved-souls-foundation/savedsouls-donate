create table if not exists ai_usage_log (
  id uuid default gen_random_uuid() primary key,
  model text not null,
  input_tokens int not null,
  output_tokens int not null,
  task text,
  estimated_cost_usd numeric(10,6),
  created_at timestamptz default now()
);

create index if not exists ai_usage_log_created_at_idx on ai_usage_log(created_at);
