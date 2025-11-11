
const cursorDot = document.getElementById('cursor-dot');
// Focus enhancement for accessibility
document.querySelectorAll('.option-input').forEach(input => {
  input.addEventListener('focus', () => {
    input.nextElementSibling.style.outline = '2px solid #C19A6B';
  });
  input.addEventListener('blur', () => {
    input.nextElementSibling.style.outline = 'none';
  });
});

// Form submission simulation
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  const original = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Submitted Successfully!';
    btn.style.background = '#4CAF50';
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      btn.style.background = ''; // reset to CSS var
    }, 2500);
  }, 1500);
});

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