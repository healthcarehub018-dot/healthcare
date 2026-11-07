# Database Migration Report — SQLite → Supabase PostgreSQL

**Project:** Suzzmed Healthcare (medvi)
**Date:** 2026-11-07 → 2026-11-08
**Source:** `prisma/dev.db` (SQLite 3)
**Target:** Supabase project `nhcdsajqsslgaxnufzpc` (PostgreSQL 17.11, aarch64)
**Status:** ✅ Complete — schema, data, verification, security, and live runtime testing all done (2026-11-08).

---

## 1. Summary

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Repository & data audit | ✅ Complete |
| 2 | Backup + restore test | ✅ Complete |
| 3 | Supabase project inspection | ✅ Complete |
| 4 | Prisma schema conversion | ✅ Complete |
| 5 | DDL generation & apply | ✅ Complete |
| 6 | Data migration (82 rows) | ✅ Complete |
| 7 | Verification (counts, FKs, fingerprints) | ✅ Complete — 100% match |
| 8 | Environment finalization (real credentials) | ✅ Complete |
| 9 | Security review & hardening | ✅ Complete (code + RLS) |
| 10 | Runtime testing (`migrate status`, smoke test) | ✅ Complete — all checks PASS |
| 11 | Deployment preparation + docs | ✅ Complete (this document + 3 companions) |

---

## 2. Backup (Phase 2)

- **File:** `prisma/backups/dev.db.20261107.f37029b2….bak` (+ `.dump.sql`, `CHECKSUMS.txt`)
- **SHA-256:** `f37029b2c9cd099d0161c1334990b1e8046d3f0fa9d5c3827b56465c9ed5a469`
- **Restore test:** PASS (restored copy matched checksum; original untouched)
- The backup remains the rollback path for the SQLite side. No data was deleted from SQLite.

---

## 3. Schema Conversion (Phases 4–5)

### 3.1 Prisma changes (`prisma/schema.prisma`)

- `provider = "sqlite"` → `provider = "postgresql"`
- `url = env("DATABASE_URL")` + `directUrl = env("DIRECT_URL")` (direct URL required for migrations; pooler URL for runtime with `pgbouncer=true`)
- Indexes added for query patterns: `AdminUser[email,active]`, `AdminSession[userId]`, `[expiresAt]`, `Service[status,sortOrder]`, `Program[serviceId]`, `[active,sortOrder]`, `ContentSection[visible,sortOrder]`, `FAQ[pageKey,published,sortOrder]`, `Lead[status,createdAt]`, `[serviceId]`, `Appointment[status,createdAt]`, `ContactMessage[status,createdAt]`, `AuditLog[createdAt]`, `[adminUserId]`, `NavigationItem[location,visible,sortOrder]`, `Testimonial[status,showOnHome,sortOrder]`
- `npx prisma validate` → valid

### 3.2 Migration applied

- **Migration:** `prisma/migrations/20261107000000_init_postgresql/migration.sql` (355 lines)
- Generated with `npx prisma migrate diff --from-empty --to-schema-datamodel`
- **Checksum:** `b0dc67deae2dfaf9626afcbd04102c8feb2a14b015a9085e98546501a027c8d7`
- Applied via Supabase MCP `apply_migration` (success), then baseline row inserted into Prisma's `_prisma_migrations` so `prisma migrate deploy` skips it (final verification pending Phase 10).
- `prisma/migrations/migration_lock.toml` → `provider = "postgresql"`
- **No** `db push`, **no** `migrate reset`, **no** destructive SQL used.

### 3.3 Tables (17)

`AdminUser`, `AdminSession`, `Appointment`, `AuditLog`, `ContactMessage`, `ContentPage`, `ContentSection`, `FAQ`, `Lead`, `LegalPage`, `MediaAsset`, `NavigationItem`, `Program`, `Service`, `SiteSetting`, `Testimonial`, `VerifiedMetric`

> Note: `PROJECT.md` states 18 tables — actual count is **17 models/tables** (plus `_prisma_migrations`). Worth correcting in PROJECT.md.

---

## 4. Data Migration (Phase 6)

**Total rows migrated: 82**

| Table | Rows | | Table | Rows |
|---|---:|---|---|---:|
| AdminUser | 2 | | Lead | 2 |
| AuditLog | 1 | | LegalPage | 3 |
| ContentPage | 5 | | NavigationItem | 17 |
| ContentSection | 9 | | Program | 5 |
| FAQ | 8 | | Service | 7 |
| SiteSetting | 15 | | Testimonial | 4 |
| VerifiedMetric | 4 | | AdminSession | 0 |
| Appointment | 0 | | ContactMessage | 0 |
| MediaAsset | 0 | | | |

### Type conversions applied

| SQLite | PostgreSQL | Rule |
|---|---|---|
| `DATETIME` (integer epoch-ms) | `TIMESTAMP(3)` | Converted to `YYYY-MM-DD HH:MM:SS.mmm` literals (verified: all epoch values round-trip) |
| Booleans stored as `0`/`1` | `BOOLEAN` | `TRUE`/`FALSE` |
| JSON stored as `TEXT` | `TEXT` | Kept as-is (no `jsonb` conversion — app reads/writes strings) |
| cuid text PKs | `TEXT` PKs | No sequences created |
| FKs | Real FKs | `AdminSession.userId→AdminUser (CASCADE)`, `Program.serviceId→Service (SET NULL)` |

