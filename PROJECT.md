# Suzzmed Healthcare — Full Project Documentation

> **Purpose of this file:** A complete, self-contained handoff document so that any developer or AI agent can understand, run, modify, and deploy this website without prior context.
>
> **Project slug:** `medvi` (package.json) · **Brand:** Suzzmed Healthcare · **Type:** Telehealth marketing website + headless admin CMS
> **Last documented:** November 2026

---

## 1. What This Project Is

A production-style **medical telehealth marketing website** with a **built-in admin CMS**, built as a clone/rebuild of a reference "MEDVi" homepage design (see `IMPLEMENTATION-NOTES.md`). It markets personalized telehealth programs (weight management, men's/women's wellness, nutrition, peptides/longevity, hair, skincare) and captures leads through a multi-step assessment wizard.

Two halves:

1. **Public marketing site** — server-rendered pages driven by database content (services, programs, testimonials, FAQs, navigation, settings, homepage sections).
2. **Admin dashboard at `/admin`** — password-protected CMS to edit all of the above, manage leads/messages/appointments, export leads to CSV, and view audit logs.

There is **no test suite, no CI, no Dockerfile, and no email/SMTP integration** (form submissions only write to the database).

---

## 2. Tech Stack

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js (App Router, Server Components, Server Actions) | 14.2.35 |
| Language | TypeScript (`strict: true`) | ^5 |
| UI | React | ^18 |
| Styling | Tailwind CSS (+ `clsx`, `tailwind-merge` via `cn()` helper) | ^3.4.1 |
| ORM / DB | Prisma + **SQLite** (file `prisma/dev.db`) | 5.22.0 |
| Validation | Zod | ^4.6.7 |
| Auth | JWT (`jsonwebtoken`, HS256) in httpOnly cookie + `bcryptjs` password hashes | ^9 / ^3 |
| Icons | `lucide-react` | ^1.70 |
| Seed runner | `tsx` (runs `prisma/seed.ts`) | ^4.23 |
| Runtime used locally | Node.js | v22 |

Key config facts:

- **Path alias:** `@/*` → `./src/*` (tsconfig.json).
- **ESLint is ignored during builds** (`next.config.mjs` → `eslint.ignoreDuringBuilds: true`). `.eslintrc.json` extends `next/core-web-vitals` with several rules disabled (unused vars, `any`, unescaped entities, `<img>`).
- **Next/Image:** only `images.unsplash.com` is allowed as a remote host.
- **No tests, no CI workflows, no Docker, no `vercel.json`/`render.yaml`.**

---

## 3. Quick Start (Run Locally)

```bash
npm install                 # installs deps; also generates Prisma client via postinstall
cp .env.example .env        # if .env doesn't exist yet
npx prisma generate         # generate Prisma client (safe to re-run)
npx prisma db push          # sync schema with prisma/dev.db (already in sync in this repo)
npm run seed                # OPTIONAL: re-seed demo data (idempotent upserts for most models)
npm run dev                 # http://localhost:3000
```

Other scripts (package.json):

- `npm run build` → `next build`
- `npm run start` → `next start`
- `npm run lint` → `next lint`

> **Note:** The repo already ships a seeded `prisma/dev.db` (7 services, 5 programs, 9 homepage sections, 8 FAQs, 4 testimonials, 2 admins, 15 settings, 2 sample leads). Seeding again is safe (upserts), but note that seed `create`s (FAQs, testimonials, nav items, metrics) will **duplicate** if run twice for those models — the FAQ/testimonial/nav/metric seeds use `create` without existence checks. See §6 seed notes.

### Environment variables (`.env` / `.env.example`)

