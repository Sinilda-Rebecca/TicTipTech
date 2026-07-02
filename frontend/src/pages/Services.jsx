import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

function useOnScreen(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return visible;
}

function Reveal({ children, className = "", style }) {
  const ref = useRef(null);
  const visible = useOnScreen(ref);
  return (
    <div ref={ref} className={`reveal ${visible ? "in" : ""} ${className}`} style={style}>
      {children}
    </div>
  );
}

const SERVICES = [
  { icon: "🌐", title: "Website Development",   desc: "Marketing sites, landing pages, and content platforms built for speed, SEO, and conversion." },
  { icon: "📱", title: "Mobile Apps",            desc: "Native and cross-platform apps for iOS and Android, designed for real users." },
  { icon: "💻", title: "Web Applications",       desc: "Complex SaaS tools, dashboards, and portals built with scalable modern architectures." },
  { icon: "🎨", title: "UI/UX Design",           desc: "Interfaces designed around how people actually use your product — research to high-fidelity." },
  { icon: "⚙️", title: "Software Development",   desc: "Custom software solutions — from internal tools to enterprise platforms." },
  { icon: "✦",  title: "AI Solutions",           desc: "Practical AI features: search, recommendations, automation, and copilots." },
  { icon: "☁",  title: "Cloud Solutions",        desc: "AWS, GCP, and Azure deployments. Migrations, architecture, and ongoing optimisation." },
  { icon: "✓",  title: "QA & Testing",           desc: "Manual and automated test coverage that catches issues before your users do." },
  { icon: "🤖", title: "Automation",             desc: "Workflow and test automation that saves engineering hours and reduces human error." },
  { icon: "🔌", title: "API Development",        desc: "RESTful and GraphQL APIs — well-documented, versioned, and secure from day one." },
  { icon: "🔧", title: "DevOps",                 desc: "CI/CD pipelines, container orchestration, and cloud infrastructure that scale without drama." },
  { icon: "🛍", title: "E-Commerce",            desc: "Custom storefronts and headless commerce builds that lift conversion and cut checkout friction." },
];

const PROCESS = [
  { n: "1", h: "Discover",         p: "We map your goals, users, and constraints before a single line is written." },
  { n: "2", h: "Design",           p: "Wireframes to high-fidelity UI, reviewed with you at every stage." },
  { n: "3", h: "Build & Test",     p: "Engineering and QA in parallel — automated tests written against every feature." },
  { n: "4", h: "Launch & Support", p: "We deploy, monitor, and stay on for the weeks after launch that matter most." },
];

export default function Services() {
  return (
    <>
      {/* ── Page Hero ─────────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="wrap">
          <div className="breadcrumb">
            <Link to="/">Home</Link> / <span>Services</span>
          </div>
          <div className="page-hero-inner">
            <div>
              <span className="eyebrow">What We Do</span>
              <h1>Services built for how<br />software actually ships.</h1>
              <p className="lead">
                Pick one service or the whole pipeline — we plug in wherever your team needs us.
                Every engagement is senior-led, QA-first, and scoped upfront.
              </p>
            </div>
            <div className="stat-meta-box">
              <div className="stat-meta-row">
                <span className="stat-meta-label">Services</span>
                <span className="stat-meta-value">12</span>
              </div>
              <div className="stat-meta-row">
                <span className="stat-meta-label">Industries</span>
                <span className="stat-meta-value">15+</span>
              </div>
              <div className="stat-meta-row">
                <span className="stat-meta-label">Clients</span>
                <span className="stat-meta-value">80+</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 12-Service Grid ───────────────────────────────────────── */}
      <section>
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">All Services</span>
            <h2>Everything under one roof.</h2>
            <p>Most engagements combine 2–3 services. The seam between them is where the interesting work lives.</p>
          </Reveal>
          <div className="service-grid">
            {SERVICES.map((s) => (
              <Reveal key={s.title}>
                <div className="service-card">
                  <div className="service-icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <Link to="/contact" className="link">
                    Learn more{" "}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ───────────────────────────────────────────────── */}
      <section className="surface">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">How We Work</span>
            <h2>A four-stage process, run the same way every time.</h2>
          </Reveal>
          <Reveal>
            <div className="process-list">
              {PROCESS.map(({ n, h, p }) => (
                <div className="process-row" key={n}>
                  <div className="num">{n}</div>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Engagement Models ─────────────────────────────────────── */}
      <section>
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Engagement Models</span>
            <h2>Three ways to work with us.</h2>
          </Reveal>
          <Reveal>
            <div className="service-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              {[
                { dur: "2–4 Weeks",  name: "Sprint",      desc: "A landing page, brand refresh, or scoping document.", from: "c. $1,800", dark: false },
                { dur: "✦ 8–12 Weeks", name: "Engagement", desc: "The default. Full product surface, brand system, or platform build.", from: "c. $8,500", dark: true },
                { dur: "Ongoing",    name: "Partnership", desc: "Embedded team, quarterly cadence, retainer.", from: "c. $4,000/mo", dark: false },
              ].map(({ dur, name, desc, from, dark }) => (
                <div
                  key={name}
                  className="service-card"
                  style={dark ? { background: "var(--ink)", borderColor: "var(--ink)" } : {}}
                >
                  <p style={{ fontFamily: "var(--mono)", fontSize: "12px", color: dark ? "var(--accent)" : "var(--muted)", marginBottom: "16px" }}>{dur}</p>
                  <h3 style={dark ? { color: "#fff" } : {}}>{name}</h3>
                  <p style={dark ? { color: "rgba(255,255,255,0.6)" } : {}}>{desc}</p>
                  <p style={{ marginTop: "24px", fontFamily: "var(--display)", fontSize: "22px", fontWeight: 800, color: dark ? "#fff" : "var(--ink)" }}>{from}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section>
        <div className="wrap">
          <Reveal>
            <div className="cta-banner">
              <div>
                <h2>Have a project in mind?</h2>
                <p>Tell us what you're building — we'll reply within one business day.</p>
              </div>
              <div className="cta-actions">
                <Link to="/contact" className="btn btn-primary">Start Your Project</Link>
                <Link to="/projects" className="btn btn-outline">See Our Work</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
