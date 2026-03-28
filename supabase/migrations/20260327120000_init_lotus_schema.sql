-- Lotus Systems core marketplace/provisioning schema
-- Creates first-class tables so Supabase project no longer remains empty.

create extension if not exists "pgcrypto";

create table if not exists public.products (
  product_key text primary key,
  name text not null,
  status text not null check (status in ('LIVE', 'PLANNED', 'PAUSED')),
  starting_price text not null,
  description text,
  repository_url text,
  documentation_url text,
  latest_version text,
  download_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  customer_id text primary key,
  company_name text not null,
  email text not null,
  lifecycle_status text not null check (lifecycle_status in ('ONBOARDING', 'ACTIVE', 'SUSPENDED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  subscription_id text primary key,
  customer_id text not null references public.customers(customer_id) on delete cascade,
  product_key text not null references public.products(product_key) on delete restrict,
  plan_key text not null,
  status text not null,
  domain text,
  database_option text,
  environment_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.checkout_sessions (
  session_id text primary key,
  customer_id text not null references public.customers(customer_id) on delete cascade,
  product_key text not null references public.products(product_key) on delete restrict,
  plan_key text not null,
  domain_option text not null,
  database_option text not null,
  payment_status text not null,
  checkout_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.provisioning_jobs (
  job_id text primary key,
  customer_id text not null references public.customers(customer_id) on delete cascade,
  product_key text not null references public.products(product_key) on delete restrict,
  plan_key text not null,
  domain_option text not null,
  database_option text not null,
  status text not null,
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stripe_settings (
  id boolean primary key default true,
  publishable_key text,
  secret_key text,
  webhook_secret text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint only_one_row check (id)
);

insert into public.stripe_settings (id, publishable_key, secret_key, webhook_secret)
values (true, 'pk_test_lotus_placeholder', '', '')
on conflict (id) do nothing;

create index if not exists idx_subscriptions_customer_id on public.subscriptions(customer_id);
create index if not exists idx_subscriptions_product_key on public.subscriptions(product_key);
create index if not exists idx_checkout_sessions_customer_id on public.checkout_sessions(customer_id);
create index if not exists idx_provisioning_jobs_customer_id on public.provisioning_jobs(customer_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists trg_customers_updated_at on public.customers;
create trigger trg_customers_updated_at before update on public.customers
for each row execute function public.set_updated_at();

drop trigger if exists trg_subscriptions_updated_at on public.subscriptions;
create trigger trg_subscriptions_updated_at before update on public.subscriptions
for each row execute function public.set_updated_at();

drop trigger if exists trg_checkout_sessions_updated_at on public.checkout_sessions;
create trigger trg_checkout_sessions_updated_at before update on public.checkout_sessions
for each row execute function public.set_updated_at();

drop trigger if exists trg_provisioning_jobs_updated_at on public.provisioning_jobs;
create trigger trg_provisioning_jobs_updated_at before update on public.provisioning_jobs
for each row execute function public.set_updated_at();

drop trigger if exists trg_stripe_settings_updated_at on public.stripe_settings;
create trigger trg_stripe_settings_updated_at before update on public.stripe_settings
for each row execute function public.set_updated_at();

alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.checkout_sessions enable row level security;
alter table public.provisioning_jobs enable row level security;
alter table public.stripe_settings enable row level security;

-- For initial bootstrapping: allow authenticated service interactions.
create policy if not exists "service_role_products_all"
  on public.products
  for all
  to service_role
  using (true)
  with check (true);

create policy if not exists "service_role_customers_all"
  on public.customers
  for all
  to service_role
  using (true)
  with check (true);

create policy if not exists "service_role_subscriptions_all"
  on public.subscriptions
  for all
  to service_role
  using (true)
  with check (true);

create policy if not exists "service_role_checkout_sessions_all"
  on public.checkout_sessions
  for all
  to service_role
  using (true)
  with check (true);

create policy if not exists "service_role_provisioning_jobs_all"
  on public.provisioning_jobs
  for all
  to service_role
  using (true)
  with check (true);

create policy if not exists "service_role_stripe_settings_all"
  on public.stripe_settings
  for all
  to service_role
  using (true)
  with check (true);
