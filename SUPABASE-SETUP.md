# Supabase Setup Guide — Suzzmed Healthcare

**Project ref:** `nhcdsajqsslgaxnufzpc`
**Engine:** PostgreSQL 17.11 (Supabase-managed)
**App:** Next.js 14 + Prisma 5.22

---

## 1. Project layout

| Item | Value |
|---|---|
| Tables | 17 app tables in `public` + `_prisma_migrations` |
| Extensions | `pgcrypto`, `uuid-ossp` (installed) |
| RLS | **Enabled + FORCE on all 17 tables, 0 policies (deny-all)** |
| App DB role | `postgres` (superuser, `bypassrls=true`) — Prisma connects as this role, so deny-all RLS does not affect the app |
| Supabase migration history | `supabase_migrations.schema_migrations` (written by MCP `apply_migration`) |
| Prisma migration history | `public._prisma_migrations` (baseline row for `20261107000000_init_postgresql`) |

Two independent migration histories exist by design: Supabase's for MCP-applied changes (e.g. RLS), Prisma's for `prisma migrate` workflow.

---

## 2. Connection strings

**Region: `ap-northeast-2` (Seoul)** — discovered 2026-11-08 by probing pooler auth (tenant id = username `postgres.<REF>`). Both URLs below are live in `.env`.

Get/reset credentials from **Supabase Dashboard → Project → Connect → Connection string → URI**, and the password from **Project Settings → Database** (resettable via *Reset database password* if forgotten).

### 2.1 `DATABASE_URL` — transaction pooler (runtime)

```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

- Port **6543**, **IPv4** — works from this machine and from Vercel/serverless
- Username **must** be `postgres.[PROJECT-REF]` (the tenant identifier; plain `postgres` fails with `ENOIDENTIFIER`)
- **Must** keep `?pgbouncer=true` — Prisma requires it for the transaction pooler

### 2.2 `DIRECT_URL` — migrations

**Used (IPv4 fallback):** session pooler

```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres?sslmode=require
```

- Full session, DDL-capable (verified with BEGIN/CREATE TEMP/ROLLBACK probe) — safe for `prisma migrate`
- **Why not the direct host:** `db.[PROJECT-REF].supabase.co` resolves to **IPv6 only** (`2406:da12:…`) and this machine has no IPv6 route (`Network is unreachable`). If you later run migrations from an IPv6-capable host or CI, prefer the true direct URL:
  `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require`
- **Never** run migrations through the transaction pooler (6543) — DDL over pgbouncer transaction mode is unsafe.

### 2.3 `.env` shape

```env
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
SESSION_SECRET="<openssl rand -base64 48>"   # must be >= 32 chars or the app refuses to start
ADMIN_EMAIL="..."                             # seed-time only
ADMIN_PASSWORD="..."                          # seed-time only; rotate for production
NEXT_PUBLIC_SITE_NAME="Suzzmed"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

Current repo state: **both URLs populated with working values** (region `ap-northeast-2`, password URL-encoded). `.env` is git-ignored — never commit real credentials; never prefix secrets with `NEXT_PUBLIC_`.

---

## 3. Migrations workflow

```bash
# Status (verifies _prisma_migrations checksums incl. baseline)
npx prisma migrate status

# Apply any new migrations (uses DIRECT_URL)
npx prisma migrate deploy

# Generate client after schema changes
npx prisma generate
```

- The initial DDL was applied through the Supabase MCP (`apply_migration`), and a matching baseline row (checksum `b0dc67de…`) was inserted into `_prisma_migrations`, so `migrate deploy` treats it as already applied.
- Supabase-side changes (like the RLS migration `enable_rls_deny_all_public_tables`) are recorded in `supabase_migrations.schema_migrations` only. If you re-create the database from Prisma migrations alone, re-apply RLS:

```sql
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'AdminUser','AdminSession','AuditLog','Appointment','ContactMessage',
    'ContentPage','ContentSection','FAQ','Lead','LegalPage',
    'MediaAsset','NavigationItem','Program','Service','SiteSetting',
    'Testimonial','VerifiedMetric'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;
```

---

## 4. RLS policy

- Current posture: **deny-all** (no policies). Correct for an app that talks to Postgres only through Prisma as `postgres`.
- If you later add Supabase Auth / edge functions using `anon` or `authenticated`, add explicit `SELECT` policies for public content tables (`Service`, `Program`, `ContentPage`, `ContentSection`, `FAQ`, `LegalPage`, `NavigationItem`, `Testimonial`, `VerifiedMetric`, `SiteSetting`) and deny everything else — **never** grant `anon` access to `AdminUser`, `AdminSession`, `Lead`, `Appointment`, `ContactMessage`, `AuditLog`, `MediaAsset`.

---

## 5. Local development

```bash
npm install
npx prisma generate
npm run dev        # uses DATABASE_URL from .env
```

- Original SQLite file remains at `prisma/dev.db` (untouched, backed up) — the app no longer reads it once `.env` points at Postgres.
- Do **not** run `npm run seed` against the migrated database: all seed data is already migrated. (Seed is for empty databases only.)

---

## 6. Monitoring & maintenance

- **Logs:** Supabase Dashboard → Logs (SQL/editor queries via MCP are audit-logged server-side).
- **Backups:** Supabase automatic daily backups (plan-dependent); on-demand: Dashboard → Database → Backups. Additionally keep the SQLite backup at `prisma/backups/` until decommission.
- **Connection limits:** transaction pooler default max client connections ~200; Prisma `connection_limit` should stay modest (default is fine for this app).
