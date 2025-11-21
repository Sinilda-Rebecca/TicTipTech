const animatedElements = document.querySelectorAll('.animate-on-scroll');

function handleScrollAnimations() {
  animatedElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add('animate-in');
    }
  });
}

window.addEventListener('scroll', handleScrollAnimations);
window.addEventListener('load', handleScrollAnimations);


// // --- Cursor Dot (uses same logic as home.js) ---
// const cursorDot = document.getElementById('cursor-dot');

// document.addEventListener('mousemove', (e) => {
//   cursorDot.style.left = `${e.clientX}px`;
//   cursorDot.style.top = `${e.clientY}px`;
// });

// document.addEventListener('mousedown', () => {
//   cursorDot.style.transform = 'translate(-50%, -50%) scale(0.7)';
//   cursorDot.style.opacity = '0.85';
// });

// document.addEventListener('mouseup', () => {
//   cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
//   cursorDot.style.opacity = '1';
// });