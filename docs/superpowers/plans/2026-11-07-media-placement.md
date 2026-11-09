# Clock and author media implementation plan

**Goal:** Help unsure buyers understand the clock and assess Dhi’s work before visiting Amazon.

**Architecture:** Preserve the two existing pages. Render new media sections with React at build time; retain native image links, disclosure controls and video playback. No React browser bundle is required.

**Direction:** Keep the established monochrome editorial layout with colour photographs. A curated lead selection with expandable supporting records keeps the mobile page readable; a single unfiltered gallery would obscure the buying decision. User explicitly requested media review, relevant placement and implementation.

## Tasks

- [x] Audit every supplied image and sample both videos; record duplicates, visible evidence and cautious captions in `docs/media-audit-2026-11-07.md`.
- [x] Put a clear clock-video link directly below the header and in the clock explanation/FAQ. Remove author-content YouTube links and the entire old “Out in the world” section.
- [x] Build `tools/media-sections.mjs` React components with descriptive headings, full-image links, accurate dimensions, lazy image loading and manual videos. Integrate reviewed clock material into Home and author material into About.
- [x] Add responsive styling, maintain the prominent Amazon action, and update copy/deployment documentation for React build dependencies.
- [x] Build and validate source/dist. Check both pages at phone/laptop sizes, expand new media, open/close images, verify theme switching and media availability.

## Evidence rules

Captions describe what supplied records show. Rankings are historical snapshots; press and event coverage do not imply scientific validation. Never invent testimonials, speech transcripts, identities, awards or dates. Exact duplicates appear once. Preserve source media and unrelated user changes.

## Review focus

Readable screenshots on mobile via full-image viewer; no stretched/cropped evidence; no duplicate item IDs; YouTube described as clock information; no automatic video download; no reintroduction of the removed old gallery. Source links use the channel handle without the trailing punctuation from the user's prose.
