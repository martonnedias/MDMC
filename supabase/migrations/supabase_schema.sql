-- Create leads table
create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  type text not null,
  data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on leads
alter table public.leads enable row level security;

-- Create policy for inserts (public)
create policy "Allow public inserts to leads"
  on public.leads for insert
  with check (true);

-- Create policy for select (admins only - RESTRICTED BY EMAIL)
-- Adicione seus e-mails de admin aqui
create policy "Allow authenticated selects from leads"
  on public.leads for select
  using (
    auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br')
  );

-- Create swot_briefings table
create table if not exists public.swot_briefings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  type text not null default 'SWOT_ANALYSIS',
  data jsonb not null,
  plan text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on swot_briefings
alter table public.swot_briefings enable row level security;

-- Create policy for inserts (public/authenticated)
create policy "Allow public inserts to swot_briefings"
  on public.swot_briefings for insert
  with check (true);

-- Create policy for select (admins only - RESTRICTED BY EMAIL)
create policy "Allow authenticated selects from swot_briefings"
  on public.swot_briefings for select
  using (
    auth.jwt() ->> 'email' in ('martonnedias@gmail.com', 'admin@mdsolution.com.br')
  );