Data was exported from SQLite, transformed by a generator script (`/tmp/opencode/gen_data_sql.py`), and inserted via MCP `execute_sql` in 4 batches — all succeeded.

---

## 5. Verification (Phase 7) — see `DATABASE-VERIFICATION.md`

- Tier 1 (row counts + id-set MD5): **17/17 PASS**
- FK orphan checks: **0 orphans** on both sides
- Tier 2 (critical-field + timestamp fingerprints): **34/34 MATCH**

---

## 6. Security Review (Phase 9)

### 6.1 Findings fixed (code)

| # | Finding | File | Fix |
|---|---|---|---|
| 1 | Hardcoded JWT fallback secret (`suzzmed-production-secure-secret-key-32-chars`) — allowed token forgery if `SESSION_SECRET` unset | `src/lib/auth.ts` | App now **throws at startup** unless `SESSION_SECRET` ≥ 32 chars |
| 2 | Admin login page pre-filled with email/password **and** displayed default credentials in UI | `src/app/admin/login/page.tsx` | Prefill removed; credentials panel removed |
| 3 | `.env` not git-ignored (only `.env*.local`) — risk of committing secrets | `.gitignore` | Added `.env` |
| 4 | `sitemap.ts` queried DB at build time (would fail build without live DB) | `src/app/sitemap.ts` | Added `export const dynamic = "force-dynamic"` |

Verification: `tsc --noEmit` ✓, `next lint` ✓, `next build` ✓ (all DB routes dynamic).

### 6.2 Findings fixed (database)

| # | Finding | Fix |
|---|---|---|
| 5 | **All 17 tables had RLS disabled** while living in `public` schema → readable via PostgREST/`anon` (including `AdminUser.passwordHash` and `Lead` PII) | Deny-all RLS: `ENABLE ROW LEVEL SECURITY` + `FORCE` on all 17 tables, **0 policies** (migration: `enable_rls_deny_all_public_tables`) |

The application connects as role `postgres` (has `BYPASSRLS`), so deny-all RLS does not affect Prisma. Any future use of `anon`/`authenticated` roles requires explicit policies.

### 6.3 Recommendations (not yet implemented)

- **Login rate limiting / lockout** on `loginAdmin` (currently none; bcrypt cost provides some slowdown only).
- **Rotate admin password** stored in seed/`.env` (`ADMIN_PASSWORD`) for production.
- Rotate `SESSION_SECRET` when moving to production (current local value is 51 chars — length OK, but it lives in a repo-adjacent file).
- Consider moving admin auth from stateless JWT to the (currently empty) `AdminSession` table for server-side revocation.

---

## 7. Phase 8/10 — Credentials & runtime results (completed 2026-11-08)

**Region discovered:** `ap-northeast-2` (Seoul) by probing pooler auth with tenant username `postgres.<REF>`.

Connection setup (password URL-encoded as `%40` for `@`):
- `DATABASE_URL` → transaction pooler `aws-0-ap-northeast-2.pooler.supabase.com:6543?pgbouncer=true&sslmode=require`
- `DIRECT_URL` → session pooler `aws-0-ap-northeast-2.pooler.supabase.com:5432?sslmode=require`
  - Direct host `db.<ref>.supabase.co` is **IPv6-only** and this machine has no IPv6 route (`Network is unreachable`); the session pooler (IPv4, full-session, DDL-capable) is the documented fallback. Verified with a temp-table BEGIN/INSERT/ROLLBACK probe.

**Phase 10 results — all PASS:**

| Check | Result |
|---|---|
| `npx prisma migrate status` | ✅ *"Database schema is up to date!"* (baseline checksum `b0dc67de…` verified) |
| Prisma row counts, all 17 tables vs expected | ✅ 17/17 PASS |
| Sample reads (services, admins, site settings) | ✅ correct data |
| `GET /` | ✅ 200, full content rendered from PG (231 KB) |
| `GET /sitemap.xml` | ✅ 200, 19 URLs = 12 static + all 7 services |
| `GET /faq`, `/privacy`, `/services/weight-management` | ✅ 200 |
| `GET /admin/login` | ✅ 200, zero occurrences of pre-filled/displayed credentials |
| bcrypt check of stored admin hash | ✅ PASS |
| JWT sign/verify roundtrip with `SESSION_SECRET` | ✅ PASS |
| Prisma INSERT + SELECT + DELETE (ContactMessage test row) | ✅ PASS, table cleaned back to 0 |

Note: the pre-migration `next dev` process (started 23:01, stale SQLite client) was returning 500 and was restarted against Postgres.

---

## 8. Files Changed

| File | Change |
|---|---|
| `prisma/schema.prisma` | sqlite → postgresql, directUrl, new indexes |
| `prisma/migrations/20261107000000_init_postgresql/migration.sql` | New (generated DDL) |
| `prisma/migrations/migration_lock.toml` | New (`provider = "postgresql"`) |
| `.env` | DATABASE_URL/DIRECT_URL set to placeholders (original backed up to `.env.orig-backup-<ts>`) |
| `.gitignore` | Added `.env` |
| `src/lib/auth.ts` | Require strong SESSION_SECRET |
| `src/app/admin/login/page.tsx` | Removed credential prefill/display |
| `src/app/sitemap.ts` | `force-dynamic` |
| `DATABASE-MIGRATION-REPORT.md`, `SUPABASE-SETUP.md`, `DATABASE-VERIFICATION.md`, `PRODUCTION-DEPLOYMENT.md` | New deliverables |
