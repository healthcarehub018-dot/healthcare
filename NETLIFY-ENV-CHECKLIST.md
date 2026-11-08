# Netlify Environment Checklist — Suzzmed Healthcare

Project: `suzzmed-healthcare` · Site: https://suzzmed-healthcare.netlify.app
Dashboard path: **Project configuration → Environment variables**

---

## 1. Required production variables

| Variable | Public? | Required at | Context | Source | Purpose |
|---|---|---|---|---|---|
| `DATABASE_URL` | ❌ Private (secret) | Runtime (Functions) + build | **production** | Supabase → Connect → **Transaction pooler** URI (port 6543, `?pgbouncer=true&sslmode=require`), password URL-encoded (`@` → `%40`) | Prisma runtime DB access |
| `DIRECT_URL` | ❌ Private (secret) | Local/manual migrations only | production (harmless) | Supabase → session pooler URI (port 5432) — direct host is IPv6-only | `prisma migrate` / `migrate status` |
| `SESSION_SECRET` | ❌ Private (secret) | Runtime + build | **production** | `openssl rand -base64 48` (≥ 32 chars enforced by app) | JWT signing for admin sessions |
| `NEXT_PUBLIC_SITE_URL` | ✅ Public | Build (inlined) + runtime | all | `https://suzzmed-healthcare.netlify.app` (replace with custom domain later) | Sitemap/robots/canonical URLs |
| `NEXT_PUBLIC_SITE_NAME` | ✅ Public | Build (inlined) | all | `Suzzmed Healthcare` | Branding/metadata |

## 2. Variables NOT needed on Netlify

| Variable | Why |
|---|---|
| `ADMIN_EMAIL` | Seed script only (`prisma seed`) — no runtime use |
| `ADMIN_PASSWORD` | Seed script only — never set in production |
| `NODE_VERSION` | Already set in `netlify.toml` (`[build.environment] NODE_VERSION = "22"`); it appears in Netlify's variable list with source "netlify.toml" |

## 3. Netlify scopes explained

Netlify env vars have two dimensions: **contexts** (production / deploy-preview / branch-deploy / dev) and **scopes** (builds / functions / runtime / post-processing).

- **Functions scope** → makes the value available to serverless functions at runtime. Required for `DATABASE_URL`, `SESSION_SECRET`.
- **Builds scope** → available during `npm run build`. Required for `NEXT_PUBLIC_*` (they are inlined into the bundle at build time) and for `prisma generate` if it needed the DB URL.
- `DIRECT_URL` only needs to exist locally for migrations; keeping it in production context is harmless but not required at runtime.
- Changing an env var requires a **new deploy** to take effect.

Recommended setting when creating each variable: leave scopes at **all scopes** (default) and restrict **contexts** as shown above.

## 4. Current state (verified 2026-11-08)

- `DATABASE_URL`, `DIRECT_URL`, `SESSION_SECRET` → set with **production** context only (deploy previews will not receive production DB credentials by design).
- `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_SITE_URL` → set for **all** contexts.
- `NODE_VERSION = 22` → from `netlify.toml` (builds/post-processing scopes).
- Verified working: production functions successfully query Supabase (sitemap/FAQ/legal/service pages serve live data).

## 5. Security rules

1. Only `NEXT_PUBLIC_*` values may be public — they are embedded in the client bundle. Never prefix DB URLs, passwords, or secrets with `NEXT_PUBLIC_`.
2. Production credentials (`DATABASE_URL`, `SESSION_SECRET`) must be **production-context only** so untrusted deploy previews/branch deploys cannot touch the production database.
3. `.env` is git-ignored and must never be committed. Use `.env.example` for templates.
4. Rotate `SESSION_SECRET` if it is ever exposed (this invalidates all admin sessions).
5. If a deploy preview needs a database, create a separate Supabase project/branch and set preview-scoped credentials — never reuse production.
