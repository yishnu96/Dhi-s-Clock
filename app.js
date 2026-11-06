/* Progressive enhancement: links, text and disclosures work without this file. */
(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const scheme = matchMedia('(prefers-color-scheme: dark)');
  const currentMode = () => root.dataset.mode || (scheme.matches ? 'dark' : 'light');
  function syncTheme() {
    const dark = currentMode() === 'dark';
    themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    themeButton.setAttribute('aria-pressed', String(dark));
    document.querySelector('meta[name="theme-color"]').content = dark ? '#171717' : '#fafafa';
  }
  themeButton.hidden = false;
  themeButton.addEventListener('click', () => {
    const mode = currentMode() === 'dark' ? 'light' : 'dark';
    root.dataset.mode = mode;
    try { localStorage.setItem('dhi-mode', mode); } catch { /* Private browsing may block storage. */ }
    syncTheme();
  });
  scheme.addEventListener('change', syncTheme);
  syncTheme();

  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-menu');
  menuButton.hidden = false;
  function closeMenu(restoreFocus = false) {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    if (restoreFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  menu.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) closeMenu(true); });
  matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

  const dialog = document.querySelector('.gallery-dialog');
  const image = document.querySelector('#dialog-image');
  const caption = document.querySelector('#dialog-caption');
  const count = document.querySelector('.gallery-count');
  const imageError = document.querySelector('.dialog-error');
  const fallback = document.querySelector('#dialog-fallback');
  const gallery = [...document.querySelectorAll('[data-gallery]')];
  let selected = 0;
  let opener = null;
  function showImage(index) {
    selected = (index + gallery.length) % gallery.length;
    const link = gallery[selected];
    image.hidden = false;
    imageError.hidden = true;
    image.alt = link.dataset.caption;
    image.src = link.href;
    fallback.href = link.href;
    caption.textContent = link.dataset.caption;
    count.textContent = `${selected + 1} / ${gallery.length}`;
  }
  image.addEventListener('error', () => { image.hidden = true; imageError.hidden = false; });
  if (typeof dialog.showModal === 'function') {
    gallery.forEach((link, index) => link.addEventListener('click', e => {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      opener = link;
      showImage(index);
      dialog.showModal();
    }));
    document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    document.querySelector('.gallery-prev').addEventListener('click', () => showImage(selected - 1));
    document.querySelector('.gallery-next').addEventListener('click', () => showImage(selected + 1));
    dialog.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); showImage(selected - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); showImage(selected + 1); }
    });
    dialog.addEventListener('click', e => {
      if (e.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => opener?.focus({preventScroll:true}));
  }

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (!reduced.matches) entry.target.classList.add('arrive');
        reveal.unobserve(entry.target);
      }
    }, {threshold: 0.12});
    document.querySelectorAll('.section-heading, .clock-copy, .gallery-heading, .journal-heading, .contact-grid').forEach(el => reveal.observe(el));
    const navigation = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        document.querySelectorAll('.desktop-nav a').forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, {rootMargin: '-15% 0px -55% 0px'});
    document.querySelectorAll('main section[id]').forEach(el => navigation.observe(el));
  }
  document.querySelector('#copyright-year').textContent = new Date().getFullYear();
})();