| Key | Purpose | Example |
|---|---|---|
| `DATABASE_URL` | Prisma SQLite file (relative to `prisma/`) | `file:./dev.db` |
| `SESSION_SECRET` | JWT signing secret (≥32 chars) | any random string |
| `ADMIN_EMAIL` | Primary admin email used by seed | `admin@suzzmed.local` |
| `ADMIN_PASSWORD` | Primary admin password used by seed | `AdminPassword2026!` |
| `NEXT_PUBLIC_SITE_NAME` | Display name | `Suzzmed Healthcare` |
| `NEXT_PUBLIC_SITE_URL` | Base URL for robots.txt & sitemap.xml | `http://localhost:3000` |

---

## 4. Repository Layout

```
medvi/
├── package.json / package-lock.json
├── next.config.mjs            # eslint ignored in builds; unsplash image host allowed
├── tsconfig.json              # strict; path alias @/* → ./src/*
├── tailwind.config.ts         # design tokens (colors, fonts, radii, maxWidths, xs breakpoint)
├── postcss.config.mjs
├── .eslintrc.json
├── .env / .env.example
├── IMPLEMENTATION-NOTES.md    # notes about the homepage-clone task
├── PROJECT.md                 # this file
├── prisma/
│   ├── schema.prisma          # 18 models, SQLite datasource
│   ├── seed.ts                # 838-line demo/seed data
│   └── dev.db                 # committed SQLite database (seeded)
├── public/fonts/              # self-hosted Onest + Red Hat Text woff2
└── src/
    ├── actions/               # Server Actions ("use server")
    │   ├── auth.ts            # loginAdmin / logoutAdmin
    │   ├── assessment.ts      # submitAssessmentInquiry → Lead
    │   ├── contact.ts         # submitContactMessage → ContactMessage (Zod)
    │   └── cms.ts             # all admin CRUD + ensureAdmin() guard + audit + revalidatePath
    ├── lib/
    │   ├── db.ts              # Prisma client singleton
    │   ├── auth.ts            # JWT sign/verify, cookie helpers, getCurrentAdmin
    │   ├── data.ts            # read-only data accessors (all with try/catch fallbacks)
    │   └── utils.ts           # cn(), formatCurrency(), formatDate(), generateRefCode()
    ├── app/                   # Next.js App Router pages (see §7 routing map)
    │   ├── layout.tsx         # root layout; hard-coded metadata/viewport
    │   ├── globals.css        # @font-face, CSS variables, keyframes, reveal utilities
    │   ├── page.tsx           # homepage (composed of src/components/home/*)
    │   ├── robots.ts / sitemap.ts
    │   └── admin/(dashboard)/ # route group: guarded admin UI + AdminSidebar
    └── components/
        ├── home/              # homepage-specific components (custom design)
        ├── marketing/         # shared marketing components (Header/Footer/etc.)
        └── admin/             # AdminSidebar
```

