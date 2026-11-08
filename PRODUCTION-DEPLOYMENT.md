# Production Deployment Guide — Suzzmed Healthcare

**Stack:** Next.js 14 (App Router) · Prisma 5.22 · Supabase PostgreSQL 17
**Companion docs:** `NETLIFY-DEPLOYMENT.md`, `SUPABASE-SETUP.md`, `DATABASE-VERIFICATION.md`

> **For Netlify deployment:** See `NETLIFY-DEPLOYMENT.md` for exact build settings, environment variables, and platform-specific guidance. This guide covers platform-agnostic production requirements.

---

## 1. Pre-deploy checklist

### 1.1 Credentials

- [x] `DATABASE_URL` — transaction pooler (`ap-northeast-2`, `?pgbouncer=true`, port 6543)
- [x] `DIRECT_URL` — session pooler port 5432 (direct host is IPv6-only; unreachable from this machine — see `SUPABASE-SETUP.md` §2.2)
- [x] `SESSION_SECRET` present, 49 chars (app enforces ≥ 32 at startup)
- [ ] `NEXT_PUBLIC_SITE_URL` — set to the real production origin before launch (still localhost default)
- [ ] Rotate `ADMIN_PASSWORD` / admin accounts before launch (seed password currently works — verified)
- [ ] Confirm `.env` never gets committed (`.gitignore` now includes `.env`; repo not yet under git — initialize with ignore rules in place)

### 1.2 Database checks — ✅ all done (2026-11-08)

- [x] `npx prisma migrate status` → *"Database schema is up to date!"* (baseline checksum `b0dc67de…` verified)
- [x] `npx prisma generate` → generated
- [x] `npm run lint` && `npx tsc --noEmit` && `npm run build` → all pass
- [x] Runtime read spot-check: live counts 17/17 match, `/`, `/sitemap.xml`, `/faq`, `/privacy`, service pages all 200 with PG-sourced content
- [x] Runtime write spot-check: Prisma INSERT/SELECT/DELETE test row PASS (cleaned up)
- [x] Admin credential check: bcrypt verify of stored hash PASS; JWT roundtrip PASS

### 1.3 Security posture (done / to-do)

- [x] Hardcoded JWT fallback secret removed — startup fails without strong `SESSION_SECRET`
- [x] Admin login page no longer prefills or displays credentials
- [x] `.env` git-ignored
- [x] Deny-all RLS on all 17 tables (0 policies)
- [x] `sitemap.ts` is `force-dynamic` (no build-time DB dependency)
- [ ] **Add login rate limiting** (not yet implemented — see report §6.3)
- [ ] Review `AdminUser` rows: remove/rotate any shared demo accounts before launch
- [ ] HTTPS only (platform default) — cookies are already `httpOnly` + `secure` in production + `sameSite=lax`

---

## 2. Environment variables (production)

| Name | Required | Notes |
|---|---|---|
| `DATABASE_URL` | ✅ | Pooler URI + `?pgbouncer=true` |
| `DIRECT_URL` | ✅ | Direct URI for `prisma migrate` |
| `SESSION_SECRET` | ✅ | ≥ 32 chars; startup error if missing/short |
| `NODE_ENV` | ✅ | `production` (enables `secure` cookies) |
| `NEXT_PUBLIC_SITE_URL` | ✅ | e.g. `https://suzzmed.com` |
| `NEXT_PUBLIC_SITE_NAME` | optional | Branding |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | seed-only | Do not need in runtime env if not re-seeding |

---

## 3. Deploy

The app is a standard Next.js app (`next build` → `next start` or platform-managed):

```bash
npm ci
npx prisma generate
npm run build
npm start          # or your platform's equivalent
```

- **Never** run `prisma db push` or `prisma migrate dev` in production. Apply schema changes only via `prisma migrate deploy` (uses `DIRECT_URL`).
- ESLint is skipped during builds (`next.config.js`) — run `npm run lint` in CI instead.
- All data-bearing routes are dynamic (`ƒ`), so the build does not need DB access; runtime does.

### Platform notes

- **Netlify:** See `NETLIFY-DEPLOYMENT.md` for complete guide. Key points:
  - Netlify auto-installs `@netlify/plugin-nextjs` (OpenNext-based) — **do not pin manually**
  - Build command: `npm run build`, publish dir: `.next` (from `netlify.toml`)
  - All env vars in Netlify UI (Site Configuration → Environment Variables)
  - Server Actions, Route Handlers, SSR → Netlify Functions automatically
- **Vercel/serverless:** use the transaction pooler (IPv4) for `DATABASE_URL`; serverless + direct-URL IPv6 will not connect. Set all env vars in the platform UI, not `.env` files.
- **VPS/self-host:** `.env` on the server (mode 600), process manager (systemd/pm2), reverse proxy with TLS.

---

## 4. Post-deploy smoke tests

| # | Check | Expected |
|---|---|---|
| 1 | `GET /` | 200, hero + services render (data from PG) |
| 2 | `GET /services/[slug]` for each active service | 200, content matches pre-migration site |
| 3 | `GET /sitemap.xml` | 200, lists static routes + active services (dynamic) |
| 4 | `GET /faq`, `/privacy`, `/terms` | 200, FAQ/legal content present |
| 5 | `POST` assessment or contact form | Success; row appears in `Lead`/`ContactMessage` (Supabase table editor or SQL) |
| 6 | `GET /admin/login` | Renders **without** pre-filled credentials |
| 7 | Admin login with rotated password | Redirects to `/admin`; `AuditLog` gains a `LOGIN` row |
| 8 | Admin logout | Cookie cleared; audit `LOGOUT` row |
| 9 | Unauthenticated `GET /admin` | Redirected to login |
| 10 | PostgREST probe: `GET /rest/v1/AdminUser` with anon key | **401/403 or empty** (deny-all RLS) — must NOT return rows |

---

## 5. Rollback

1. **App rollback:** redeploy the previous build/commit.
2. **Database data rollback:** Supabase → Dashboard → Database → Backups (restore point-in-in-time). The original SQLite backup (`prisma/backups/dev.db.20261107.f37029b2….bak`, SHA-256 `f37029b2…`) preserves the pre-migration dataset indefinitely.
3. **Schema rollback:** no `migrate down` exists (forward-only). Restore a Supabase backup instead; do not hand-drop tables.

---

## 6. Ongoing operations

- **Migrations:** author with `npx prisma migrate dev --name <name>` locally (against a dev DB), commit the folder, apply in prod with `npx prisma migrate deploy`.
- **Logs:** Supabase Dashboard → Logs; app logs via platform.
- **Backups:** confirm Supabase automatic backups match your plan's retention; test a restore annually.
- **Secrets rotation:** `SESSION_SECRET` rotation invalidates all admin sessions (acceptable — users re-login). DB password rotation: update both URLs, restart.
- **Monitoring:** set up Supabase health advisors periodically (`supabase_get_advisors` via MCP) for RLS/performance regressions when new tables are added — **new tables must get RLS enabled** (deny-all or explicit policies).
