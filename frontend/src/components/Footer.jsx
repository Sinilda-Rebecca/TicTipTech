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
        {/* Top grid */}
        <div className="footer-top">
          {/* Brand + newsletter */}
          <div>
            {/* Logo mark + wordmark */}
            <div className="logo" style={{ gap: "10px" }}>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#ffffff",
                borderRadius: "8px",
                width: "38px",
                height: "38px",
                overflow: "hidden",
                flexShrink: 0,
                border: "1px solid #E7E9EC",
              }}>
                <img
                  src="/logo.png"
                  alt="TicTip logo mark"
                  style={{
                    width: "30px",
                    height: "30px",
                    objectFit: "contain",
                    mixBlendMode: "multiply",
                    display: "block",
                  }}
                />
              </span>
              <span>TicTip</span>
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
            <span>hello@tictiptech.com</span>
            <span>+91 00000 00000</span>
            <span>Chennai, India</span>
          </div>
        </div>

        {/* Bottom row */}
        <div className="footer-bottom">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Small logo in footer bottom */}
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
              borderRadius: "5px",
              width: "22px",
              height: "22px",
              overflow: "hidden",
              border: "1px solid #E7E9EC",
            }}>
              <img
                src="/logo.png"
                alt=""
                aria-hidden="true"
                style={{ width: "18px", height: "18px", objectFit: "contain", mixBlendMode: "multiply", display: "block" }}
              />
            </span>
            <span>© 2026 TicTip Technology. All rights reserved.</span>
          </div>
          <div className="socials">
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="Twitter">X</a>
            <a href="#" aria-label="GitHub">gh</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
