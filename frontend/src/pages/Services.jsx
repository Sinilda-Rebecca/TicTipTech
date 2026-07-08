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

function Reveal({ children, className = "", style, delay = 0 }) {
  const ref = useRef(null);
  const visible = useOnScreen(ref);
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "in" : ""} ${className}`}
      style={{ ...style, transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
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

const TYPEWRITER_PHRASES = [
  "software actually ships.",
  "products users love.",
  "systems scale up.",
  "sprints convert.",
];

function useTypewriter(phrases, typingSpeed = 60, pauseMs = 1800, deleteSpeed = 35) {
  const [display, setDisplay] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[phraseIdx];
    let timer;
    if (!deleting && charIdx <= phrase.length) {
      timer = setTimeout(() => {
        setDisplay(phrase.slice(0, charIdx));
        setCharIdx((c) => c + 1);
      }, charIdx === phrase.length ? pauseMs : typingSpeed);
    } else if (!deleting && charIdx > phrase.length) {
      setDeleting(true);
    } else if (deleting && charIdx > 0) {
      timer = setTimeout(() => {
        setDisplay(phrase.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
      }, deleteSpeed);
    } else {
      setDeleting(false);
      setPhraseIdx((i) => (i + 1) % phrases.length);
    }
    return () => clearTimeout(timer);
  }, [charIdx, deleting, phraseIdx, phrases, typingSpeed, pauseMs, deleteSpeed]);

  return display;
}

export default function Services() {
  const [activeService, setActiveService] = useState(0);
  const typewriterText = useTypewriter(TYPEWRITER_PHRASES);

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
              <h1 style={{ minHeight: "2.2em" }}>
                Services built for how<br />
                <span className="typewriter-phrase">
                  {typewriterText}
                  <span className="typewriter-cursor" />
                </span>
              </h1>
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

      {/* ── Vertical Accordion List (Ignite Agency Style) ─────────── */}
      <section>
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">All Services</span>
            <h2>Everything under one roof.</h2>
            <p>Most engagements combine 2–3 services. The seam between them is where the interesting work lives.</p>
          </Reveal>

          <Reveal>
            <div className="service-accordion-list">
              {SERVICES.map((s, idx) => (
                <div
                  key={s.title}
                  className={`service-row ${activeService === idx ? "open" : ""}`}
                  onClick={() => setActiveService(idx)}
                >
                  <div className="service-row-header">
                    <div className="service-row-left">
                      <span className="service-row-num">{String(idx + 1).padStart(2, "0")}</span>
                      <span className="service-row-title">{s.title}</span>
                    </div>
                    <span className="service-row-arrow">{s.icon}</span>
                  </div>
                  <div className="service-row-desc">
                    <p style={{ fontSize: "16px", color: "var(--muted)", marginTop: "12px", lineHeight: "1.65" }}>
                      {s.desc}
                    </p>
                    <Link to="/contact" className="btn btn-outline" style={{ marginTop: "18px", padding: "8px 20px", fontSize: "13px" }}>
                      Inquire About This Service →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
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
            <div className="service-grid">
              {[
                { dur: "2–4 Weeks",  name: "Sprint",      desc: "A landing page, brand refresh, or scoping document.", from: "c. $1,800", dark: false },
                { dur: "✦ 8–12 Weeks", name: "Engagement", desc: "The default. Full product surface, brand system, or platform build.", from: "c. $8,500", dark: true },
                { dur: "Ongoing",    name: "Partnership", desc: "Embedded team, quarterly cadence, retainer.", from: "c. $4,000/mo", dark: false },
              ].map(({ dur, name, desc, from, dark }) => (
                <div
                  key={name}
                  className="service-card"
                  style={dark ? { borderColor: "var(--accent)" } : {}}
                >
                  <p style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--accent)", marginBottom: "16px" }}>{dur}</p>
                  <h3>{name}</h3>
                  <p style={{ marginTop: "12px", color: "var(--muted)" }}>{desc}</p>
                  <p style={{ marginTop: "24px", fontFamily: "var(--display)", fontSize: "24px", fontWeight: 800, color: "var(--ink)" }}>{from}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Tech Bento Grid ─────────────────────────────────────────── */}
      <section className="surface">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Our Stack</span>
            <h2>Modern technologies we build with.</h2>
            <p>We choose stable, widely-supported tools optimized for speed, safety, and cloud deployment.</p>
          </Reveal>
          
          <Reveal>
            <div className="tech-bento-grid">
              {[
                { name: "React / Next.js", cat: "Frontend", desc: "For snappy, client-facing user interfaces & server-rendered sites.", glow: "rgba(0, 240, 255, 0.15)", icon: "⚛️" },
                { name: "FastAPI / Node.js", cat: "Backend", desc: "High-performance, type-safe API gateways and real-time backend systems.", glow: "rgba(0, 208, 130, 0.15)", icon: "🐍" },
                { name: "PostgreSQL / Redis", cat: "Databases", desc: "Structured SQL relational stores paired with fast distributed in-memory cache.", glow: "rgba(155, 81, 224, 0.15)", icon: "🗄️" },
                { name: "AWS / Docker", cat: "DevOps & Cloud", desc: "Secure containerized orchestration and serverless auto-scaling setups.", glow: "rgba(255, 105, 0, 0.15)", icon: "☁️" },
                { name: "Playwright / Jest", cat: "QA & Testing", desc: "End-to-end user flows and unit testing suites built right in from sprint one.", glow: "rgba(255, 0, 122, 0.15)", icon: "🧪" },
                { name: "Figma / GSAP", cat: "Design & Interaction", desc: "Pixel-perfect interactive prototyping and fluid high-performance web animations.", glow: "rgba(198, 255, 0, 0.15)", icon: "🎨" }
              ].map((t) => {
                const handleMouseMove = (e) => {
                  const card = e.currentTarget;
                  const rect = card.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  card.style.setProperty("--mouse-x", `${x}px`);
                  card.style.setProperty("--mouse-y", `${y}px`);
                };

                return (
                  <div
                    key={t.name}
                    className="tech-bento-card"
                    onMouseMove={handleMouseMove}
                    style={{ "--glow-color": t.glow }}
                  >
                    <div className="bento-card-bg-glow" />
                    <div className="bento-card-content">
                      <div className="bento-card-header">
                        <span className="bento-icon">{t.icon}</span>
                        <span className="bento-category">{t.cat}</span>
                      </div>
                      <h3>{t.name}</h3>
                      <p>{t.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>
      <section>
        <div className="wrap">
          <Reveal>
            <div className="cta-banner">
              <div>
                <h2>Have a project in mind?</h2>
                <p>Tell us what you're building — we'll reply within one business day.</p>
              </div>
              <div className="cta-actions">
                <Link to="/contact" className="btn btn-primary">Start Your Project →</Link>
                <Link to="/projects" className="btn btn-outline">See Our Work</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
