const cursorDot = document.getElementById("cursor-dot");
// Focus enhancement for accessibility
document.querySelectorAll(".option-input").forEach((input) => {
  input.addEventListener("focus", () => {
    input.nextElementSibling.style.outline = "2px solid #C19A6B";
  });
  input.addEventListener("blur", () => {
    input.nextElementSibling.style.outline = "none";
  });
});

// Form submission simulation
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = e.target.querySelector("button");
  const original = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Submitted Successfully!';
    btn.style.background = "#4CAF50";
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      btn.style.background = ""; // reset to CSS var
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

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
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

  console.log("Form Data Submitted:");
  console.log(formData);

  // --- Send to Google Sheet ---
  const scriptURL = "https://script.google.com/macros/s/AKfycbxTu_EEu5i4E0JjJyvRGtQAJj7j2eNaNVoBuPOQZFeZ9q73M_dgYEehprVqN4ApypJ-/exec"; // replace with your Web App URL

  const formBody = new FormData();
  for (let key in formData) {
    formBody.append(key, formData[key]);
  }

  fetch(scriptURL, { method: "POST", body: formBody })
    .then(() => console.log("Data sent to Google Sheet successfully."))
    .catch((err) => console.error("Error sending data to Sheet:", err));
}