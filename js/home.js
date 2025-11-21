/* =========================================================
   TicTip — Main JS (Corrected & Optimized)
   ========================================================= */

/* -----------------------------
   Custom Mouse Cursor
----------------------------- */
const cursor = document.getElementById("cursor-dot");

document.addEventListener("mousemove", (e) => {
  cursor.style.top = e.clientY + "px";
  cursor.style.left = e.clientX + "px";
});

document.addEventListener("mousedown", () => {
  cursor.classList.add("clicking");
});

document.addEventListener("mouseup", () => {
  cursor.classList.remove("clicking");
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
const exploreBtn = document.querySelector(".primary-btn");

if (exploreBtn) {
  exploreBtn.addEventListener("click", () => {
    window.location.href = "pages/service.html";
  });
}


/* -----------------------------
   Simple Performance Logging
----------------------------- */
console.log("%cTicTip Loaded Successfully! 🚀", "color:#C19A6B; font-size:16px");

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
