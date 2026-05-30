(() => {
  // DOM references
  const preloader = document.getElementById('preloader');
  const yearEl = document.getElementById('year');
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const cards = Array.from(document.querySelectorAll('.project-card'));
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
  const TRANSITION_SELECTOR = '[data-transition]';

  // Put current year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------ PRELOADER ------------------ */
  const percentEl = document.getElementById('percent');
  let currentPercent = 0;
  
  const progressInterval = setInterval(() => {
    currentPercent += Math.floor(Math.random() * 15) + 5;
    if (currentPercent >= 100) {
      currentPercent = 100;
      clearInterval(progressInterval);
      finishLoading();
    }
    if (percentEl) percentEl.textContent = `${currentPercent}%`;
  }, 45);

  function finishLoading() {
    lazyLoadImages();
    if (preloader) {
      preloader.style.transition = 'opacity .6s ease';
      preloader.style.opacity = '0';
      setTimeout(() => preloader.remove(), 700);
    }
  }

  window.addEventListener('load', () => {
    if (currentPercent < 100) {
      clearInterval(progressInterval);
      let finishInterval = setInterval(() => {
        currentPercent += 10;
        if (currentPercent >= 100) {
          currentPercent = 100;
          clearInterval(finishInterval);
          finishLoading();
        }
        if (percentEl) percentEl.textContent = `${currentPercent}%`;
      }, 20);
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

  /* ------------- PREMIUM CUSTOM CURSOR (LERP DUAL-RING) ------------- */
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let ringPos = { x: mouse.x, y: mouse.y };
  let dotPos = { x: mouse.x, y: mouse.y };

  // Physics loop
  function animateCursor() {
    ringPos.x += (mouse.x - ringPos.x) * 0.15;
    ringPos.y += (mouse.y - ringPos.y) * 0.15;
    
    dotPos.x += (mouse.x - dotPos.x) * 0.5;
    dotPos.y += (mouse.y - dotPos.y) * 0.5;
    
    if (cursorRing) {
      cursorRing.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
    }
    if (cursorDot) {
      cursorDot.style.transform = `translate(${dotPos.x}px, ${dotPos.y}px)`;
    }
    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Hover setups for dynamic cards, buttons, links
  function setupCursorHovers() {
    const hoverables = document.querySelectorAll(
      "a, button, .project-card, .filter-btn, .cta"
    );
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }
  setupCursorHovers();
  document.addEventListener('scroll', setupCursorHovers);

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
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || a.getAttribute('target') === '_blank') return;
    
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
      if (cursorDot) cursorDot.style.display = cursorDot.style.display === 'none' ? 'block' : 'none';
      if (cursorRing) cursorRing.style.display = cursorRing.style.display === 'none' ? 'block' : 'none';
    }
  });

  /* ==================== MOBILE MENU ==================== */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      mobileMenu.classList.toggle("active");
    });

    // Close when clicking a link
    document.querySelectorAll(".mobile-menu nav a").forEach(link => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        mobileMenu.classList.remove("active");
      });
    });
  }
})();
