# Dhi’s Clock Implementation Plan

> For agentic workers: use executing-plans to implement task-by-task.

**Goal:** Build the approved responsive monochrome author-and-inventor website.
**Architecture:** Static HTML/CSS with progressive enhancement and optimized local assets.
**Tech stack:** HTML, CSS, JavaScript, Node development server; Python asset preparation.
**Spec:** docs/design.md

## Global constraints
- Original website images only; no invented services or proof.
- Light/dark modes; full mobile and laptop support.
- Motion respects reduced-motion; content accessible without JS.
- No external runtime dependencies.

## Review focus
- Theme preference persistence and storage unavailable.
- Narrow screens and large text without overflow.
- Keyboard navigation, Escape and focus restoration in dialogs.
- Image and script failures leave useful content.
- Metadata and contact/blog destinations reflect source facts.

## Tasks
- [ ] 1. Inventory and optimize original assets; document provenance in assets/sources.json.
- [ ] 2. Implement index.html, tokens.css and styles.css with the complete content and SEO.
- [ ] 3. Implement app.js: theme, mobile navigation, image gallery, motion. Native HTML remains the baseline.
- [ ] 4. Add server.mjs, README and verification script. Check links, assets, metadata and size budgets.
- [ ] 5. Inspect rendered desktop/mobile layouts and both themes; exercise menu, gallery and theme persistence; run Hallmark audit and independent review.

## Execution record
User authorized execution. Implement inline in a new dhis-clock folder; no existing application or git repository to modify. Normal browser verification is more useful than unit tests mirroring presentation code. No deployment or paid services.
