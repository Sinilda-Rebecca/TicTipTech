import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setMobileMenuOpen((v) => !v);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header>
      <nav className="wrap">
        {/* Logo mark + wordmark */}
        <Link to="/" className="logo" onClick={closeMobileMenu} style={{ gap: "10px" }}>
          {/* Logo image — mix-blend-mode:multiply removes black bg on white surface */}
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
        </Link>

        {/* Desktop nav links */}
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "36px" }}>
          <NavLink to="/services" className={({ isActive }) => (isActive ? "active" : "")}>Services</NavLink>
          <NavLink to="/projects" className={({ isActive }) => (isActive ? "active" : "")}>Projects</NavLink>
          <NavLink to="/about"    className={({ isActive }) => (isActive ? "active" : "")}>About</NavLink>
          <NavLink to="/contact"  className={({ isActive }) => (isActive ? "active" : "")}>Contact</NavLink>
        </div>

        {/* Right: CTA + burger */}
        <div className="nav-right">
          <Link to="/contact" className="btn btn-primary" onClick={closeMobileMenu}>
            Start Your Project
          </Link>
          <button
            className="burger"
            aria-label="Menu"
            onClick={toggleMobileMenu}
            style={{ display: mobileMenuOpen ? "flex" : undefined }}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* Mobile drop-down */}
      {mobileMenuOpen && (
        <div style={{
          position: "absolute", top: "76px", left: 0, right: 0,
          background: "#fff", borderBottom: "1px solid #E7E9EC",
          display: "flex", flexDirection: "column",
          padding: "24px 32px", gap: "18px", zIndex: 99,
        }}>
          <Link to="/services" onClick={closeMobileMenu}>Services</Link>
          <Link to="/projects" onClick={closeMobileMenu}>Projects</Link>
          <Link to="/about"    onClick={closeMobileMenu}>About</Link>
          <Link to="/contact"  onClick={closeMobileMenu}>Contact</Link>
        </div>
      )}
    </header>
  );
}
