# Verification — 6 November 2026

## Verified
- `npm run build`: renderer, source checks, production build and production checks pass.
- Node syntax checks pass for app, renderer, build/check tools and server.
- Hallmark audit: zero failures and zero unresolved warnings. Pure-white palette explicitly waived to match the client brief; short editorial measures, assistive link text and collapsed content documented. Puppeteer render tier unavailable; built-in browser checks used instead.
- Read-only HTTP smoke: main pages, robots, sitemap and web manifest return 200; missing pages and private tooling/source paths return custom 404; video byte range returns 206 and expected 1,024 bytes; manifest icon returns 200.
- Built-in browser: About layout checked at widths 320, 390, 768 and 1280 with no detected horizontal overflow. Home checked at 390 and 1280, with theme controls and Amazon CTA visible.
- Automatic local-time theme initialised; manual opposite-mode toggles and Auto reset verified. Session preference survives navigation.
- Recognition image viewer opens, advances and closes using Escape; focus returns to the original evidence link.
- Expandable gallery works; rendered images tested had no loading errors. A launch video reached readyState 4 and played, then paused.
- Campaign section hidden as requested; hidden campaign assets excluded from lightbox traversal.
- Two-page metadata includes canonical URLs, unique titles/descriptions, Open Graph/Twitter, Person/Organization/WebSite JSON-LD, alt text, favicon and web manifest.
- Source manifest accounts for all 15 client images and four videos. The duplicate office photograph reuses its derivative; the temporarily hidden campaign is retained.

## Remaining external steps
- No public deployment was performed. The ready-to-deploy artifact is `dist/`.
- Search Console verification/submission requires the deployed canonical domain and owner access. Not submitted.
- The user-supplied Amazon Singapore books link is present exactly as supplied. Amazon blocked automated web retrieval, so external reachability could not be confirmed. Clock Amazon and YouTube destinations were checked during source research.
- Video caption files were not supplied; videos retain original audio and provide descriptive labels/posters and manual playback.

## Preview
Production build served locally at http://127.0.0.1:4174/ during review.
