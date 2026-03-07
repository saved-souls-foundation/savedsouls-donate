CREATE TABLE IF NOT EXISTS social_posts (
  id uuid default gen_random_uuid() primary key,
  blog_post_id uuid references posts(id),
  facebook text,
  instagram text,
  kort text,
  status text default 'concept',
  created_at timestamptz default now()
);
