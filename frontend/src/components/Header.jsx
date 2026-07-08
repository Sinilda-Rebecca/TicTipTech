import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  // Read theme on mount
  useEffect(() => {
    const activeTheme = document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(activeTheme);
  }, []);

  const toggleMenu = () => setMenuOpen((v) => !v);
  const closeMenu = () => setMenuOpen(false);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    
    // Add transition class to root
    document.documentElement.classList.add("theme-transition");
    
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    
    // Clean up class after transition completes
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 500);
  };

  return (
    <>
      <header>
        <div className="wrap nav-container">
          {/* Logo mark + wordmark */}
          <Link to="/" className="logo" onClick={closeMenu}>
            <span className="logo-icon">
              <img
                src="/logo.png"
                alt="TicTip logo mark"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </span>
            <span>TicTip</span>
          </Link>

          {/* Desktop nav links */}
          <div className="nav-links">
            <NavLink to="/services" className={({ isActive }) => (isActive ? "active" : "")}>Services</NavLink>
            <NavLink to="/projects" className={({ isActive }) => (isActive ? "active" : "")}>Projects</NavLink>
            <NavLink to="/about"    className={({ isActive }) => (isActive ? "active" : "")}>About</NavLink>
            <NavLink to="/contact"  className={({ isActive }) => (isActive ? "active" : "")}>Contact</NavLink>
          </div>

          {/* Right: Toggle + Menu trigger */}
          <div className="nav-right">
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <button className="menu-btn" onClick={toggleMenu} aria-label="Open menu">
              Menu
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Overlay Menu (Ignite Agency Style) */}
      <div className={`menu-overlay ${menuOpen ? "open" : ""}`}>
        <div className="menu-header">
          <Link to="/" className="logo" onClick={closeMenu}>
            <span className="logo-icon">
              <img
                src="/logo.png"
                alt="TicTip logo mark"
                style={{ width: "80px", height: "80px", objectFit: "contain" }}
              />
            </span>
            <span>TicTip</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <button className="menu-close-btn" onClick={closeMenu} aria-label="Close menu">
              Close
            </button>
          </div>
        </div>

        <div className="wrap menu-content">
          {/* Left panel: Massive links */}
          <nav className="menu-nav">
            <div className="menu-nav-item">
              <span className="menu-nav-num">01</span>
              <NavLink to="/" className={({ isActive }) => `menu-nav-link ${isActive ? "active" : ""}`} onClick={closeMenu}>Home</NavLink>
            </div>
            <div className="menu-nav-item">
              <span className="menu-nav-num">02</span>
              <NavLink to="/services" className={({ isActive }) => `menu-nav-link ${isActive ? "active" : ""}`} onClick={closeMenu}>Services</NavLink>
            </div>
            <div className="menu-nav-item">
              <span className="menu-nav-num">03</span>
              <NavLink to="/projects" className={({ isActive }) => `menu-nav-link ${isActive ? "active" : ""}`} onClick={closeMenu}>Projects</NavLink>
            </div>
            <div className="menu-nav-item">
              <span className="menu-nav-num">04</span>
              <NavLink to="/about" className={({ isActive }) => `menu-nav-link ${isActive ? "active" : ""}`} onClick={closeMenu}>About</NavLink>
            </div>
            <div className="menu-nav-item">
              <span className="menu-nav-num">05</span>
              <NavLink to="/contact" className={({ isActive }) => `menu-nav-link ${isActive ? "active" : ""}`} onClick={closeMenu}>Contact</NavLink>
            </div>
          </nav>

          {/* Right panel: Sidebar links / contact info */}
          <div className="menu-sidebar">
            <div>
              <div className="menu-section-title">Say Hello</div>
              <div className="menu-sidebar-links">
                <a href="mailto:admin@tictiptech.com">admin@tictiptech.com</a>
              </div>
            </div>
            <div>
              <div className="menu-section-title">Follow Us</div>
              <div className="menu-sidebar-links" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: "16px" }}>LinkedIn</a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: "16px" }}>GitHub</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: "16px" }}>Twitter</a>
              </div>
            </div>
            <div>
              <Link to="/contact" className="btn btn-primary" onClick={closeMenu}>
                Start Your Project →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
