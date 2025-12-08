-- Update quiz_sessions table to match new requirements
-- We use 'create table if not exists' or just alter if it exists. 
-- For clarity in this file, I will define the full desired schema.
-- If you are running this on an existing table, you might need 'ALTER TABLE' commands.

-- Re-defining the schema for clarity (you can run this to create/replace)
create table if not exists public.quiz_sessions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  device_type text, -- 'mobile', 'desktop'
  country text,
  total_steps int not null,
  current_step int default 0, -- Furthest step reached
  max_step_reached int default 0, -- Keeping this for backward compatibility or clarity
  completed boolean default false,
  time_spent_seconds int default 0,
  answers jsonb default '{}'::jsonb,
  status text default 'visitor' -- 'visitor', 'started', 'qualified', 'completed'
);

-- Index for faster analytics queries
create index if not exists idx_quiz_sessions_created_at on public.quiz_sessions(created_at);
create index if not exists idx_quiz_sessions_status on public.quiz_sessions(status);

-- Enable RLS
alter table public.quiz_sessions enable row level security;

-- Policies
create policy "Allow anonymous inserts" on public.quiz_sessions for insert to anon with check (true);
create policy "Allow service role updates" on public.quiz_sessions for update to service_role;
create policy "Allow service role selects" on public.quiz_sessions for select to service_role;
