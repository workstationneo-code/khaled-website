create table if not exists public.client_proposals (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  client_name text not null check (char_length(client_name) between 1 and 120),
  client_email text,
  business_name text not null check (char_length(business_name) between 1 and 160),
  project_title text not null check (char_length(project_title) between 1 and 200),
  template_id text not null default 'sat',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  proposal_data jsonb not null default '{}'::jsonb check (jsonb_typeof(proposal_data) = 'object'),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists client_proposals_created_at_idx on public.client_proposals (created_at desc);
create index if not exists client_proposals_status_idx on public.client_proposals (status);

create table if not exists public.client_proposal_responses (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.client_proposals(id) on delete cascade,
  client_name text not null check (char_length(client_name) between 1 and 120),
  client_email text not null check (char_length(client_email) between 3 and 254),
  selected_package text not null check (selected_package in ('Starter','Professional','Elite')),
  package_price numeric(12,2) not null check (package_price >= 0),
  selected_care_plan text not null check (selected_care_plan in ('Basic Care','Complete Care')),
  care_price numeric(12,2) check (care_price is null or care_price >= 0),
  message text check (message is null or char_length(message) <= 2000),
  created_at timestamptz not null default now()
);
create index if not exists client_proposal_responses_proposal_idx on public.client_proposal_responses (proposal_id, created_at desc);
create index if not exists client_proposal_responses_created_at_idx on public.client_proposal_responses (created_at desc);

alter table public.client_proposals enable row level security;
alter table public.client_proposal_responses enable row level security;
grant select on public.client_proposals to anon, authenticated;
grant insert, update, delete on public.client_proposals to authenticated;
grant select on public.client_proposal_responses to authenticated;
grant insert on public.client_proposal_responses to anon, authenticated;

create policy "Published proposals are publicly readable" on public.client_proposals for select to anon, authenticated using (status = 'published');
create policy "Veltrix admins can read all proposals" on public.client_proposals for select to authenticated using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
create policy "Veltrix admins can create proposals" on public.client_proposals for insert to authenticated with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
create policy "Veltrix admins can update proposals" on public.client_proposals for update to authenticated using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin') with check ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
create policy "Veltrix admins can delete proposals" on public.client_proposals for delete to authenticated using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');

create policy "Clients can submit choices for published proposals" on public.client_proposal_responses for insert to anon, authenticated with check (
  exists (select 1 from public.client_proposals p where p.id = proposal_id and p.status = 'published')
);
create policy "Veltrix admins can read proposal responses" on public.client_proposal_responses for select to authenticated using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
