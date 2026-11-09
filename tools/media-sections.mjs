import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

function OpenIcon() {
  return h('svg', { viewBox: '0 0 24 24', 'aria-hidden': true },
    h('path', { d: 'M6 18 18 6M6 6h12v12' }));
}

function MediaRecord({ entry }) {
  const isVideo = entry.kind === 'video';
  const title = entry.title || entry.caption;
  const visual = isVideo
    ? h('video', {
      controls: true, playsInline: true, preload: 'none', poster: entry.poster || entry.thumbnail,
      width: entry.width, height: entry.height, 'aria-label': title
    }, h('source', { src: entry.src, type: 'video/mp4' }),
    h('a', { href: entry.src }, 'Open this video'))
    : h('a', {
      href: entry.src, 'data-gallery': true, 'data-caption': title,
      'aria-label': `View image: ${title}`
    }, h('span', { className: 'evidence-visual' }, h('img', {
      src: entry.thumbnail || entry.src, width: entry.width, height: entry.height,
      alt: entry.alt, loading: 'lazy', decoding: 'async'
    })), h('span', { className: 'evidence-action' }, 'View full image', h(OpenIcon)));

  return h('figure', { className: 'evidence-record', 'data-media-id': entry.id },
    visual, h('figcaption', null,
      h('h3', null, entry.articleUrl ? h('a', { className: 'evidence-title-link', href: entry.articleUrl, target: '_blank', rel: 'noopener' },
        title, h(OpenIcon), h('span', { className: 'visually-hidden' }, ' (opens in a new tab)')) : title)),
    isVideo ? h('p', { className: 'video-error video-note', hidden: true },
      'This video could not load. ', h('a', { href: entry.src }, 'Open the video directly.')) : null);
}

function RecordGrid({ entries, variant = '' }) {
  return h('div', { className: `evidence-grid${entries.length === 2 ? ' evidence-grid--pair' : ''}${variant ? ` evidence-grid--${variant}` : ''}` },
    entries.map(entry => h(MediaRecord, { entry, key: entry.id })));
}

function EvidenceSection({ id, title, intro, entries, note, cta, variant, separateVideos = false }) {
  if (!entries.length) return null;
  return h('section', { className: 'section container evidence-section', id, 'aria-labelledby': `${id}-title` },
    h('div', { className: 'section-heading', 'data-reveal': true },
      h('h2', { id: `${id}-title` }, title), h('p', null, intro)),
    separateVideos ? h(RecordGrid, { entries: entries.filter(entry => entry.kind === 'video'), variant: 'videos' }) : null,
    h(RecordGrid, { entries: separateVideos ? entries.filter(entry => entry.kind !== 'video') : entries, variant }),
    note ? h('p', { className: 'evidence-note' }, note) : null,
    cta ? h('a', { className: 'text-link', href: cta.href, target: '_blank', rel: 'noopener' },
      cta.label, h(OpenIcon), h('span', { className: 'visually-hidden' }, ' (opens in a new tab)')) : null);
}

export function renderEvidenceSection(props) {
  return renderToStaticMarkup(h(EvidenceSection, props));
}

export function renderRecordGrid(entries, variant) {
  return renderToStaticMarkup(h(RecordGrid, { entries, variant }));
}

