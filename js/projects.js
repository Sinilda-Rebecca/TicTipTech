(() => {
  // DOM references
  const preloader = document.getElementById('preloader');
  const yearEl = document.getElementById('year');
  const cursorDot = document.getElementById('cursor-dot');
  const cards = Array.from(document.querySelectorAll('.project-card'));
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
  const TRANSITION_SELECTOR = '[data-transition]';

  // Put current year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------ PRELOADER ------------------ */
  window.addEventListener('load', () => {
    lazyLoadImages();
    if (preloader) {
      preloader.style.transition = 'opacity .6s ease';
      preloader.style.opacity = '0';
      setTimeout(() => preloader.remove(), 700);
    }
  });

  /* ------------- LAZY IMAGE LOADING ------------- */
  function lazyLoadImages() {
    const imgs = document.querySelectorAll('img.lazy');
    imgs.forEach(img => {
      if (!img.dataset.src) return;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      img.classList.remove('lazy');
      img.addEventListener('load', () => {
        img.style.opacity = 1;
      }, { once: true });
    });
  }

  /* ------------- MINIMAL CUSTOM CURSOR (DOT ONLY) ------------- */
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let pos = { x: mouse.x, y: mouse.y };
  const ease = 0.2;

  // Smooth follow loop
  function animateCursor() {
    pos.x += (mouse.x - pos.x) * ease;
    pos.y += (mouse.y - pos.y) * ease;
    cursorDot.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Click feedback (shrink briefly)
  window.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
  });
  window.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });

  /* ------------- SCROLL REVEAL (stagger) ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const idx = cards.indexOf(el);
        const delay = Math.min(0.1 * idx, 0.5);
        el.style.transitionDelay = `${delay}s`;
        el.classList.add('visible');
        io.unobserve(el);
      }
    });
  }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  cards.forEach(c => io.observe(c));

  /* ------------- FILTERING ------------- */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const category = btn.dataset.filter;
      applyFilter(category);
    });
  });

  function applyFilter(cat) {
    cards.forEach((card, i) => {
      const cardCat = card.dataset.category || 'all';
      const show = cat === 'all' || cardCat === cat;
      if (show) {
        card.classList.remove('hidden');
        setTimeout(() => card.classList.add('visible'), 60 * (i % 6));
      } else {
        card.classList.add('hidden');
        card.classList.remove('visible');
      }
    });
  }

  /* ------------- PAGE TRANSITION FADE ------------- */
  function handleTransitionLink(e) {
    const a = e.target.closest(TRANSITION_SELECTOR);
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    e.preventDefault();
    document.documentElement.style.transition = 'opacity .45s ease';
    document.documentElement.style.opacity = '0';
    setTimeout(() => window.location.href = href, 450);
  }
  document.addEventListener('click', handleTransitionLink);

  // Keyboard enter to open card
  cards.forEach(card => {
    card.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        const href = card.getAttribute('href');
        if (href) {
          document.documentElement.style.transition = 'opacity .35s ease';
          document.documentElement.style.opacity = '0';
          setTimeout(() => window.location.href = href, 350);
        }
      }
    });
  });

  /* ------------- Window resize adjustments ------------- */
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(lazyLoadImages, 200);
  });

  /* ------------- Toggle cursor visibility with "C" key ------------- */
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'c') {
      cursorDot.style.display = cursorDot.style.display === 'none' ? 'block' : 'none';
    }
  });
})();
