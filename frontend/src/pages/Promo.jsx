import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const INCLUSIONS = [
  { icon: "🌐", bold: "FREE Domain & Hosting",    text: "(1 Year Included)" },
  { icon: "🖥️", bold: "Custom Design",             text: "Up to 10 Pages" },
  { icon: "📧", bold: "5 Business Email IDs",      text: "(Professional Setup)" },
  { icon: "🔒", bold: "FREE SSL Security",         text: "(HTTPS Enabled)" },
  { icon: "📱", bold: "Mobile-First Design",       text: "(All Devices)" },
  { icon: "🚀", bold: "SEO Optimised Website",     text: "(Rank on Google)" },
  { icon: "🎨", bold: "FREE Logo Design",          text: "(Brand Identity)" },
  { icon: "💳", bold: "FREE Digital Visiting Card", text: "(Share Anywhere)" },
];

const TRUST_BADGES = [
  { icon: "🛡️", title: "Trusted by",        sub: "Businesses Across India" },
  { icon: "🚀", title: "Designed to",        sub: "Attract, Engage & Convert" },
  { icon: "📈", title: "Performance",        sub: "That Drives Results" },
  { icon: "🎧", title: "Dedicated Support",  sub: "Always" },
];

export default function Promo() {
  const timerRef = useRef(null);

  // Animated countdown to midnight (just a visual touch)
  useEffect(() => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(23, 59, 59, 0);
    let remaining = Math.floor((midnight - now) / 1000);

    const el = document.getElementById("promo-timer");
    if (!el) return;

    const tick = () => {
      if (remaining <= 0) { clearInterval(timerRef.current); return; }
      const h = Math.floor(remaining / 3600);
      const m = Math.floor((remaining % 3600) / 60);
      const s = remaining % 60;
      el.textContent = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
      remaining--;
    };
    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className="promo-page">
      {/* ── SEO ── */}
      <title>Limited Time Offer — Complete Web Package ₹2,999 | TicTip Technology</title>

      {/* ── Banner Wrapper ── */}
      <div className="promo-banner">

        {/* ─── TOP: Logo + Brand ─────────────────── */}
        <div className="promo-brand">
          <img src="/logo.png" alt="TicTip Technology" className="promo-logo-img" />
          <div className="promo-brand-text">
            <span className="promo-brand-name">TicTip<span className="promo-brand-accent"> Technology</span></span>
            <span className="promo-brand-tagline">BUILD • DEPLOY • SCALE</span>
          </div>
        </div>

        {/* ─── OFFER PILL ────────────────────────── */}
        <div className="promo-offer-pill">
          <span className="promo-pill-clock">⏱</span>
          <span>LIMITED TIME OFFER</span>
        </div>

        {/* ─── PRICE BLOCK ───────────────────────── */}
        <div className="promo-price-block">
          <span className="promo-only-label">ONLY</span>
          <span className="promo-price-main">₹2,999</span>
          <span className="promo-price-old">₹5,999</span>
          <span className="promo-today-label">TODAY ONLY!</span>
          <div className="promo-timer-row">
            <span className="promo-timer-label">Expires in:</span>
            <span id="promo-timer" className="promo-timer-value">--:--:--</span>
          </div>
        </div>

        {/* ─── HEADLINE ──────────────────────────── */}
        <div className="promo-headline-block">
          <h1 className="promo-headline">
            COMPLETE<br />
            <span className="promo-headline-accent">WEB PACKAGE</span>
          </h1>
          <p className="promo-sub-headline">
            Everything you need.<br />
            <span className="promo-sub-accent">All in one place.</span>
          </p>
        </div>

        {/* ─── MOCKUP IMAGE ──────────────────────── */}
        <div className="promo-mockup-wrap">
          <div className="promo-mockup-glow" />
          <img
            src="/logo.png"
            alt="TicTip website mockup"
            className="promo-logo-watermark"
          />
          <div className="promo-mockup-screen promo-mockup-laptop">
            <div className="mock-bar">
              <span /><span /><span />
            </div>
            <div className="mock-screen">
              <div className="mock-nav">
                <span className="mock-nav-logo">TicTip</span>
                <div className="mock-nav-links">
                  <span>Services</span><span>Projects</span><span>Contact</span>
                </div>
              </div>
              <div className="mock-hero">
                <div className="mock-hero-text">
                  <div className="mock-hero-eyebrow">TECH AGENCY</div>
                  <div className="mock-hero-h1">Building<br /><span>Digital</span><br />Products.</div>
                  <div className="mock-hero-cta">View Projects →</div>
                </div>
              </div>
            </div>
          </div>

          <div className="promo-mockup-screen promo-mockup-phone">
            <div className="mock-phone-notch" />
            <div className="mock-phone-screen">
              <div className="mock-ph-logo">TicTip</div>
              <div className="mock-ph-hero">
                <div className="mock-ph-h">Building<br /><span>Digital</span><br />Products.</div>
                <div className="mock-ph-cta">Get Started</div>
              </div>
            </div>
          </div>

          {/* Free Digital Marketing badge */}
          <div className="promo-freebie-badge">
            <span className="promo-freebie-icon">🎁</span>
            <div>
              <div className="promo-freebie-title">FREE DIGITAL<br />MARKETING</div>
              <div className="promo-freebie-sub">First 10 Clients Only!</div>
            </div>
          </div>
        </div>

        {/* ─── INCLUSIONS LIST ───────────────────── */}
        <div className="promo-inclusions">
          <div className="promo-inclusions-header">WHAT'S INCLUDED?</div>
          <ul className="promo-inclusions-list">
            {INCLUSIONS.map((item, i) => (
              <li key={i} className="promo-inclusion-item">
                <span className="promo-inclusion-icon">{item.icon}</span>
                <span>
                  <strong>{item.bold}</strong>{" "}
                  <span className="promo-inclusion-sub">{item.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ─── TRUST BADGES ──────────────────────── */}
        <div className="promo-trust-row">
          {TRUST_BADGES.map((b, i) => (
            <div key={i} className="promo-trust-badge">
              <span className="promo-trust-icon">{b.icon}</span>
              <div>
                <div className="promo-trust-title">{b.title}</div>
                <div className="promo-trust-sub">{b.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── CTA BUTTONS ───────────────────────── */}
        <div className="promo-cta-row">
          <a
            href="https://wa.me/919999999999?text=Hi%2C+I+want+the+%E2%82%B92%2C999+Web+Package!"
            className="promo-cta-whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>💬</span>
            <div>
              <div className="promo-cta-main">BOOK NOW</div>
              <div className="promo-cta-sub">LIMITED SLOTS AVAILABLE!</div>
            </div>
          </a>

          <div className="promo-cta-divider">→</div>

          <Link to="/contact" className="promo-cta-dm">
            <span>✉️</span>
            <div>
              <div className="promo-cta-main">DM "WEBSITE" NOW</div>
              <div className="promo-cta-sub">Let's Build Your Online Identity Today!</div>
            </div>
          </Link>
        </div>

        {/* ─── GUARANTEE FOOTER ──────────────────── */}
        <div className="promo-guarantee">
          <span className="promo-guarantee-icon">🛡️</span>
          <div>
            <strong>100% Satisfaction</strong>
            <span className="promo-guarantee-sub"> or we make it right.</span>
          </div>
        </div>

        {/* ─── DECORATIVE DOTS ───────────────────── */}
        <div className="promo-dots promo-dots-tl" aria-hidden="true" />
        <div className="promo-dots promo-dots-br" aria-hidden="true" />
      </div>
    </div>
  );
}
