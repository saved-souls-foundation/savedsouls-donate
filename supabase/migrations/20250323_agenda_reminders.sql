CREATE TABLE IF NOT EXISTS agenda_reminders (
  id uuid default gen_random_uuid() primary key,
  agenda_item_id uuid,
  recipient_email text,
  reminder_text text,
  taal text default 'nl',
  status text default 'concept',
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_at timestamptz default now()
);
