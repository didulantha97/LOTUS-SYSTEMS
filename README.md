# Lotus Systems

Production-oriented monorepo for a **multi-product marketplace + provisioning platform** that deploys **isolated customer environments** (separate runtime + separate database per customer).

## What this repo contains (scaffold)
- `apps/web` — Next.js (TypeScript) marketplace + customer/admin portal (Tailwind CSS)
- `apps/control-plane-api` — Spring Boot control plane REST API (platform metadata + orchestration)
- `apps/provisioning-worker` — background worker for step-based provisioning jobs
- `apps/product-pos-template` — starter template for an isolated Smart POS runtime (frontend/backend/db migrations)
- `packages/*` — shared UI, types, and provider SDKs (billing/domain/database/provisioning)
- `.github/copilot-instructions.md` — primary Copilot instruction file for this project

## Core principles
- **No shared multi-tenant runtime for product operational data**
- **Separate deployment and database per customer**
- Provider abstractions for **domains** and **databases**
- Step-based, **idempotent** provisioning with retries, audit logs, and traceability

## Getting started (pnpm)
> This repo uses **pnpm workspaces**.

```bash
pnpm -v
pnpm install
```

### Run the web app (once scaffolded)
```bash
cd apps/web
pnpm dev
```

## Status
This is the initial project scaffold branch: `scaffold/lotus-systems`.

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
