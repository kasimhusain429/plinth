# Plinth — immersive rental agency website

A premium, scroll-driven rental agency website built with **Next.js 15 (App Router) + React 19**.
Inspired by the visual quality and pacing of [belgradearbor.rs](https://belgradearbor.rs/en), but with
its own identity: warm ink, bone and terracotta, a golden-hour arch window that opens to full bleed,
and generative room illustrations instead of stock photography.

> All brand details, listings, prices, fees and contact information are **sample content**.
> Replace them with the agency's real data (see “Making it yours”).

## Quick start

Requirements: **Node.js 18.18 or newer** and an internet connection (for `npm install`, and because
`next/font` downloads Fraunces and Instrument Sans from Google Fonts the first time it runs).

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

Optional: copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to your real domain
(used for canonical URLs, the sitemap and Open Graph).

## What's inside

| Route | What it does |
| --- | --- |
| `/` | Arch-window hero with live search, marquee, scroll-revealed statement, pinned horizontal rail of featured homes, “ways to rent”, interactive neighborhood map, move-in cost calculator, process timeline, FAQ and an inquiry form |
| `/listings` | Rental discovery: filter by neighborhood, bedrooms, type, max rent, furnished / pets / parking; sort; shareable URLs (`?area=dorcol&beds=2`) |
| `/listings/[slug]` | Gallery, facts, features, full move-in cost table, **book-a-viewing** form (day, time of day, in person or video), similar homes, structured data |
| `/contact` | General inquiry form (`?topic=landlord` pre-selects “list my property”) |
| `/api/inquiry` | Validates inquiries (shared rules with the browser form), honeypot + simple rate limit |
| `/sitemap.xml`, `/robots.txt` | Generated from the listings data |

### Motion & performance

* Hero, statement, rail and process timeline are driven by **scroll progress** (framer-motion), not timers.
  The hero opens through a single CSS variable (`--p`), so there are no React re-renders while scrolling.
* **Lenis** smooth scrolling for mouse / trackpad only. It is skipped on touch devices and when the
  visitor prefers reduced motion.
* The pinned horizontal rail only exists on desktop; mobile gets a native swipeable, snap-scrolling row.
* No raster photography: all imagery is lightweight SVG with transform / opacity animation only.
* `prefers-reduced-motion` disables the preloader, marquee, ambient animation and smooth scrolling.
* The preloader plays once per browser session, never blocks the HTML underneath, and has a failsafe.

### Accessibility & SEO

Skip link, landmarks, visible focus states, labelled form fields with inline errors, `aria-live`
result counts, a focus-trapped menu dialog, keyboard-operable accordions / map pins, per-page
metadata, canonical URLs, Open Graph image, JSON-LD (agency + each listing), sitemap and robots.

## Project structure

```
src/
  app/                 routes, layout, global CSS (globals.css, sections.css), API route
  components/          UI sections (Hero, FeaturedRail, Ways, Neighborhoods, Pricing, …)
  data/                site.js (brand + fees), listings.js, areas.js, palettes.js
  lib/                 filters.js, costs.js, format.js, validate.js
public/                og.png, grain.png
```

## Making it yours

* **Brand, contact details, fees** → `src/data/site.js` (also set `showDemoNotice: false` when done).
* **Listings** → `src/data/listings.js`. Every component reads this shape, so you can swap the array for
  a CMS / database call without touching the UI.
* **Real photography** → add `photos: ["/photos/home-1.jpg"]` to a listing, put the files in
  `public/photos/`, and render them with `next/image` in `ListingCard.jsx` and `ListingGallery.jsx`
  instead of `<RoomScene>`.
* **Neighborhoods** → `src/data/areas.js` (the `x` / `y` values position pins on the stylised map).
* **Colors & type** → CSS variables at the top of `src/app/globals.css`; fonts in `src/app/layout.jsx`.

### Forms

`/api/inquiry` currently validates, rate-limits and **logs** each inquiry to the server console, then
returns a reference number. To actually receive them, add your delivery step where the `TODO` is in
`src/app/api/inquiry/route.js` (Resend, Postmark, SendGrid, a CRM webhook, a database…). The in-memory
rate limiter is per server instance; use a shared store (e.g. Redis) when you deploy to serverless.

## Deploying

Any Next.js host works (Vercel, Netlify, a Node server). Set `NEXT_PUBLIC_SITE_URL` in the host's
environment settings.

## Notes on how this was verified

This project was written in a sandbox with **no network access**, so `npm install` and `next build`
could not be run there. Instead, every source file was syntax-checked with esbuild, and all routes
(home, listings with and without filters, listing detail, contact, 404, layout, metadata, sitemap,
robots) and the inquiry API were server-rendered / executed against lightweight stand-ins for Next and
framer-motion, then screenshotted in headless Chromium at desktop and mobile widths. Scroll-driven
animation, Lenis and real font loading were not exercised. Please run `npm install && npm run dev`
and `npm run build` once on your machine; if anything surfaces, it will be a small, local fix.
