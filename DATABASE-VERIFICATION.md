# Database Verification Report — SQLite vs Supabase PostgreSQL

**Date:** 2026-11-08
**Source:** `prisma/dev.db` (SQLite) — backup `prisma/backups/dev.db.20261107.f37029b2….bak`
**Target:** Supabase `nhcdsajqsslgaxnufzpc` (PostgreSQL 17.11)
**Result: ALL CHECKS PASS — 17/17 tables, 34/34 fingerprints, 0 FK orphans.**

---

## 1. Verification method

Both databases were queried independently (SQLite via Python `sqlite3`, PostgreSQL via Supabase MCP `execute_sql`) and compared using a canonical line format:

1. Each row → one line: `field1|field2|…` (fields in fixed order, starting with `id`)
2. Escaping applied identically on both sides: `\` → `\\`, newline → `\n`, `|` → `\|`
3. `NULL` → `\N`; booleans → `true`/`false`; integers → decimal text
4. Timestamps → `YYYY-MM-DD HH:MM:SS.mmm` (SQLite epoch-ms → formatted; PG `to_char(..., 'YYYY-MM-DD HH24:MI:SS.MS')`)
5. Lines joined with `\n`, ordered by `id` (`SQLite BINARY` ≡ `PG COLLATE "C"` — cuid keys are `[a-z0-9]`, order identical)
6. `md5()` of the joined string compared per table, per field-group

Field groups per table:
- **crit** — all critical business fields (text/bool/int): e.g. `Service.slug|title|status|featured|sortOrder|benefits`
- **ts** — all timestamp fields: e.g. `Service.createdAt|updatedAt`

> Two bugs were found and fixed in the verification harness itself (not in the data): an early PG query omitted the `id` column from the line format, and the expected-hash file uses keys `crit_md5`/`ts_md5`. After correction, all hashes matched on first re-run — indicating data was correct throughout.

---

## 2. Tier 1 — Row counts & id sets ✅ PASS

Per table: `COUNT(*)` and `md5(string_agg(id, ',' ORDER BY id))` compared. All 17 tables match.

| Table | Rows | id-set MD5 (both sides) | Result |
|---|---:|---|---|
| AdminUser | 2 | (match) | ✅ |
| AdminSession | 0 | `d41d8cd98f00b204e9800998ecf8427e` (empty) | ✅ |
| Appointment | 0 | `d41d8cd98f00b204e9800998ecf8427e` (empty) | ✅ |
| AuditLog | 1 | (match) | ✅ |
| ContactMessage | 0 | `d41d8cd98f00b204e9800998ecf8427e` (empty) | ✅ |
| ContentPage | 5 | (match) | ✅ |
| ContentSection | 9 | (match) | ✅ |
| FAQ | 8 | (match) | ✅ |
| Lead | 2 | (match) | ✅ |
| LegalPage | 3 | (match) | ✅ |
| MediaAsset | 0 | `d41d8cd98f00b204e9800998ecf8427e` (empty) | ✅ |
| NavigationItem | 17 | (match) | ✅ |
| Program | 5 | (match) | ✅ |
| Service | 7 | (match) | ✅ |
| SiteSetting | 15 | (match) | ✅ |
| Testimonial | 4 | (match) | ✅ |
| VerifiedMetric | 4 | (match) | ✅ |
| **Total** | **82** | | **17/17 PASS** |

---

## 3. Tier 1b — Foreign-key orphan checks ✅ PASS

Every FK relationship checked for rows referencing missing parents — **0 orphans on both sides**:

| FK | Parent |
|---|---|
| `AdminSession.userId` | `AdminUser.id` |
| `Program.serviceId` | `Service.id` |
| `AuditLog.adminUserId` | `AdminUser.id` (nullable) |
| `Lead.serviceId` | `Service.id` (nullable) |

---

## 4. Tier 2 — Critical-field & timestamp fingerprints ✅ 34/34 MATCH

Each cell: `SQLite MD5` == `PostgreSQL MD5`.

| Table | Group | MD5 (identical on both) | Result |
|---|---|---|---|
| AdminUser | crit | `863a37d479331eec7df1e5a170c5d086` | ✅ |
| AdminUser | ts | `27bf44e7e2597ce30ee09752871fce7f` | ✅ |
| AdminSession | crit | `d41d8cd98f00b204e9800998ecf8427e` (empty) | ✅ |
| AdminSession | ts | `d41d8cd98f00b204e9800998ecf8427e` (empty) | ✅ |
| Appointment | crit | `d41d8cd98f00b204e9800998ecf8427e` (empty) | ✅ |
| Appointment | ts | `d41d8cd98f00b204e9800998ecf8427e` (empty) | ✅ |
| AuditLog | crit | `fb77d8ee49956af5a0e997b9779d1367` | ✅ |
| AuditLog | ts | `8d15a193d8b0de5525ba9603e1aa6cc6` | ✅ |
| ContactMessage | crit | `d41d8cd98f00b204e9800998ecf8427e` (empty) | ✅ |
| ContactMessage | ts | `d41d8cd98f00b204e9800998ecf8427e` (empty) | ✅ |
| ContentPage | crit | `5390b1fa9ec6e02597da2822293e8bd8` | ✅ |
| ContentPage | ts | `e0895375bff0cf1f1118bf2ae4071b18` | ✅ |
| ContentSection | crit | `903ae427af0d377c07b70f17584a72da` | ✅ |
| ContentSection | ts | `8a2fa922ffac5a5f14a8aec743f3a197` | ✅ |
| FAQ | crit | `05fce1270b988da234be688adf8f420b` | ✅ |
| FAQ | ts | `0d649e406054271899b8e0af7642ff74` | ✅ |
| Lead | crit | `bdced930eae1e21530847d95f57d1816` | ✅ |
| Lead | ts | `3a59e2a9e95c4707c8e33d6359cff792` | ✅ |
| LegalPage | crit | `b80df2b5053fe59131c4ad52f9090bdf` | ✅ |
| LegalPage | ts | `7d11c57435714f4c54f94cea31f0686a` | ✅ |
| MediaAsset | crit | `d41d8cd98f00b204e9800998ecf8427e` (empty) | ✅ |
| MediaAsset | ts | `d41d8cd98f00b204e9800998ecf8427e` (empty) | ✅ |
| NavigationItem | crit | `27455c24daeac00fe47dda595ae1b7eb` | ✅ |
| NavigationItem | ts | `7b9786ca130af9eaf528bce83fa72bca` | ✅ |
| Program | crit | `96f5c644b85fe84404c27e67082cd3cc` | ✅ |
| Program | ts | `3d403df26c5876cfe5040dfca21aa7b6` | ✅ |
| Service | crit | `78e3253ae70067f31084ebfbda0e3a7b` | ✅ |
| Service | ts | `0e124995a63c43400163ee9269718cce` | ✅ |
| SiteSetting | crit | `20bb25006ae5e9dfc039864589650b4a` | ✅ |
| SiteSetting | ts | `c08eb18b84a9cbec817e4ac420f16e77` | ✅ |
| Testimonial | crit | `3db8d7c17f792653320adfee4faccfae` | ✅ |
| Testimonial | ts | `e9cdd4a3527574bc6ca76cc2ce73e273` | ✅ |
| VerifiedMetric | crit | `78a4da34cb03c9d8fa6f590fa83f9f7a` | ✅ |
| VerifiedMetric | ts | `b3912bc51aac9ce9ee6207cf3928644a` | ✅ |

**Total: 34 checks, 34 matches, 0 failures.**

### What this proves

- Every critical business value (slugs, titles, statuses, booleans, sort orders, JSON-as-text blobs, benefits/features arrays, site settings incl. `|`-containing values) is byte-identical after canonicalization.
- Every timestamp survived the SQLite epoch-ms → PostgreSQL `TIMESTAMP(3)` conversion exactly (millisecond precision preserved).
- Row identity/ordering is identical (id-set MD5 + ordered fingerprints).

---

## 5. Unique constraints

All 17 tables were created with their unique indexes **before** data load; all 82 INSERTs succeeded with zero violations — confirming no duplicate values exist on any unique column (`AdminUser.email`, `Service.slug`, `ContentPage.slug`, `SiteSetting.key`, `Lead.referenceCode`, etc.) on either side.

---

## 6. Application-level checks (Phase 10 pre-checks)

| Check | Result |
|---|---|
| `npx prisma validate` | ✅ valid |
| `npx prisma generate` (postgresql client) | ✅ generated |
| `npx tsc --noEmit` | ✅ 0 errors |
| `npm run lint` | ✅ 0 warnings/errors |
| `npm run build` | ✅ success — DB routes dynamic (`ƒ`), `/sitemap.xml` dynamic after `force-dynamic` fix |

**Phase 10 runtime checks (2026-11-08) — all PASS:**

| Check | Result |
|---|---|
| `prisma migrate status` | ✅ "Database schema is up to date!" (baseline checksum verified) |
| Live Prisma counts vs expected, 17 tables | ✅ 17/17 PASS |
| `GET /` from live PG | ✅ 200, full content (231 KB) |
| `/sitemap.xml` | ✅ 19 URLs (12 static + 7 services) |
| `/faq`, `/privacy`, `/services/weight-management`, `/admin/login` | ✅ 200 |
| Admin login page has no credential prefill/display | ✅ 0 occurrences |
| bcrypt verify of stored hash | ✅ PASS |
| JWT sign/verify with live `SESSION_SECRET` | ✅ PASS |
| Prisma write path (INSERT/SELECT/DELETE test row) | ✅ PASS, cleaned up |
