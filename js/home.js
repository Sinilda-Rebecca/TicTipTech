/* =========================================================
   TicTip — Main JS (Redesigned with Premium Physics)
   ========================================================= */

/* -----------------------------
   Custom Mouse Cursor (LERP Trailing Dual-Ring)
----------------------------- */
const cursorDot = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");

let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let ringPos = { x: mouse.x, y: mouse.y };
let dotPos = { x: mouse.x, y: mouse.y };

// Hide cursor when leaving window
document.addEventListener("mouseleave", () => {
  if (cursorDot) cursorDot.style.opacity = "0";
  if (cursorRing) cursorRing.style.opacity = "0";
});

document.addEventListener("mouseenter", () => {
  if (cursorDot) cursorDot.style.opacity = "1";
  if (cursorRing) cursorRing.style.opacity = "1";
});

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Physics loop
function animateCursor() {
  // LERP for smooth outer ring trail (15% interpolation speed)
  ringPos.x += (mouse.x - ringPos.x) * 0.15;
  ringPos.y += (mouse.y - ringPos.y) * 0.15;
  
  // Fast LERP for inner dot (50% interpolation speed)
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

// Hover animations on links and interactive cards
function setupCursorHovers() {
  const hoverables = document.querySelectorAll(
    "a, button, .program-card, .benefit, .feature-card, .testimonial-card, .menu-item, .hamburger, .cta, .filter-btn"
  );
  
  hoverables.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      document.body.classList.add("cursor-hover");
    });
    
    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-hover");
    });
  });
}

// Initial setup
setupCursorHovers();

// Re-run cursor hovers dynamically on scroll/interaction
document.addEventListener("scroll", setupCursorHovers);

// Mouse state clicks
document.addEventListener("mousedown", () => {
  document.body.classList.add("cursor-click");
});

document.addEventListener("mouseup", () => {
  document.body.classList.remove("cursor-click");
});


/* -----------------------------
   Smooth Scroll for Buttons
----------------------------- */
document.querySelectorAll("a[href^='#'], button[href^='#']").forEach((el) => {
  el.addEventListener("click", function (e) {
    const targetID = this.getAttribute("href");

    if (targetID && targetID.startsWith("#") && targetID.length > 1) {
      e.preventDefault();
      const target = document.querySelector(targetID);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});


/* -----------------------------
   Scroll Reveal Animations
----------------------------- */
const scrollElements = document.querySelectorAll(".animate-on-scroll");

const observerOptions = {
  threshold: 0.2, // animation triggers exactly on view
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in");
      scrollObserver.unobserve(entry.target); // animate once
    }
  });
}, observerOptions);

scrollElements.forEach((el) => scrollObserver.observe(el));


/* -----------------------------
   Button Hover Scale Effect
----------------------------- */
document.querySelectorAll(".primary-btn, .secondary-btn, .cta").forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    btn.style.transform = "scale(1.05)";
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "scale(1)";
  });
});


/* -----------------------------
   Feature Cards Hover (Smooth Lift)
----------------------------- */
document.querySelectorAll(".feature-card, .testimonial-card, .benefit").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-5px)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0)";
  });
});


/* -----------------------------
   Menu Items Hover Effect
----------------------------- */
document.querySelectorAll(".menu-item").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    item.style.transform = "translateY(-5px)";
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "translateY(0)";
  });
});


/* -----------------------------
   Watch Demo Button — Popup Video
----------------------------- */
const watchBtn = document.querySelector(".secondary-btn");

if (watchBtn) {
  watchBtn.addEventListener("click", () => {
    alert("Demo video feature coming soon!"); 
    // Replace alert with your popup modal later
  });
}


/* -----------------------------
   Explore Services Button
----------------------------- */
const exploreBtn = document.querySelector(".hero-content .primary-btn");

if (exploreBtn) {
  exploreBtn.addEventListener("click", () => {
    const isInPages = window.location.pathname.includes("/pages/");
    window.location.href = isInPages ? "service.html" : "pages/service.html";
  });
}


/* -----------------------------
   Simple Performance Logging
----------------------------- */
console.log("%cTicTip Loaded Successfully! 🚀", "color:#D4AF37; font-size:16px");

/* ==================== MOBILE MENU ==================== */

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

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

/* ------------- Toggle cursor visibility with "C" key ------------- */
window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'c') {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (dot) dot.style.display = dot.style.display === 'none' ? 'block' : 'none';
    if (ring) ring.style.display = ring.style.display === 'none' ? 'block' : 'none';
  }
});

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
