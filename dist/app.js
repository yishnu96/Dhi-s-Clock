/* Progressive enhancement: purchase links, disclosures and media work without JS. */
(() => {
  const root = document.documentElement;
  const theme = document.querySelector('#theme-toggle');
  const themeLabel = document.querySelector('#theme-label');
  const automatic = document.querySelector('#theme-auto');
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
    themeLabel.textContent = preference === 'auto' ? 'Auto' : preference === 'dark' ? 'Dark' : 'Light';
    theme.setAttribute('aria-label', `${preference === 'auto' ? 'Automatic' : 'Manual'} ${mode} theme. Switch to ${next} mode`);
    theme.title = `Switch to ${next} mode`;
    automatic.hidden = preference === 'auto';
  }
  function setPreference(value) {
    preference = value;
    try { sessionStorage.setItem('dhi-theme', preference); } catch {}
    syncTheme();
  }
  if (theme) {
    theme.closest('.theme-control').hidden = false;
    theme.addEventListener('click', () => setPreference(root.dataset.mode === 'dark' ? 'light' : 'dark'));
    automatic.addEventListener('click', () => setPreference('auto'));
  }
  syncTheme();
  setInterval(() => { if (preference === 'auto' && !document.hidden) syncTheme(); }, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) syncTheme(); });

  const dialog = document.querySelector('.gallery-dialog');
  const gallery = [...document.querySelectorAll('[data-gallery]')].filter(link => !link.closest('[hidden]'));
  if (dialog && typeof dialog.showModal === 'function' && gallery.length) {
    const image = dialog.querySelector('#dialog-image');
    const caption = dialog.querySelector('#dialog-caption');
    const count = dialog.querySelector('.gallery-count');
    const failure = dialog.querySelector('.dialog-error');
    const fallback = dialog.querySelector('#dialog-fallback');
    let selected = 0;
    let opener;
    function showImage(index) {
      selected = (index + gallery.length) % gallery.length;
      const link = gallery[selected];
      image.hidden = false;
      failure.hidden = true;
      image.alt = link.querySelector('img')?.alt || link.dataset.caption;
      image.src = link.href;
      fallback.href = link.href;
      caption.textContent = link.dataset.caption;
      count.textContent = `${selected + 1} / ${gallery.length}`;
    }
    image.addEventListener('error', () => { image.hidden = true; failure.hidden = false; });
    gallery.forEach((link, index) => link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      opener = link;
      showImage(index);
      dialog.showModal();
    }));
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.querySelector('.gallery-prev').addEventListener('click', () => showImage(selected - 1));
    dialog.querySelector('.gallery-next').addEventListener('click', () => showImage(selected + 1));
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); showImage(selected - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); showImage(selected + 1); }
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));
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
