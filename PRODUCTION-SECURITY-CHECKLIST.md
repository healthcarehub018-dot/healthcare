# Production Security Checklist — Suzzmed Healthcare

**Scope:** Next.js app · Supabase PostgreSQL · Netlify hosting
**Last reviewed:** 2026-11-08

> ⚠️ This checklist is engineering hygiene, **not** a compliance certification. Do not claim HIPAA, DPDP, GDPR, or any other healthcare-compliance status without a formal compliance assessment (data-processing agreements, audit trails, encryption-at-rest policies, breach procedures, DPIA, etc.).

---

## 1. Authentication

| Item | Status | Notes |
|---|---|---|
| Admin login uses bcrypt password hashes | ✅ | `bcryptjs` compare on server only |
| JWT session in httpOnly cookie | ✅ | `httpOnly: true`, `sameSite: "lax"`, `secure` when `NODE_ENV=production` |
| No hardcoded JWT fallback secret | ✅ | App throws at startup unless `SESSION_SECRET` ≥ 32 chars |
| Session validated against DB on each request | ✅ | `getCurrentAdmin()` checks `active` flag |
| Admin pages protected | ✅ | `/admin` → 307 to `/admin/login` when unauthenticated (verified in production) |
| Export API protected | ✅ | `/api/admin/leads/export` → 401 without session (verified) |
| Prefilled credentials on login page | ✅ Removed | Page no longer prefills or displays defaults |
| SESSION_SECRET strength | ✅ | Random 48-char base64 (rotated 2026-11-08) |
| Login rate limiting / lockout | ❌ **Missing** | Only bcrypt cost slows brute force. Add per-IP + per-account throttling (e.g. Upstash Redis / Netlify Edge middleware) before public launch |
| Session revocation | ⚠️ Partial | JWTs are stateless (7-day expiry); `AdminSession` table exists but is unused. For instant revocation, store sessions server-side |

## 2. Database access

| Item | Status | Notes |
|---|---|---|
| All DB access server-side | ✅ | Prisma only imported in server code (`src/lib/db.ts`, actions, route handlers). No `NEXT_PUBLIC_` DB values, no browser DB calls |
| App role | ⚠️ `postgres` (superuser) | Simplest and currently required by Prisma's pooled connection. A restricted role is **feasible but not implemented** (requires Supabase role creation + grants; DB change needs approval) |
| RLS | ✅ Deny-all | Enabled + FORCE on all 17 tables, 0 policies. The `postgres` role has `BYPASSRLS`, so Prisma is unaffected; `anon`/`authenticated` (PostgREST) are fully blocked |
| Connection pooling | ✅ | Transaction pooler (6543, `pgbouncer=true`) from Netlify functions; avoids connection exhaustion |
| Migrations | ✅ Manual only | `prisma migrate deploy`/`status` run locally against `DIRECT_URL`; **no migrations at Netlify build** |
| Destructive commands | 🚫 Prohibited | Never run `migrate reset`, `db push`, or seed scripts against production |
| Backups | ✅ | Supabase automatic backups (plan-dependent) + pre-migration SQLite backup in `prisma/backups/` (git-ignored) |

### Recommended production role (not applied — needs approval)

Create a dedicated `app_user` with `NOSUPERUSER NOBYPASSRLS`, grant `SELECT/INSERT/UPDATE/DELETE` on the 17 tables and `USAGE` on sequences, then point `DATABASE_URL` at it. Because RLS is deny-all, you would also need permissive policies for that role. **Do not change roles/RLS without explicit approval** — it can lock the app out.

## 3. Secrets

| Item | Status |
|---|---|
| `.env` git-ignored | ✅ (`.env`, `.env.*`, `.env.example` kept) |
| No secrets in `NEXT_PUBLIC_*` | ✅ Only site name + URL are public |
| No secrets in git history | ✅ Scanned before push; no credentials in tracked files |
| Netlify production-only credentials | ✅ DB URL + SESSION_SECRET are production-context only |
| Secrets in logs/reports | ✅ Not included in deliverables (values never printed in docs) |
| Database password strength | ⚠️ Set by user; rotate if ever shared in chat/tickets |

## 4. Deployment previews & branches

| Item | Status | Notes |
|---|---|---|
| Deploy preview isolation | ✅ By design | Production env vars are production-context only; previews get no DB credentials → preview DB pages will degrade/404. Acceptable and safer than exposing production data |
| Branch deploys | ✅ Same isolation | Same rule; avoid setting production credentials for branch/deploy-preview contexts |
| Git repo visibility | ⚠️ Public | Repo `healthcarehub018-dot/healthcare` is public — keep it secret-free (verified). Consider making it private |
| Auto-deploy from GitHub | ⚠️ Not connected | Current site deployed via CLI; connect repo for CI/CD or keep manual CLI deploys |

## 5. Transport & headers

| Item | Status |
|---|---|
| HTTPS | ✅ Netlify automatic TLS + HSTS (`strict-transport-security` seen on responses) |
| Secure cookies | ✅ `secure` when `NODE_ENV=production` |
| `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` | ✅ Present — set via `next.config.mjs` `headers()` (observed on production responses) |
| CSP | ⚠️ Not configured | Consider a Content-Security-Policy before launch; test to avoid breaking inline styles/scripts |

## 6. Application inputs

| Item | Status |
|---|---|
| Zod validation on contact/assessment | ✅ Server-side schemas |
| CSV formula-injection sanitization in lead export | ✅ (`= + - @` prefixed) |
| No file uploads to local disk | ✅ Media table stores URLs only; no `fs` usage in app code |
| SQL injection | ✅ Prisma parameterized queries |

## 7. Rate limiting & abuse

- **Missing** on: admin login, contact form, assessment submission, export API.
- Recommended: IP-based limits via Netlify Edge middleware or an external store; add CAPTCHA/honeypot on public forms; monitor function invocations.

## 8. Monitoring & operations

- Netlify function logs: `netlify logs --source functions --function ___netlify-server-handler --since 30m`
- Supabase logs/backups via dashboard; test restore annually.
- Rotate `SESSION_SECRET` on suspicion of compromise (forces all admins to re-login).
- Rotate DB password: update `DATABASE_URL`/`DIRECT_URL` in Netlify + local `.env`, redeploy.
