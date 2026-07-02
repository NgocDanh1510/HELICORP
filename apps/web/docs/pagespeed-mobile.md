# PageSpeed Mobile Notes

Date: 2026-07-02

## Status

Google PageSpeed Insights needs public URLs to measure real mobile performance. The current web URL is configured as `http://localhost:3000`, so final PageSpeed validation should be run after deploying the Next.js app.

An API check against PageSpeed Insights was attempted during implementation, but the service returned `429 Too Many Requests`. Local production build validation passed.

## Local Build Snapshot

Command:

```bash
npm run build:web
```

Relevant route output after optimization:

```text
/                         2.25 kB    First Load JS 127 kB
/san-pham                 172 B      First Load JS 111 kB
/san-pham/[slug]          3.83 kB    First Load JS 112 kB
```

## Fixes Applied

- Converted product, hero, cart, checkout and order-summary images to `next/image`.
- Enabled Next image optimizer formats `AVIF` and `WebP`.
- Added fixed image dimensions and `sizes` attributes to reduce layout shift.
- Marked the hero product image as `priority`.
- Dynamically imported below-the-fold homepage sections.
- Moved the cart drawer behind a client-only dynamic mount.
- Added preconnect and DNS prefetch for the remote placeholder image host.
- Added homepage metadata, Open Graph, Twitter card, favicon and light/dark theme colors.

## Run After Deploy

Replace the URLs with the deployed Vercel domain:

```bash
https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https%3A%2F%2Fyour-domain.com&strategy=mobile&category=performance
https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https%3A%2F%2Fyour-domain.com%2Fsan-pham%2Fheliphone-aurora.html&strategy=mobile&category=performance
```
