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

## Mobile and credibility revision — 7 November 2026
- Mobile hero order changed to headline, full clock, explanation and purchase action. The clock is no longer below the entire copy block.
- Product, gallery, ranking and recognition previews use intrinsic image ratios; artificial fixed-height letterboxing removed. Recognition View labels sit below images.
- Browser measured book screenshot ratio 0.8 in both preview and modal; physical-clock screenshot ratio 1.0 in preview. At 320px the hero purchase actions end at 687px and the clock at 522px. No horizontal overflow detected at 320, 390, 768 and 1280px checks.
- Credibility is supported by visible creator identity, direct contact, transparent Amazon purchase details and earlier historical evidence. No new testimonial, rating, guarantee or efficacy claim was invented.
- Added two requested external article links in the Home journal section. Web and Firecrawl requests failed to resolve blog.dhisclock.com (DNS failure); links preserve user-provided destinations, but that subdomain must be connected before publishing.
- Source and dist build checks pass. Hallmark checks report no unresolved failures/warnings under the existing documented palette/layout decisions.

## Mobile polish and single-button theme — 7 November 2026
- Removed the separate Auto reset control. One moon/sun button labels its action as Dark mode or Light mode. Initial appearance still follows local time until manually changed; session choice persists between pages.
- Browser verified both toggle directions and actual body background changes, exactly one theme control, and no horizontal overflow on 320px/390px mobile layouts.
- Mobile header Amazon link is a filled, high-contrast button with an outward arrow and a 44px minimum touch target.
- About mobile heading reduced, Known as Dhi separated, portrait moved before descriptive text. Desktop retains a two-column composition.
- Journal cards use thumbnail + title, then full-width body and read action. Corrected journal image width/height attributes to their actual square proportions.
- Fresh source and dist checks pass. Blog subdomain DNS remains an external launch dependency.