### ⚠️ Historical incident (already fixed)
The project was originally delivered with **all files flat in the repo root and Windows backslashes in filenames** (e.g. a file literally named `src\app\page.tsx`, plus a few empty dirs like `src\app\admin\`). This was repaired by renaming all 81 entries into a proper nested tree and deleting the empty backslash dirs. If you receive this project as a zip from a Windows machine again, check for this before running anything.

---

## 5. Database Schema (Prisma + SQLite)

Datasource: `provider = "sqlite"`, `url = env("DATABASE_URL")` → `file:./dev.db`.
JSON-ish fields are stored as **TEXT containing JSON strings** (e.g. `Service.benefits`, `Program.features`, `ContentSection.items/images/extra`) — parse with `JSON.parse` in consumers.

### Models (18)

**Auth / admin**
- `AdminUser` — `email` unique, `passwordHash` (bcrypt), `role`: `SUPER_ADMIN | EDITOR | SUPPORT`, `active` flag.
- `AdminSession` — table exists (`sessionTokenHash`, `expiresAt`) but **is not used at runtime**; sessions are stateless JWT cookies instead.

**Catalog / CMS content**
- `Service` — `slug` unique, `title`, `eyebrow?`, `summary`, `description`, `heroImage?`, `status`: `ACTIVE | COMING_SOON | DRAFT`, `featured`, `sortOrder`, `benefits` (JSON text), `ctaText/ctaUrl?`. Relation: `programs[]`.
- `Program` — `slug` unique, optional `serviceId` (FK, `onDelete: SetNull`), `priceDisplay?`, `priceNote?`, `currency` (default USD), `image?`, `features` (JSON text), `availability`: `AVAILABLE | WAITLIST | COMING_SOON`, `active`, `sortOrder`, `ctaLabel` (default "Get Started"), `ctaDestination` (default `/assessment`).
- `ContentPage` — registry of editable pages: `pageKey` unique (`home`, `weight-loss`, `about`, `how-it-works`, `contact`), `title`, `slug`, `status`.
- `ContentSection` — the generic CMS section store; **unique on `[pageKey, sectionKey]`**. Fields: `sectionType`, `eyebrow?`, `title?`, `body?`, `images?` (JSON), `items?` (JSON), `ctaLabel?`, `ctaHref?`, `backgroundVariant` (default `default`), `visible`, `sortOrder`, `extra?` (JSON).
- `NavigationItem` — `label`, `href`, `location`: `HEADER | FOOTER`, `sortOrder`, `visible`, `external`.
- `Testimonial` — `name`, `roleOrLocation?`, `quote`, `image?`, `rating`, `serviceCategory?`, `consentVerified` (must be true to display), `status`: `PUBLISHED | DRAFT`, `showOnHome`, `showOnLanding`.
- `FAQ` — `pageKey` (default `all`; seeded values: `all`, `weight-loss`), `category?`, `question`, `answer`, `published`, `sortOrder`.
- `LegalPage` — `slug` unique (`privacy`, `terms`, `medical-disclaimer`), `title`, `body`, `published`.
- `VerifiedMetric` — `label`, `value`, `source?`, `approved`, `visible` (stats strip on landing pages).
- `MediaAsset` — `filename`, `url`, `alt?`, `mimeType`, `sizeBytes`. **URL registration only — no file upload/storage.**
- `SiteSetting` — simple `key` unique / `value` string KV store (site name, contact info, theme colors, CTA labels, promo banner, SEO keys, etc.).

**Lead / contact capture**
- `Lead` — `referenceCode` unique (format `SUZZ-YYYY-####`), optional `serviceId`, name/email/phone, `goalCategory`, `message?`, `preferredContact`, `source` (e.g. `assessment_multi_step`, `assessment`), `status`: `NEW | CONTACTED | FOLLOW_UP | QUALIFIED_FOR_CONTACT | CLOSED | SPAM`, `internalNotes`, `consentAcceptedAt`.
- `Appointment` — name/email/phone/`service?`, `preferredDate`, `preferredTime`, `status`: `REQUESTED | CONFIRMED | RESCHEDULE_REQUESTED | CANCELLED | COMPLETED`, `internalNotes`. **Admin-managed only; no public booking form exists and the seed creates none (table is empty).**
- `ContactMessage` — name/email/phone/subject/message, `status`: `UNREAD | READ | REPLIED | ARCHIVED`.

**Auditing**
- `AuditLog` — `adminUserId?`, `adminName?`, `entityType`, `entityId?`, `action`, `summary`. Written on login/logout, all CMS mutations, and lead CSV export.

---

## 6. Seed Data (`prisma/seed.ts`, 838 lines)

Run: `npm run seed` (package.json maps `prisma.seed` → `tsx prisma/seed.ts`).

**Default admin credentials (also pre-filled in the login form UI):**

| Role | Email | Password |
|---|---|---|
| SUPER_ADMIN | `admin@suzzmed.local` | `AdminPassword2026!` |
| EDITOR | `editor@suzzmed.local` | `EditorPassword2026!` |

(Overridable via `ADMIN_EMAIL` / `ADMIN_PASSWORD` env for the primary admin.)

**Seeded content:**

- **7 Services** (slugs): `weight-management`, `peptides-longevity`, `mens-wellness`, `womens-wellness`, `nutrition-lifestyle`, `hair-wellness`, `skincare-aesthetics`.
- **5 Programs**: `guided-glp1-program`, `metabolic-nutrition-coaching`, `mens-vitality-protocol`, `womens-longevity-balance`, `advanced-cellular-peptides`.
- **5 ContentPages**: home, weight-loss, about, how-it-works, contact.
- **9 homepage ContentSections** (pageKey `home`): `hero_dark`, `benefit_strip`, `weight_feature`, `womens_wellness`, `nutrition_feature`, `mens_wellness`, `peptides_longevity`, `modern_care`, `final_cta`.
- **8 FAQs** (pageKeys `all` and `weight-loss`), **4 testimonials** (consent verified), **header/footer navigation items**, **3 legal pages**, **15 site settings**, **3 verified metrics**, **2 sample leads**.

**Seeding caveats:** `upsert` is used for admins/services/programs/pages/sections/legal/settings/leads (idempotent), but FAQs, testimonials, nav items, and metrics use plain `create` → re-running seed duplicates them.

---

## 7. Routing Map

### Public pages (all under `src/app/`)

| Route | File | Renders | Data |
|---|---|---|---|
| `/` | `page.tsx` | Server (revalidate=0) | settings, services, home ContentSections, testimonials |
| `/weight-loss` | `weight-loss/page.tsx` | Server | settings, programs, testimonials (`showOnLanding`), FAQs (`weight-loss`), nav, verified metrics — **hard-coded section copy in JSX** |
| `/programs` | `programs/page.tsx` | Server | programs, services, settings |
| `/services/[slug]` | `services/[slug]/page.tsx` | Server, `notFound()` if missing; has `generateStaticParams` (but `revalidate = 0` so always dynamic) | service by slug + active programs |
| `/about`, `/how-it-works`, `/reviews`, `/faq`, `/contact` | respective folders | Server (`/contact` is a client form page) | settings/nav/FAQs/testimonials as needed |
| `/assessment` | `assessment/page.tsx` | **Client**, 6-step wizard (`useSearchParams` in Suspense) → `submitAssessmentInquiry` → redirects to `/assessment/success` with ref code |
| `/assessment/success` | `success/page.tsx` | Server | displays reference code |
| `/privacy`, `/terms`, `/medical-disclaimer` | each `page.tsx` | Server via `LegalPageLayout` (DB `LegalPage` body with static fallback) |
| `/robots.txt`, `/sitemap.xml` | `robots.ts`, `sitemap.ts` | Generated from `NEXT_PUBLIC_SITE_URL` + active service slugs; admin & API paths disallowed |

### Admin (route group `src/app/admin/(dashboard)/`)

- `/admin/login` — client login page (credentials pre-filled in the form defaults).
- `/admin` — dashboard with counts/stats.
- Guarded by `layout.tsx`: calls `getCurrentAdmin()`; **redirects to `/admin/login` if no valid session**. Renders `AdminSidebar` + content.

Sidebar sections (from `AdminSidebar.tsx`):

1. **Operations:** Dashboard `/admin`, Leads & Inquiries `/admin/leads`, Appointments `/admin/appointments`, Contact Messages `/admin/messages`
2. **Content:** Homepage Editor `/admin/homepage`, Weight Loss Page `/admin/landing-page`, Services `/admin/services`, Programs & Pricing `/admin/programs`, Patient Reviews `/admin/testimonials`, FAQs `/admin/faqs`, Media Library `/admin/media`, Navigation `/admin/navigation`
3. **System:** SEO & Meta `/admin/seo`, Legal Pages `/admin/legal`, Site Settings `/admin/settings`, Admin Staff `/admin/users` (role `SUPER_ADMIN` only), Audit Logs `/admin/audit`

### API routes

- `GET /api/admin/leads/export` — CSV export of all leads; requires admin session (401 otherwise); sanitizes CSV formula injection (`=`, `+`, `-`, `@` prefixed values are escaped); writes an AuditLog entry.

---

## 8. Rendering / Caching Strategy

- **Every page sets `export const revalidate = 0`** → fully dynamic rendering; every request hits the database so CMS edits appear immediately (`revalidatePath()` calls in actions are belt-and-suspenders).
- **Implication for deployment:** a request-per-page DB workload; fine for a VPS/container, but every serverless invocation opens SQLite.
- No `generateMetadata()` anywhere — **see §13 known gaps (SEO admin fields are not wired to `<head>`)**.

---

## 9. Data Access Layer (`src/lib/data.ts`)

All functions are async, Prisma-backed, and **never throw** — they `console.error` and return empty structures so the site still renders if the DB fails:

| Function | Returns |
|---|---|
| `getSiteSettings()` | `Record<key, value>` |
| `getNavigation(location)` | HEADER/FOOTER items, visible, ordered |
| `getContentSections(pageKey)` | `{ list, map }` keyed by `sectionKey` |
| `getServices(onlyActive)` | services incl. active programs |
| `getServiceBySlug(slug)` | one service + programs (or null) |
| `getPrograms(featuredOnly)` | active programs incl. service |
| `getFAQs(pageKey?)` | published FAQs (`all` + pageKey) |
| `getTestimonials(placement)` | published + `consentVerified` (home/landing/all flags) |
| `getLegalPage(slug)` | published legal page |
| `getVerifiedMetrics()` | approved + visible metrics |

`src/lib/db.ts` exports the standard global-singleton `PrismaClient` (logs warn+error in dev, error only in prod).

`src/lib/utils.ts`: `cn()` (clsx+tailwind-merge), `formatCurrency()`, `formatDate()`, `generateRefCode(prefix)` → `PREFIX-YYYY-####`.

---

## 10. Server Actions (`src/actions/`)

All are `"use server"` modules.

### `auth.ts`
- `loginAdmin(formData)` — bcrypt compare → signs 7-day JWT → sets httpOnly cookie `suzzmed_admin_session` → AuditLog `LOGIN`. Returns `{ success, error? }`.
- `logoutAdmin()` — AuditLog `LOGOUT`, clears cookie, `redirect("/admin/login")`.

### `assessment.ts`
- `submitAssessmentInquiry(data)` — Zod-validated (area, goal, contact pref, name, email, consent must be true). Derives a service match by slugified area or title-contains. Creates a `Lead` with `referenceCode = SUZZ-YYYY-####`, `source` default `assessment_wizard`, `status NEW`, consent timestamp. Returns `{ success, referenceCode, leadId }`.

### `contact.ts`
- `submitContactMessage(formData)` — Zod schema (name/email/subject/message ≥5 chars, consent checkbox required) → creates `ContactMessage` (`UNREAD`).

### `cms.ts` (admin CRUD)
Guard: internal `ensureAdmin()` (calls `getCurrentAdmin()`, throws `"Unauthorized. Please log in."` if missing) — applied to every mutation. Every mutation writes an `AuditLog` row and calls `revalidatePath(...)` for affected routes.

Exported functions: `updateContentSection`, `saveService`, `deleteService`, `saveProgram`, `deleteProgram`, `updateLead` (status/notes), `saveTestimonial`, `deleteTestimonial`, `saveFAQ`, `deleteFAQ`, `saveSettings` (**upserts every form field name as a SiteSetting key — no whitelist**), `saveLegalPage`.

Some admin pages additionally use **inline `"use server"` form handlers** directly in the page file (e.g. Media registration, Admin user creation, appointment status updates) — pattern: server component page + `form action={async (formData) => { ... prisma ...; revalidatePath(...) }}`.

---

## 11. Authentication & Session Model

- **Mechanism:** stateless JWT (HS256, secret `SESSION_SECRET` with a hard-coded fallback string in `src/lib/auth.ts` — set the env var in production), 7-day expiry.
- **Cookie:** `suzzmed_admin_session`, `httpOnly`, `sameSite: lax`, `secure` in production, `path: /`.
- **Verification:** `getCurrentAdmin()` verifies the JWT **and re-checks the DB** that the user still exists and `active === true` (so disabling an admin revokes access on next request).
- **Route protection:** server-side in the `(dashboard)` layout (redirect). The CSV API route checks independently.
- **Roles:** `SUPER_ADMIN`, `EDITOR`, `SUPPORT` (string field; UI-level enforcement only — e.g. "Admin Staff" nav item is `role: "SUPER_ADMIN"`; **no per-route role checks server-side** beyond login).
- **Password hashing:** bcrypt cost 10.
- **Weaknesses to know about (do not "fix" silently without product sign-off):** login page pre-fills default credentials in the browser; JWT secret has an insecure fallback; no rate limiting/CSRF beyond SameSite; `saveSettings` allows arbitrary keys.

---

## 12. Component Inventory

### `src/components/home/` (homepage redesign — see IMPLEMENTATION-NOTES.md)
`HomeHeader` (client; mobile drawer nav, promo banner, CTA), `HomeHero` (client; Unsplash imagery, service cards), `TrustMarquee` (client; scrolling trust strip), `FeatureSection` (alternating image/copy feature blocks), `CareCoaching`, `TestimonialMosaic`, `GuaranteeStrip`, `HomeFooter`, `Reveal` (client; IntersectionObserver scroll-reveal wrapper used across homepage).

### `src/components/marketing/` (used by inner pages)
`Header` (client; takes `navItems` prop, defaults built-in; sticky; CTA from settings), `Footer`, `HeroDark` (uses `next/image`), `SplitFeature`, `BenefitStrip`, `ModernCare`, `FinalCTA`, `ProgramCard`, `GoalSelector` (client), `WeightSlider` (client; interactive BMI/weight slider), `TestimonialsCarousel` (client), `FaqAccordion` (client), `LegalPageLayout` (DB body + fallback), `ProgramCard`, `Footer`.

### `src/components/admin/`
`AdminSidebar` (client; grouped nav, logout via `logoutAdmin`, role-gated item).

**Client components (`"use client"`):** admin login, assessment, contact, AdminSidebar, HomeHeader, Reveal, FaqAccordion, GoalSelector, marketing Header, TestimonialsCarousel, WeightSlider. Everything else is server-rendered.

**Nav/settings flow:** server pages fetch `getNavigation()` / `getSiteSettings()` and pass them as props into `Header`/`HomeHeader`/`Footer` (components have built-in defaults if props are omitted).

---

## 13. Design System

Defined in `tailwind.config.ts` + `src/app/globals.css`.

- **Fonts (self-hosted `@font-face`, files in `public/fonts/`):**
  - Body/Display: **Red Hat Text** (400/500/600/700) → `font-sans` / `font-display`
  - Eyebrow/labels: **Onest** (500/600) → `font-eyebrow`
  - (`src/app/fonts/Geist*.woff` are create-next-app leftovers — not referenced anywhere.)
- **Palette (brand):** `medvi.dark #104D38`, `medvi.forest #175840`, `medvi.sage #779B7C`, `medvi.soft #E9F1E8`, `medvi.cream #F8F9F6`, `medvi.text #242824`, `medvi.muted #6F7770`, plus neutrals `ink/muted/forest/sage/accent/cream` and accents (gold/blue/blush/sand).
- **CSS variables** in `globals.css` mirror these (`--forest`, `--sage`, `--accent`, `--hero-accent`, …).
- **Utilities:** custom `borderRadius` 2xl–5xl, `maxWidth` medvi 1280 / content 1120 / feature 1060 / copy 600, `screens.xs = 480px`.
- **Animations:** keyframes `hero-marquee`, `hero-marquee-reverse`, `slow-spin`; `.reveal*` scroll-reveal classes driven by the `Reveal` client component.
- **Page chrome:** root `body` → `bg-[#F8F9F6] text-[#242824]`.

---

## 14. SEO & Metadata

- **Root metadata is hard-coded** in `src/app/layout.tsx` (title "Suzzmed Healthcare | Care Designed Around You", description, keywords). No page-level `generateMetadata()` exists.
- `robots.ts` disallows `/admin/` and `/api/`; `sitemap.ts` lists static routes + active service slugs; both use `NEXT_PUBLIC_SITE_URL`.
- **Gap:** the admin "SEO & Meta" page writes `seo_default_title` / `seo_meta_desc` SiteSettings, but **nothing reads them into the HTML head**. Wire them via `generateMetadata()` in `layout.tsx` if needed.

---

## 15. User Data Flows

1. **Assessment wizard** (`/assessment`, 6 steps: area → goal → contact preference → personal details → review → submit): client state → `submitAssessmentInquiry` → `Lead` row → redirect `/assessment/success?ref=SUZZ-YYYY-####`. Admin manages leads at `/admin/leads` (status pipeline, notes, CSV export).
2. **Contact form** (`/contact`): → `ContactMessage` (`UNREAD`) → admin `/admin/messages`.
3. **Appointments:** model + admin UI exist, but **no public booking form and no seeded rows** — currently dormant.
4. **No email is ever sent** — no SMTP/Resend/etc. anywhere. "Status: REPLIED" is just a label.

---

## 16. Admin CMS Details (what each screen edits)

| Screen | Writes to | Mechanism |
|---|---|---|
| Homepage Editor | `ContentSection` where `pageKey=home` | `updateContentSection` (title/eyebrow/body/CTA/visibility per `sectionKey`) |
| Weight Loss Page | `ContentSection` where `pageKey=weight-loss` | same action — **but the public `/weight-loss` page does not read these sections** (it uses hard-coded JSX + settings/programs/FAQ/testimonials/metrics). Verify before relying on this editor. |
| Services / Programs | `Service`, `Program` | `saveService`/`saveProgram` (+ deletes); JSON arrays for benefits/features parsed from form text |
| Reviews / FAQs | `Testimonial`, `FAQ` | save/delete actions |
| Media | `MediaAsset` | inline server action — registers a URL (no upload; `sizeBytes` hard-coded 250000) |
| Navigation | `NavigationItem` | inline CRUD |
| SEO / Settings | `SiteSetting` | `saveSettings` — upserts **every form key** |
| Legal | `LegalPage` | `saveLegalPage` (upsert by slug) |
| Users | `AdminUser` | inline create (bcrypt hash), toggle active/role |
| Leads / Messages / Appointments | `Lead`, `ContactMessage`, `Appointment` | status/notes updates (`updateLead` or inline) |
| Dashboard / Audit | read-only aggregates / `AuditLog` list | — |

---

## 17. Known Gaps, Quirks & Landmines

1. **SQLite persistence on deploy:** `prisma/dev.db` is a local file. Serverless platforms (Vercel/Netlify) will lose data / can't write. For recommendations see §18.
2. **SEO admin fields unused** by the actual `<head>` (§14).
3. **Landing-page editor appears disconnected** from the public `/weight-loss` page (§16).
4. **`Appointment` table is dormant** (no public form, no seed data).
5. **Seed is only partially idempotent** (create vs upsert — §6).
6. **`AdminSession` model unused** (JWT-only auth).
7. **No email sending, no file uploads, no tests, no CI.**
8. **`saveSettings` has no key whitelist** — any posted key becomes a setting.
9. **JWT secret fallback** hard-coded in `src/lib/auth.ts`; login page pre-fills credentials.
10. **Build ignores ESLint** (`ignoreDuringBuilds: true`); run `npm run lint` manually.
11. **Disk space:** the dev machine's disk filled up during `npm install` once; npm cache was cleared (`~/.npm/_cacache`). If installs fail with `ENOSPC`, check `df -h` first.
12. **Backslash-filename archive issue** (§4) — verify tree structure if re-importing files from Windows.
13. **Unsplash hotlinks:** homepage imagery loads from `images.unsplash.com` (allowed in `next.config.mjs`); no offline fallback.
14. **Duplicate component:** `ProgramCard` exists in marketing components and is referenced broadly; `Footer`/`Header` naming collides conceptually with `HomeFooter`/`HomeHeader` — use the right pair per page (homepage uses home/*, inner pages use marketing/*).

---

## 18. Deployment Guidance (free tier, Nov 2026 facts)

Because of the **SQLite file**, options ranked:

1. **Oracle Cloud Always Free VPS (recommended for real use):** 2 OCPU / 12GB ARM VM, forever free (card for verification only). Run the app with PM2 or Docker; persist `prisma/dev.db` on the block volume; point a domain via Caddy/Nginx. Build: `npx prisma generate && npm run build`; start: `npm start`.
2. **Render Free web service (easiest):** connect repo → build `npm run build` → start `npm start`. Caveats: 750 instance-hours/month, spins down after 15 min idle (~1 min cold start), and **any file change (SQLite) is wiped on every redeploy/restart — no persistent disks on free tier**. Seed on boot if acceptable (`npm run seed && npm start` pattern or a release command).
3. **Vercel/Netlify:** not suitable *as-is* (stateless FS). Only viable after migrating Prisma from `sqlite` → `postgresql` (e.g. Supabase/Neon free) and running `prisma db push` against it. `revalidate = 0` pages would then hit Postgres on every request — acceptable, but watch function limits.
4. **Fly.io / Railway / Koyeb:** no free tier anymore (short trials only) as of late 2026.

Env vars to set in production: all of §3, especially a strong `SESSION_SECRET` and a real `NEXT_PUBLIC_SITE_URL`.

---

## 19. Conventions for Future Contributors / AI Agents

- **Language:** English UI copy; keep the Suzzmed brand tokens (colors/fonts in §13) — do not introduce a second design system.
- **Path alias:** always `@/lib/...`, `@/components/...`, `@/actions/...`.
- **Server-first:** prefer server components; add `"use client"` only for interactivity (existing client list in §12 is a good guide).
- **DB access:** reads go through `src/lib/data.ts`; mutations go through server actions with `ensureAdmin()` + AuditLog + `revalidatePath()`.
- **Rendering:** pages must keep `export const revalidate = 0` so CMS edits are live.
- **Validation:** zod schemas at the action boundary (pattern in `contact.ts` / `assessment.ts`).
- **Forms:** server actions receive `FormData`; return `{ success, error }` objects; client pages show errors inline.
- **No new dependencies without checking `package.json` first** (Tailwind 3, Next 14, React 18 — do not assume libraries exist).
- **Verify before changing:** the homepage (`src/app/page.tsx`) was a pixel-cloned design — prefer minimal, targeted edits.
- **Check commands:** `npm run lint` after edits; `npm run build` before declaring done (build ignores lint, so both matter).

---

## 20. Quick Reference Card

```text
URLs            http://localhost:3000 (public)  ·  /admin (CMS)  ·  /admin/login
Admin login     admin@suzzmed.local / AdminPassword2026!
Editor login    editor@suzzmed.local / EditorPassword2026!
DB              prisma/dev.db (SQLite) — schema prisma/schema.prisma — seed prisma/seed.ts
Commands        npm install · npm run dev · npm run build · npm run lint · npm run seed
Key dirs        src/app (routes) · src/actions (mutations) · src/lib (db/auth/data) · src/components
Gotchas         SQLite persistence · SEO fields unwired · landing editor unused · no email/tests/CI
```
