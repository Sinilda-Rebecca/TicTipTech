(() => {
  /* ------------------ SCROLL REVEAL ------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  });

  /* ------------------ CURSOR DOT ------------------ */
  const cursorDot = document.getElementById('cursor-dot');
  if (!cursorDot) return;

  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let pos = { x: mouse.x, y: mouse.y };
  const ease = 0.2;

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

  window.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
  });
  window.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });
})();
