import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    const input = e.target.querySelector("input");
    if (input && input.value) {
      alert(`Thanks! We'll be in touch at ${input.value}`);
      input.value = "";
    }
  };

  return (
    <footer>
      <div className="wrap">
        {/* Next navigation block: Ignite Agency Style editorial footer routing */}
        <div className="footer-next-heading">Where to next?</div>
        <div className="footer-next-grid">
          <Link to="/services" className="footer-next-link">Services</Link>
          <Link to="/projects" className="footer-next-link">Projects</Link>
          <Link to="/about" className="footer-next-link">About</Link>
          <Link to="/contact" className="footer-next-link">Contact</Link>
        </div>

        {/* Top grid */}
        <div className="footer-top">
          {/* Brand + newsletter */}
          <div>
            <div className="logo" style={{ gap: "10px", marginBottom: "16px" }}>
              <span className="logo-icon">
                <img
                  src="/logo.png"
                  alt="TicTip logo mark"
                  style={{ width: "80px", height: "80px", objectFit: "contain" }}
                />
              </span>
              <span style={{ color: "#fff" }}>TicTip</span>
            </div>
            <p>
              A software development studio building digital products for startups, SMEs, and enterprises.
            </p>
            <form className="newsletter" onSubmit={handleSubscribe}>
              <input type="email" placeholder="you@company.com" aria-label="Email address" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>

          {/* Company */}
          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/services">Services</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/contact">Contact</Link>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h4>Services</h4>
            <Link to="/services">Web Development</Link>
            <Link to="/services">Mobile Apps</Link>
            <Link to="/services">QA &amp; Testing</Link>
            <Link to="/services">Cloud &amp; DevOps</Link>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact</h4>
            <a href="mailto:admin@tictiptech.com" style={{ color: "inherit" }}>admin@tictiptech.com</a>
            <span>+91 94477 17691</span>
            <span>Chennai, India</span>
          </div>
        </div>

        {/* Bottom row */}
        <div className="footer-bottom">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="logo-icon">
              <img
                src="/logo.png"
                alt=""
                aria-hidden="true"
                style={{ width: "28px", height: "28px", objectFit: "contain" }}
              />
            </span>
            <span>© 2026 TicTip Technology. All rights reserved.</span>
          </div>
          <div className="socials">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">X</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">gh</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
