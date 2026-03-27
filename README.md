# Lotus Systems

Production-oriented workspace for a **multi-product marketplace + provisioning platform** that deploys **isolated customer environments** (separate runtime + separate database per customer).

## What this repo contains
- `app` — Next.js App Router frontend for marketplace and dashboard preview
- `control-plane` — Spring Boot control plane REST API
- `supabase` — Supabase config, migrations, and functions directory

## Core principles
- **No shared multi-tenant runtime for product operational data**
- **Separate deployment and database per customer**
- Provider abstractions for **domains** and **databases**
- Step-based, **idempotent** provisioning with retries, audit logs, and traceability

## Getting started

```bash
npm install
```

### Run the web app
```bash
npm run dev
```

### Run the control plane
```bash
cd control-plane
mvn spring-boot:run
```

## End-to-end local flow

1. Start the control plane on port `8080`.
2. Start the Next.js app on port `3000`.
3. Open the homepage and click "Start Free Demo".
4. The frontend will:
	- load product catalog from `/api/catalog/products`
	- load control-plane health from `/api/support/status`
	- create provisioning jobs via `/api/provisioning/jobs`

## Added pages and flows

- `/products` — live product catalog
- `/plans` — plan matrix generated from product data
- `/checkout` — create checkout session + simulate Stripe webhook completion
- `/provisioning` — create provisioning jobs
- `/admin` — manage products, manage customers, and configure Stripe keys
- `/portal` — customer portal view for profile, subscriptions, and environments

The UI routes call same-origin Next.js API proxies under `/api/*`, which forward to control-plane APIs under `/api/v1/*`.

By default, Next.js proxies to `http://localhost:8080`. To target another control-plane URL:

```bash
CONTROL_PLANE_API_URL=http://your-host:8080 npm run dev
```

## Supabase deployment

This repo is initialized for Supabase CLI usage and is configured to link to:

- Project name: Lotus Systems
- Project ref: baxnuqioqfuqieyqqzlr

### One-time auth

```bash
npm run supabase:login
```

If you are in CI or a headless terminal, set an access token instead:

```bash
export SUPABASE_ACCESS_TOKEN=your_personal_access_token
```

### Deploy workflow

```bash
npm run supabase:link
npm run supabase:db:push
npm run supabase:functions:deploy
```

Or run all steps at once:

```bash
npm run supabase:deploy
```

If no Edge Functions exist under `supabase/functions`, the deploy script now skips that step automatically instead of failing.
