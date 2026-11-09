# Dhi’s Clock responsive refinement plan

**Goal:** Improve image browsing and mobile/desktop usability while preserving the established editorial identity and supplied media.
**Architecture:** Existing static React media rendering, generated pages and progressive browser enhancements. No framework migration or new dependencies.
**Spec:** PRODUCT.md and DESIGN.md; user requests audit and implementation with subagents.

## Constraints
- Preserve current uncommitted work, all supplied media and existing purchase destinations.
- Keep Bodoni Moda/Manrope, local-time themes, genuine photographs and uncropped clock.
- Preserve source images; use contained preview stages and original-file access.

## Tasks
- [x] Inspect project, source assets and rendered mobile/desktop baseline.
- [ ] Viewer worker: section-scoped visible galleries, original-image action, loading/error state and focus/scroll restoration. Own app.js and generator dialog/figure helpers.
- [ ] Responsive worker: consistent contained previews, bounded videos, secondary gallery actions, touch targets and responsive viewer. Own CSS only.
- [x] Root: React media preview wrapper in tools/media-sections.mjs.
- [ ] Root: regenerate pages, run build/checks, inspect 320/390/768/1440 widths and both themes, exercise viewer and disclosures.
- [ ] Record audit outcomes and remaining limitations.

## Review focus
Long clippings must remain accessible at original resolution; hidden archive images must not enter visible gallery navigation; short mobile landscape screens must retain viewer controls; keyboard Escape must restore focus; navigation must fit narrow screens without removing purchase access.
