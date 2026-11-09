/* Progressive enhancement: purchase links, disclosures and media work without JS. */
(() => {
  const root = document.documentElement;
  const theme = document.querySelector('#theme-toggle');
  const themeLabel = document.querySelector('#theme-label');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  let preference = 'auto';
  try {
    const saved = sessionStorage.getItem('dhi-theme');
    if (['light', 'dark'].includes(saved)) preference = saved;
  } catch { /* Automatic mode still works when storage is unavailable. */ }
  function localMode() {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18 ? 'light' : 'dark';
  }
  function syncTheme() {
    const mode = preference === 'auto' ? localMode() : preference;
    root.dataset.mode = mode;
    if (themeMeta) themeMeta.content = mode === 'dark' ? '#171717' : '#ffffff';
    if (!theme) return;
    const next = mode === 'dark' ? 'light' : 'dark';
    themeLabel.textContent = next === 'dark' ? 'Dark mode' : 'Light mode';
    theme.setAttribute('aria-label', `Switch to ${next} mode`);
    theme.title = `Switch to ${next} mode`;
  }
  function setPreference(value) {
    preference = value;
    try { sessionStorage.setItem('dhi-theme', preference); } catch {}
    syncTheme();
  }
  if (theme) {
    theme.closest('.theme-control').hidden = false;
    theme.addEventListener('click', () => setPreference(root.dataset.mode === 'dark' ? 'light' : 'dark'));
  }
  syncTheme();
  setInterval(() => { if (preference === 'auto' && !document.hidden) syncTheme(); }, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) syncTheme(); });

  const dialog = document.querySelector('.gallery-dialog');
  const galleryLinks = [...document.querySelectorAll('[data-gallery]')];
  if (dialog && typeof dialog.showModal === 'function' && galleryLinks.length) {
    const image = dialog.querySelector('#dialog-image');
    const caption = dialog.querySelector('#dialog-caption');
    const count = dialog.querySelector('.gallery-count');
    const failure = dialog.querySelector('.dialog-error');
    const fallback = dialog.querySelector('#dialog-fallback');
    const original = dialog.querySelector('#dialog-original');
    const loading = dialog.querySelector('.dialog-loading');
    const previous = dialog.querySelector('.gallery-prev');
    const next = dialog.querySelector('.gallery-next');
    let gallery = [];
    let selected = 0;
    let opener;
    function showImage(index) {
      selected = (index + gallery.length) % gallery.length;
      const link = gallery[selected];
      image.hidden = true;
      failure.hidden = true;
      loading.hidden = false;
      image.alt = link.querySelector('img')?.alt || link.dataset.caption;
      image.src = link.href;
      fallback.href = link.href;
      original.href = link.href;
      caption.textContent = link.dataset.caption;
      count.textContent = `Image ${selected + 1} of ${gallery.length}`;
      previous.disabled = next.disabled = gallery.length < 2;
      if (image.complete) finishImage();
    }
    function finishImage() {
      loading.hidden = true;
      image.hidden = !image.naturalWidth;
      failure.hidden = !!image.naturalWidth;
    }
    image.addEventListener('load', finishImage);
    image.addEventListener('error', finishImage);
    galleryLinks.forEach(link => link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      // Keep each collection local and respect the visitor's archive disclosures.
      const collection = link.closest('section') || link.closest('figure');
      gallery = galleryLinks.filter(candidate =>
        collection?.contains(candidate) &&
        !candidate.closest('[hidden], details:not([open])') &&
        candidate.getClientRects().length > 0
      );
      if (!gallery.includes(link)) return;
      event.preventDefault();
      opener = link;
      showImage(gallery.indexOf(link));
      dialog.showModal();
      root.dataset.galleryOpen = '';
    }));
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    previous.addEventListener('click', () => showImage(selected - 1));
    next.addEventListener('click', () => showImage(selected + 1));
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); showImage(selected - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); showImage(selected + 1); }
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      delete root.dataset.galleryOpen;
      opener?.focus({ preventScroll: true });
    });
  }

  document.querySelectorAll('video').forEach(video => {
    video.addEventListener('play', () => document.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); }));
    video.addEventListener('error', () => {
      const message = video.parentElement.querySelector('.video-error');
      if (message) message.hidden = false;
    });
  });
  document.querySelectorAll('.gallery-more').forEach(details => details.addEventListener('toggle', () => {
    if (!details.open) details.querySelectorAll('video').forEach(video => video.pause());
  }));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (!reduced.matches) entry.target.classList.add('arrive');
        observer.unobserve(entry.target);
      });
    }, { threshold: .12 });
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
  }
  const year = document.querySelector('#copyright-year');
  if (year) year.textContent = new Date().getFullYear();
})();
