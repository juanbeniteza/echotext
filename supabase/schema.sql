-- Create links table for storing text configurations
create table public.links (
  id text primary key,
  config jsonb not null,
  created_at timestamp with time zone default now() not null,
  expires_at timestamp with time zone,
  view_count integer default 0 not null,
  user_id uuid
);

-- Set up RLS (Row Level Security) to allow anonymous access
alter table public.links enable row level security;

-- Create policies to allow reading and writing records
create policy "Allow anonymous insert" on public.links 
  for insert with check (true);

create policy "Allow anonymous select" on public.links 
  for select using (true);

create policy "Allow anonymous update" on public.links 
  for update using (true);
  
-- Create index for faster ID lookups
create index links_id_idx on public.links (id); 