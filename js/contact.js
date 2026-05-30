const cursorDot = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");

// Focus enhancement for accessibility
document.querySelectorAll(".option-input").forEach((input) => {
  input.addEventListener("focus", () => {
    input.nextElementSibling.style.outline = "2px solid #D4AF37";
  });
  input.addEventListener("blur", () => {
    input.nextElementSibling.style.outline = "none";
  });
});

// Form submission handling
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = e.target.querySelector("button");
  const original = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  getAndPost()
    .then((response) => {
      if (!response.ok) {
        throw new Error("Form upload failed");
      }
      btn.innerHTML = '<i class="fas fa-check"></i> Submitted Successfully!';
      btn.style.background = "#4CAF50";
      btn.style.color = "#FFFFFF";
      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
        btn.style.background = ""; // reset to CSS var
        btn.style.color = "";
      }, 2500);
    })
    .catch((err) => {
      console.error("Error sending data to Sheet:", err);
      btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Submission Failed!';
      btn.style.background = "#F44336";
      btn.style.color = "#FFFFFF";
      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
        btn.style.background = "";
        btn.style.color = "";
      }, 2500);
    });
});

/* ------------- PREMIUM CUSTOM CURSOR (LERP DUAL-RING) ------------- */
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let ringPos = { x: mouse.x, y: mouse.y };
let dotPos = { x: mouse.x, y: mouse.y };

// Smooth follow loop
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

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Active Hovers
function setupCursorHovers() {
  const hoverables = document.querySelectorAll("a, button, .option-label, input, textarea");
  hoverables.forEach(el => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });
}
setupCursorHovers();

// Mouse state clicks
document.addEventListener("mousedown", () => {
  document.body.classList.add("cursor-click");
});

document.addEventListener("mouseup", () => {
  document.body.classList.remove("cursor-click");
});

function getAndPost() {
  const form = document.getElementById("contactForm");

  const formData = {
    name: form.querySelector('input[placeholder="Enter your name"]').value,
    email: form.querySelector('input[placeholder="Enter your email"]').value,
    phone: form.querySelector('input[placeholder="Enter your phone number"]').value,
    company: form.querySelector('input[placeholder="Your company name"]').value,
    projectType: form.querySelector('input[name="project-type"]:checked')?.value || "",
    description: form.querySelector("textarea").value,
    budget: form.querySelector('input[name="budget"]:checked')?.value || "",
    reference: form.querySelector('input[placeholder="https://example.com"]').value,
  };

  console.log("Form Data Submitted:", formData);

  // --- Send to Google Sheet ---
  const scriptURL = "https://script.google.com/macros/s/AKfycbzSLaEDMvloAykLcDvRuymlCGzZqRI4zPpXf-7BU_LJJRYKiXUHaN7lX44KvYSRalqP/exec";

  const formBody = new FormData();
  for (let key in formData) {
    formBody.append(key, formData[key]);
  }

  return fetch(scriptURL, { method: "POST", body: formBody });
}

// Ticking Local Studio Clock
function startLocalClock() {
  const clockEl = document.getElementById("localClock");
  if (!clockEl) return;
  
  function updateTime() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  
  updateTime(); // initial tick
  setInterval(updateTime, 1000);
}
document.addEventListener("DOMContentLoaded", startLocalClock);
startLocalClock(); // fallback execution if DOM loaded

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