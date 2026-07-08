import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ── Shared Hooks ──────────────────────────────────────────────────────────────
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

function Counter({ target, visible }) {
  const [val, setVal] = useState(0);
  const ran = useRef(false);
  useEffect(() => {
    if (!visible || ran.current) return;
    ran.current = true;
    let cur = 0;
    const step = Math.max(1, Math.round(target / 50));
    const tick = () => {
      cur += step;
      if (cur >= target) { setVal(target); return; }
      setVal(cur);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, target]);
  return <>{val}</>;
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

// ── Data ──────────────────────────────────────────────────────────────────────
const TEAM = [
  { initials: "RK", name: "Raj Kumar",      role: "Founder & CEO" },
  { initials: "PM", name: "Priya Menon",    role: "Head of Design" },
  { initials: "AS", name: "Arjun Sharma",   role: "Lead Engineer" },
  { initials: "SD", name: "Sneha Devi",     role: "QA & Automation" },
  { initials: "VN", name: "Vikram Nair",    role: "Cloud Architect" },
  { initials: "LP", name: "Lakshmi Pillai", role: "Project Manager" },
];

const VALUES = [
  { num: "01", h: "Client-first thinking",  p: "Every decision starts with one question: does this serve the client's users and goals?" },
  { num: "02", h: "Quality over speed",     p: "We'd rather miss a deadline than ship something we aren't proud of." },
  { num: "03", h: "Transparent communication", p: "No hidden blockers. Weekly updates, direct Slack access, honest timelines." },
  { num: "04", h: "You own everything",     p: "Full IP transfer — code, designs, data. No lock-in, ever." },
];

const TIMELINE = [
  { year: "2019", h: "TicTip founded",         p: "Started in Chennai with 3 engineers and a shared belief that software quality can be built in, not bolted on." },
  { year: "2021", h: "Team of 20",             p: "Expanded into mobile, AI, and DevOps practices. Onboarded our first enterprise client." },
  { year: "2022", h: "100 projects shipped",   p: "Hit our first major milestone: 100 products live in production across 12 industries." },
  { year: "2023", h: "ISO 9001 certified",     p: "Formalised our quality management system and achieved international certification." },
  { year: "2024", h: "AI & Automation practice", p: "Launched dedicated AI integration and test-automation service lines." },
  { year: "2025", h: "Global client base",     p: "Now serving clients across India, UK, USA, and Southeast Asia with 40+ engineers." },
];

const TESTIMONIALS = [
  { q: "TicTip shipped our MVP in eight weeks and it hasn't needed a rewrite since. The test coverage they left us with is better than what most agencies deliver at handoff.", n: "R. Menon",     role: "Founder, SaaS Startup" },
  { q: "What stood out was how few bugs made it to production. Their QA process caught things our internal team would have missed.",                                            n: "A. Fernandes", role: "Product Lead, E-commerce" },
  { q: "Clear timelines, no scope creep, and they were honest when something would take longer. Exactly what we needed for a fixed-budget project.",                           n: "S. Iyer",      role: "Operations Director" },
];

const STACK = ["React", "Next.js", "Node.js", "Python", "FastAPI", "PostgreSQL", "AWS", "Docker", "Playwright", "Figma", "Flutter", "TypeScript"];

const CERTS = ["ISO 9001:2015", "AWS Certified", "Google Cloud Partner", "Meta Business Partner", "NASSCOM Member"];

const STATS = [
  { count: 120, suffix: "+", label: "Products Shipped" },
  { count: 6,   suffix: "+", label: "Years in Business" },
  { count: 40,  suffix: "+", label: "Engineers & Designers" },
  { count: 98,  suffix: "%", label: "On-time Delivery" },
];

const TYPEWRITER_PHRASES = [
  "companies depend on.",
  "users love using.",
  "businesses grow with.",
  "studios scale up.",
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

export default function About() {
  const statsRef = useRef(null);
  const statsVisible = useOnScreen(statsRef, 0.3);
  const typewriterText = useTypewriter(TYPEWRITER_PHRASES);

  return (
    <>
      {/* ── Page Hero ─────────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="wrap">
          <div className="breadcrumb">
            <Link to="/">Home</Link> / <span>About Us</span>
          </div>
          <div className="page-hero-inner">
            <div>
              <span className="eyebrow">Who We Are</span>
              <h1 style={{ minHeight: "2.2em" }}>
                Building digital products<br />
                <span className="typewriter-phrase">
                  {typewriterText}
                  <span className="typewriter-cursor" />
                </span>
              </h1>
              <p className="lead">
                TicTip Technology is a Chennai-based software studio. We design,
                build, test, and ship digital products for startups, SMEs, and
                enterprises — under one roof, from first idea to live traffic.
              </p>
            </div>
            <div className="stat-meta-box">
              <div className="stat-meta-row">
                <span className="stat-meta-label">Founded</span>
                <span className="stat-meta-value">2019</span>
              </div>
              <div className="stat-meta-row">
                <span className="stat-meta-label">Team</span>
                <span className="stat-meta-value">40+</span>
              </div>
              <div className="stat-meta-row">
                <span className="stat-meta-label">Projects</span>
                <span className="stat-meta-value">120+</span>
              </div>
              <div className="stat-meta-row">
                <span className="stat-meta-label">Location</span>
                <span className="stat-meta-value">Chennai</span>
              </div>
            </div>
          </div>

          {/* Animated Counters */}
          <div ref={statsRef} className="about-stats-grid">
            {STATS.map((s) => (
              <div className="about-stat-card" key={s.label}>
                <b><Counter target={s.count} visible={statsVisible} />{s.suffix}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Company Story ─────────────────────────────────────────── */}
      <section>
        <div className="wrap intro-grid">
          <Reveal>
            <span className="eyebrow">Our Story</span>
            <p style={{ marginTop: "24px" }}>
              TicTip was founded in 2019 with one belief: that great software is not
              an accident — it's engineered. We started as a small QA-first consultancy
              and grew into a full-stack product studio because our clients kept asking
              us to stay longer and do more.
            </p>
            <p style={{ marginTop: "24px", fontSize: "22px", lineHeight: 1.6, color: "var(--ink)", fontFamily: "var(--display)", fontWeight: 700 }}>
              Today we run the entire product lifecycle — design, engineering, testing,
              and deployment — under one roof, so nothing gets lost in handoffs.
            </p>
          </Reveal>
          <Reveal>
            <ul className="intro-list">
              {[
                { b: "Full-stack delivery.", t: "Design, engineering, and QA under one roof." },
                { b: "Testing built in.", t: "Every build ships with automated coverage." },
                { b: "Built to scale.", t: "Cloud-native, CI/CD from day one." },
                { b: "No lock-in.", t: "Full IP transfer. Your code, your data, always." },
              ].map(({ b, t }) => (
                <li key={b}>
                  <span className="check">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <path d="M4 12l5 5L20 6" stroke="#0B0B0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div><b>{b}</b> {t}</div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── Mission & Vision ──────────────────────────────────────── */}
      <section className="surface">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Purpose</span>
            <h2>Mission &amp; Vision</h2>
          </Reveal>
          <Reveal>
            <div className="mission-vision-grid">
              <div className="mv-card">
                <div className="mv-icon">🎯</div>
                <h3>Our Mission</h3>
                <p style={{ marginTop: "12px", color: "var(--muted)", lineHeight: "1.65" }}>
                  To deliver software products that companies can depend on in
                  production — built with rigorous engineering, tested automatically,
                  and designed to grow with the business.
                </p>
              </div>
              <div className="mv-card">
                <div className="mv-icon">🔭</div>
                <h3>Our Vision</h3>
                <p style={{ marginTop: "12px", color: "var(--muted)", lineHeight: "1.65" }}>
                  To be the most trusted technology partner for growth-stage businesses
                  in Asia — known not just for what we ship, but for how long it holds up.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Core Values ───────────────────────────────────────────── */}
      <section>
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">What We Stand For</span>
            <h2>Core Values</h2>
          </Reveal>
          <Reveal>
            <div className="why-grid">
              {VALUES.map(({ num, h, p }) => (
                <div className="why-card" key={num}>
                  <span className="num">{num}</span>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Meet Our Team ─────────────────────────────────────────── */}
      <section className="surface">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">The People</span>
            <h2>Meet Our Team</h2>
            <p>A compact, senior team — every person here has shipped real products to real users.</p>
          </Reveal>
          <Reveal>
            <div className="team-grid-light">
              {TEAM.map((m) => (
                <div className="team-card-light" key={m.name}>
                  <div className="team-initials-light">{m.initials}</div>
                  <div>
                    <h4>{m.name}</h4>
                    <p style={{ color: "var(--muted)", marginTop: "4px" }}>{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Company Timeline ──────────────────────────────────────── */}
      <section>
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Our Journey</span>
            <h2>Company Timeline</h2>
          </Reveal>
          <Reveal>
            <div className="timeline-list">
              {TIMELINE.map((t) => (
                <div className="timeline-item" key={t.year + t.h}>
                  <span className="timeline-year">{t.year}</span>
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h4>{t.h}</h4>
                    <p style={{ color: "var(--muted)", marginTop: "8px" }}>{t.p}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Why Clients Trust Us ──────────────────────────────────── */}
      <section className="surface">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Client Feedback</span>
            <h2>Why Clients Trust Us</h2>
          </Reveal>
          <div className="testi-grid">
            {TESTIMONIALS.map((t) => {
              const initials = t.n.split(" ").map((x) => x[0]).join("");
              return (
                <Reveal key={t.n}>
                  <div className="testi-card">
                    <p className="quote">"{t.q}"</p>
                    <div className="testi-person">
                      <div className="avatar">{initials}</div>
                      <div><b>{t.n}</b><span>{t.role}</span></div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Technology Expertise ──────────────────────────────────── */}
      <section>
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Under The Hood</span>
            <h2>Technology Expertise</h2>
          </Reveal>
          <Reveal>
            <div className="stack-row">
              {STACK.map((s) => <span className="stack-chip" key={s}>{s}</span>)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Certifications ────────────────────────────────────────── */}
      <section className="surface">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Recognised By</span>
            <h2>Certifications &amp; Partnerships</h2>
          </Reveal>
          <Reveal>
            <div className="cert-grid">
              {CERTS.map((c) => <span className="cert-chip" key={c}>{c}</span>)}
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
                <h2>Ready to build something great?</h2>
                <p>Tell us about your project — we'll reply within one business day.</p>
              </div>
              <div className="cta-actions">
                <Link to="/contact" className="btn btn-primary">Start Your Project →</Link>
                <Link to="/services" className="btn btn-outline">View Services</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
