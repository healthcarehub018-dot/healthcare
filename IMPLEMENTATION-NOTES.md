# Suzzmed Homepage Clone — Implementation Files

This archive contains the files used to rebuild the reference homepage design inside the existing Next.js project.

## Included files

- `src/app/page.tsx` — homepage composition
- `src/app/globals.css` — fonts, design tokens, motion, reveal utilities
- `tailwind.config.ts` — colors, font families, container widths
- `src/components/home/` — all homepage-specific components:
  - `HomeHeader.tsx`
  - `HomeHero.tsx`
  - `TrustMarquee.tsx`
  - `FeatureSection.tsx`
  - `CareCoaching.tsx`
  - `TestimonialMosaic.tsx`
  - `GuaranteeStrip.tsx`
  - `HomeFooter.tsx`
  - `Reveal.tsx`
- `public/fonts/` — self-hosted open-source fonts (Red Hat Text, Onest)

## Run

```bash
npm install
npm run dev
```

## Verification performed

- `npm run lint` — passed with no warnings or errors
- `npm run build` — passed
- Local Puppeteer screenshots at 1440, 1234, 768, 390, and 375 widths
- No horizontal overflow
- No broken images after eager-load verification
- No console or page errors

## Runtime note

The official `clone-website` skill benchmark requires `ego-browser`, which is not available on this Windows environment. Verification was performed with local Chromium/Puppeteer instead and is not presented as the official skill benchmark.

## Data / CMS

The page still reads existing content from `src/lib/data.ts`:
- site settings
- services
- homepage content sections
- testimonials

Suzzmed branding and existing routes are preserved. Reference-only MEDVi assets, logos, testimonials, phone numbers, and pharmacy details were not copied.
