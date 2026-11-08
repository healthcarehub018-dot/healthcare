# Netlify Deployment Guide — Suzzmed Healthcare

**Live site:** https://suzzmed-healthcare.netlify.app
**Netlify project:** `suzzmed-healthcare` (id `1beced1f-6e5d-4d28-bd93-bdfa81642622`, team `rizvimohdmohsin` / "site development")
**GitHub repo:** https://github.com/healthcarehub018-dot/healthcare
**Stack:** Next.js 14.2.35 (App Router) · React 18 · Prisma 5.22 · Supabase PostgreSQL 17

---

## 1. How the deployment works

- Netlify's **current Next.js Runtime** (OpenNext-based `@netlify/plugin-nextjs` v5, supports Next.js 13.5+) is installed **automatically**. Do **not** add it to `package.json` or pin a version — Netlify docs explicitly recommend letting it update on every build.
- SSR, Server Actions, Route Handlers and dynamic pages are packaged into one Netlify Function (`___netlify-server-handler`).
- Prisma Client is generated at install time via `postinstall: prisma generate` and **must include the `rhel-openssl-3.0.x` engine** — Netlify Functions run on AWS Lambda (Amazon Linux). See `prisma/schema.prisma`:

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}
```

> ⚠️ This is the #1 failure mode seen during setup: without `rhel-openssl-3.0.x`, all DB-backed pages 404 (data functions swallow errors) and `/sitemap.xml` 500s with *"Prisma Client could not locate the Query Engine for runtime rhel-openssl-3.0.x"*.

## 2. Build configuration (`netlify.toml`)

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "22"
```

| Setting | Value |
|---|---|
| Build command | `npm run build` (`next build`) |
| Publish directory | `.next` |
| Node version | 22 |
| Framework preset | Next.js (auto-detected) |
| Adapter | auto (`@netlify/plugin-nextjs` — do not pin) |
| Static export | **not used** (`output: "export"` absent — SSR preserved) |

`package.json` scripts:

```json
{
  "build": "next build",
  "postinstall": "prisma generate"
}
```

No migrations run at build time. `DIRECT_URL` is only for manual/local `prisma migrate` commands — never part of the Netlify build.

## 3. Connect GitHub → Netlify (dashboard flow)

1. Netlify dashboard → **Add new project** → **Import an existing project** → **GitHub**.
2. Authorize Netlify GitHub App for `healthcarehub018-dot` (or the account that owns the repo).
3. Select repo `healthcarehub018-dot/healthcare`, branch `main`.
4. Build settings: command `npm run build`, publish `.next` — Netlify usually auto-detects; `netlify.toml` in the repo already sets them.
5. **Site configuration → Environment variables** → add the variables from `NETLIFY-ENV-CHECKLIST.md`.
6. Deploy. Every push to `main` then triggers a production build.

> The current live site was deployed via Netlify CLI (`netlify deploy --build --prod`) and is **not yet connected to GitHub**, so pushes do not auto-redeploy. Connecting the repo (steps above) is recommended for continuous deployment.

## 4. CLI deployment (what was used)

```bash
npm install -g netlify-cli        # once
netlify login                     # once (browser)
netlify link --id 1beced1f-6e5d-4d28-bd93-bdfa81642622
netlify deploy --build --prod     # builds locally + deploys production
```

- `--build` runs `netlify.toml`'s build locally, then uploads the Next runtime function bundle.
- First build takes ~4–6 min (adapter/dependency install); later builds are faster.
- `.netlify/` (local state) is git-ignored.

## 5. Environment variables

Set in **Project configuration → Environment variables** (see full table in `NETLIFY-ENV-CHECKLIST.md`):

| Variable | Context | Notes |
|---|---|---|
| `DATABASE_URL` | production | Supabase **transaction pooler**, port 6543, `?pgbouncer=true&sslmode=require` |
| `DIRECT_URL` | production | Supabase **session pooler**, port 5432 (direct host is IPv6-only) |
| `SESSION_SECRET` | production | ≥ 32 chars; app refuses to start without it |
| `NEXT_PUBLIC_SITE_URL` | all | `https://suzzmed-healthcare.netlify.app` (inlined at build) |
| `NEXT_PUBLIC_SITE_NAME` | all | `Suzzmed Healthcare` |

`ADMIN_EMAIL` / `ADMIN_PASSWORD` are **not required** at runtime (seed only). Do not set them on Netlify.

## 6. Verification (post-deploy)

```bash
BASE=https://suzzmed-healthcare.netlify.app
curl -s -o /dev/null -w '%{http_code}\n' $BASE/                       # 200
curl -s -o /dev/null -w '%{http_code}\n' $BASE/services/weight-management  # 200
curl -s -o /dev/null -w '%{http_code}\n' $BASE/faq                    # 200
curl -s -o /dev/null -w '%{http_code}\n' $BASE/privacy                # 200
curl -s -o /dev/null -w '%{http_code}\n' $BASE/sitemap.xml            # 200 (+ <loc> with netlify domain)
curl -s -o /dev/null -w '%{http_code}\n' $BASE/admin                  # 307 → /admin/login
curl -s -o /dev/null -w '%{http_code}\n' $BASE/api/admin/leads/export # 401 (auth guard)
```

Verified on 2026-11-08: all public routes 200, `/admin` 307, export API 401, sitemap 19 URLs (12 static + 7 services), FAQ/legal/service content served from Supabase, admin login page has no prefilled credentials.

## 7. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| DB pages 404, `/sitemap.xml` 500, logs say *"Prisma Client could not locate the Query Engine for runtime rhel-openssl-3.0.x"* | Prisma generated only the Debian engine | Add `binaryTargets = ["native", "rhel-openssl-3.0.x"]` (already done) and redeploy |
| Function 500: *"Environment variable not found: DATABASE_URL"* | Env var not in Functions scope / wrong context | Set `DATABASE_URL` for the **production** context and redeploy (env changes require a redeploy) |
| First request after idle returns 502 | Lambda cold start + remote DB connection | Expected occasionally; subsequent requests are fast. Optionally warm the site or increase function timeout |
| P1001 / timeout reaching DB | Pointing at direct host `db.<ref>.supabase.co` (IPv6-only) | Use the transaction pooler (port 6543) for `DATABASE_URL` |
| Prisma prepared statement errors | Pooler URL missing `pgbouncer=true` | Keep `?pgbouncer=true` in `DATABASE_URL` |
| 404 on all routes | `output: "export"` was added | Remove it — this app requires SSR |
| Build fails: Next.js runtime not found | Adapter pinned to old version | Remove `@netlify/plugin-nextjs` from `package.json`/`netlify.toml`; let Netlify manage it |

## 8. Do-not list

- Do **not** run `prisma db push`, `prisma migrate reset`, or seed scripts on Netlify.
- Do **not** add DB credentials to `NEXT_PUBLIC_*` variables.
- Do **not** pin/downgrade `@netlify/plugin-nextjs`.
- Do **not** enable static export.
