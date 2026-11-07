# Amazon-focused two-page redesign implementation plan
> For agentic workers: use executing-plans or subagent-driven-development as appropriate. User explicitly requested lower-cost agents and implementation; proceed without another approval round.
Goal: a fast, credible two-page journey to buy the personalised clock on Amazon.
Architecture: static HTML with shared CSS/progressive JS; build-time media renderer; no client framework.
Tech stack: HTML, CSS, JavaScript, Node, ffmpeg.
Spec: DESIGN.md, PRODUCT.md, docs/website-copy.md and latest user instructions.

## Constraints
Two pages index.html/about.html. Full colour media. Preserve client source files and account for all 19 assets. Local-hour automatic theme with manual override. No invented book URL or bestseller claims. No deployment/Search Console submission without access. Reuse current project; no unrelated Git operations. User authorised implementation after two-page copy review.

## Tasks
- [x] Media worker: assets/client manifest, optimised images/video/posters; verify source coverage.
- [x] Root: tools/render-pages.mjs, index/about, shared styles/app, product/design/research docs.
- [x] Delivery worker: server, build/check, robots/sitemap, 404/error, manifest, deployment docs.
- [x] Root: integrate and browser-test mobile/desktop, themes, gallery, navigation, video.
- [x] Fresh reviewer: inspect final code; root fixes and reruns checks.

## Interfaces
Media manifest entries: id, kind, src, thumbnail, poster, width, height, group, alt, caption, source. Paths site-relative. Renderer produces static HTML. Build excludes client source files and documentation.

## Review focus
Small phones: no clipped controls. No JS/reduced motion: usable content. Auto theme: local hour, persistent manual choice and reset. Gallery: keyboard and focus restoration. Videos: no initial download. Internal links: valid production destinations; custom 404 status. Metadata: unique canonical/title/description, OG/Twitter, Person/Organization schema.

## Verification
Node syntax checks, npm run check/build, Hallmark sloplint, built-in browser phone/laptop light/dark verification. Record evidence in docs/verification.md.

Final user revisions incorporated: book catalogue link, phone restoration, milestones moved to Home, campaign hidden, evidence thumbnails, one-click theme toggle. Final evidence: docs/verification.md.
