# Deployment Readiness Report — Suzzmed Healthcare (Netlify)

**Date:** 2026-11-08
**Platform:** Netlify (full Next.js app — SSR, Server Actions, Route Handlers)
**Live:** https://suzzmed-healthcare.netlify.app
**Verdict:** ✅ **READY** — deployed and verified in production; 2 warnings (see §7).

---

## 1. Stack & repository state

| Item | Value | Status |
|---|---|---|
| Next.js | 14.2.35 (App Router) | ✅ supported by current Netlify Next.js Runtime (Next ≥13.5) |
| React | 18 | ✅ |
| TypeScript | strict, `tsc --noEmit` clean | ✅ |
| Prisma | 5.22.0 (`@prisma/client` + CLI pinned) | ✅ |
| Database | Supabase PostgreSQL 17 (poolers only; direct host is IPv6) | ✅ |
| Node | 22 (`netlify.toml`), local v22.23.4, npm 10.9.9, lockfile v3 | ✅ |
| Static export | **absent** (`output: "export"` not used) | ✅ SSR preserved |
| Adapter | not installed/pinned — Netlify auto-manages (`@netlify/plugin-nextjs` v5+) | ✅ per current docs |

## 2. Netlify configuration

`netlify.toml` (minimal, no redundant/outdated settings):

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "22"
```

- No `[[plugins]]` block — adapter is auto-installed and kept current by Netlify.
- No redirects/rewrites needed; no static-export flags.
- `package.json` adds `"postinstall": "prisma generate"` so a clean install always generates the client.

## 3. Critical fix found & applied

**Prisma engine mismatch (production-breaking).** Netlify Functions run on AWS Lambda (`rhel-openssl-3.0.x`) while local generation produced only `debian-openssl-3.0.x`. Symptom: every DB-backed page silently fell back to empty data (services/legal pages → 404), `/sitemap.xml` → 500, function logs showed *"Prisma Client could not locate the Query Engine for runtime rhel-openssl-3.0.x"*.

Fix in `prisma/schema.prisma`:

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}
```

After redeploy both engines are bundled; all DB routes verified live.

## 4. Compatibility verification

| Feature | Result |
|---|---|
| App Router (server components) | ✅ |
| Server Actions (`auth`, `cms`, `contact`, `assessment`) | ✅ |
| Route Handler (`/api/admin/leads/export`) | ✅ 401 without session |
| SSR / `revalidate = 0` pages | ✅ dynamic (`ƒ`) |
| Dynamic route `/services/[slug]` | ✅ `force-dynamic` (no build-time DB dependency) |
| Admin auth (JWT httpOnly cookie, bcrypt) | ✅ guard redirects 307 |
| Image optimization (Unsplash remotePatterns) | ✅ Netlify Image CDN |
| No middleware / no edge runtime / no edge Prisma | ✅ nothing to break |
| Prisma singleton (`globalThis`) | ✅ one client per runtime instance |
| Runtime DB via transaction pooler (`pgbouncer=true`) | ✅ live queries verified |
| Migrations at build | ✅ none run (manual/local only) |

## 5. Environment variables

`DATABASE_URL`, `DIRECT_URL`, `SESSION_SECRET` → **production context only** (preview builds get no production credentials).
`NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_SITE_URL` → all contexts.
`ADMIN_EMAIL` / `ADMIN_PASSWORD` → **not set** (seed-only). See `NETLIFY-ENV-CHECKLIST.md`.

No secret is exposed via `NEXT_PUBLIC_*`; only site name + URL are public.

## 6. Build & test results

| Check | Result |
|---|---|
| `npm ci` | ✅ clean install |
| `npx prisma validate` | ✅ valid |
| `npx prisma generate` | ✅ both engines (`native`, `rhel-openssl-3.0.x`) |
| `npx tsc --noEmit` | ✅ 0 errors |
| `npm run lint` | ✅ 0 warnings/errors |
| `npm run build` | ✅ compiled; 37/37 pages generated; all DB routes dynamic |
| Netlify production build | ✅ 2 deploys succeeded |
| Production smoke test | ✅ all 19 routes 200; guards 307/401 |

**Production route results:** `/`, `/programs`, `/services/weight-management`, `/services/peptides-longevity`, `/services/womens-wellness`, `/faq`, `/privacy`, `/terms`, `/medical-disclaimer`, `/reviews`, `/how-it-works`, `/about`, `/weight-loss`, `/sitemap.xml`, `/robots.txt`, `/admin/login`, `/assessment`, `/contact` → **200**. `/admin` → **307**, `/api/admin/leads/export` → **401**. Sitemap contains 19 URLs (12 static + 7 services) on the Netlify domain; FAQ/legal/service content served from Supabase; login page has no prefilled credentials.

## 7. Warnings (non-blocking)

1. **`npm audit`: 2 advisories (1 high, 1 critical) in Next's bundled `postcss`.** Fix requires `next@16` (breaking major upgrade). Not a Netlify blocker; plan a Next 15/16 upgrade separately and re-run the full regression suite.
2. **No login rate limiting / no CSP.** Recommended before public launch (see `PRODUCTION-SECURITY-CHECKLIST.md`).
3. **Deploy previews have no DB** (production-only credentials by design) — preview DB pages will degrade; acceptable for credential isolation.
4. **Site is not yet connected to GitHub** (CLI deploys only). Connect the repo for push-to-deploy, or continue CLI deploys.

## 8. Database safety

- No schema or data changes were made for deployment.
- No `db push`, `migrate reset`, seed, or destructive SQL was run.
- Prisma provider is `postgresql`; migration `20261107000000_init_postgresql` intact; `migrate status` = up to date.
- RLS deny-all remains on all 17 tables; app connects as `postgres` (BYPASSRLS) as before.
