insert into public.products (product_key, name, status, starting_price, description, repository_url, documentation_url, latest_version, download_url)
values
  ('smart-pos', 'Smart POS', 'LIVE', '49/mo', 'Sell, manage inventory, sync orders, and connect optional Salesforce workflows.', 'https://github.com/lotus-systems/smart-pos', 'https://docs.lotussystems.example/smart-pos', 'v3.4.1', 'https://downloads.lotussystems.example/smart-pos/v3.4.1'),
  ('booking-platform', 'Booking Platform', 'PLANNED', '79/mo', 'Reservations, customer records, and operational dashboards for service businesses.', 'https://github.com/lotus-systems/booking-platform', 'https://docs.lotussystems.example/booking-platform', 'v2.1.0', 'https://downloads.lotussystems.example/booking-platform/v2.1.0'),
  ('inventory-control', 'Inventory Control', 'PLANNED', 'custom', 'Stock movement, supplier visibility, reorder levels, and reporting.', 'https://github.com/lotus-systems/inventory-control', 'https://docs.lotussystems.example/inventory-control', 'v1.8.5', 'https://downloads.lotussystems.example/inventory-control/v1.8.5')
on conflict (product_key) do update set
  name = excluded.name,
  status = excluded.status,
  starting_price = excluded.starting_price,
  description = excluded.description,
  repository_url = excluded.repository_url,
  documentation_url = excluded.documentation_url,
  latest_version = excluded.latest_version,
  download_url = excluded.download_url;

insert into public.customers (customer_id, company_name, email, lifecycle_status)
values
  ('demo-customer-001', 'Lotus Mart', 'ops@lotusmart.com', 'ACTIVE'),
  ('demo-customer-002', 'Cinnamon Retail', 'owner@cinnamonretail.com', 'ONBOARDING')
on conflict (customer_id) do update set
  company_name = excluded.company_name,
  email = excluded.email,
  lifecycle_status = excluded.lifecycle_status;

insert into public.subscriptions (
  subscription_id,
  customer_id,
  product_key,
  plan_key,
  status,
  domain,
  database_option,
  environment_status
)
values
  ('sub_seed_001', 'demo-customer-001', 'smart-pos', 'growth', 'ACTIVE', 'pos.lotusmart.com', 'DEDICATED', 'ACTIVE')
on conflict (subscription_id) do update set
  customer_id = excluded.customer_id,
  product_key = excluded.product_key,
  plan_key = excluded.plan_key,
  status = excluded.status,
  domain = excluded.domain,
  database_option = excluded.database_option,
  environment_status = excluded.environment_status;

insert into public.stripe_settings (id, publishable_key, secret_key, webhook_secret)
values (true, 'pk_test_lotus_placeholder', '', '')
on conflict (id) do update set
  publishable_key = excluded.publishable_key,
  secret_key = excluded.secret_key,
  webhook_secret = excluded.webhook_secret;
