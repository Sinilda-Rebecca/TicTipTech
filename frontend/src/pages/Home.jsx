import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// ─── Data ───────────────────────────────────────────────────────────────────

const SERVICES = [
  { t: "Custom Website Development", d: "Marketing sites and web platforms built for speed, SEO, and conversion.", i: "🌐" },
  { t: "Mobile App Development",     d: "Native and cross-platform apps for iOS and Android, built for real users.", i: "📱" },
  { t: "UI/UX Design",               d: "Interfaces designed around how people actually use your product.", i: "🎨" },
  { t: "AI Integration",             d: "Practical AI features — search, automation, copilots — added to existing products.", i: "✦" },
  { t: "Software Testing & QA",      d: "Manual and automated test coverage that catches issues before your users do.", i: "✓" },
  { t: "Cloud & DevOps",             d: "CI/CD pipelines and cloud infrastructure that scale without the 2am pages.", i: "☁" },
];

const PROJECTS = [
  { n: "Northline CRM",  c: "Web Application", cov: "cover-1", stack: ["React", "FastAPI", "PostgreSQL"], d: "An education-sector CRM that replaced three disconnected spreadsheets with one system." },
  { n: "Fernway Retail", c: "E-Commerce",      cov: "cover-2", stack: ["Next.js", "Stripe", "Shopify"],  d: "A headless storefront rebuild that cut checkout time and lifted mobile conversion." },
  { n: "Voltra EV",      c: "Mobile App",      cov: "cover-3", stack: ["React Native", "Node.js", "AWS"], d: "A driver-facing EV fleet app for charging, diagnostics, and trip logs." },
];

const STACK = ["React", "Next.js", "Node.js", "Python", "FastAPI", "PostgreSQL", "AWS", "Docker", "Playwright", "Figma"];

const TESTIMONIALS = [
  { q: "TicTip shipped our MVP in eight weeks and it hasn't needed a rewrite since. The test coverage they left us with is better than what most agencies deliver at handoff.", n: "R. Menon",     role: "Founder, SaaS Startup" },
  { q: "What stood out was how few bugs made it to production. Their QA process caught things our internal team would have missed.",                                            n: "A. Fernandes", role: "Product Lead, E-commerce" },
  { q: "Clear timelines, no scope creep, and they were honest when something would take longer. Exactly what we needed for a fixed-budget project.",                           n: "S. Iyer",      role: "Operations Director" },
];

const PIPELINE_STEPS = ["Design", "Build", "Test & QA", "Ship"];

const STATS = [
  { count: 120, label: "Products shipped" },
  { count: 98,  label: "% on-time delivery" },
  { count: 40,  label: "Engineers & QA" },
];

// ─── Hooks ──────────────────────────────────────────────────────────────────

/** Fires callback once when element enters viewport */
function useOnScreen(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return visible;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

/** Animated counter */
function Counter({ target, visible }) {
  const [val, setVal] = useState(0);
  const ran = useRef(false);

  useEffect(() => {
    if (!visible || ran.current) return;
    ran.current = true;
    let cur = 0;
    const step = Math.max(1, Math.round(target / 40));
    const tick = () => {
      cur += step;
      if (cur >= target) { setVal(target); return; }
      setVal(cur);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, target]);

  return <b>{val}</b>;
}

/** Reveal wrapper */
function Reveal({ children, style, className = "" }) {
  const ref = useRef(null);
  const visible = useOnScreen(ref);
  return (
    <div ref={ref} className={`reveal ${visible ? "in" : ""} ${className}`} style={style}>
      {children}
    </div>
  );
}

/** Pipeline panel with looping animation */
function PipelinePanel() {
  const [activeIdx, setActiveIdx] = useState(-1);
  const [statuses, setStatuses] = useState(PIPELINE_STEPS.map(() => "queued"));
  const ref = useRef(null);
  const visible = useOnScreen(ref, 0.1);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!visible || startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;

    function runPipeline() {
      if (cancelled) return;
      setActiveIdx(-1);
      setStatuses(PIPELINE_STEPS.map(() => "queued"));

      let i = 0;
      const interval = setInterval(() => {
        if (cancelled) { clearInterval(interval); return; }
        setStatuses((prev) => {
          const next = [...prev];
          if (i > 0) next[i - 1] = "passed";
          return next;
        });
        if (i >= PIPELINE_STEPS.length) {
          clearInterval(interval);
          setTimeout(runPipeline, 1800);
          return;
        }
        setActiveIdx(i);
        setStatuses((prev) => {
          const next = [...prev];
          next[i] = "running";
          return next;
        });
        i++;
      }, 750);
    }

    runPipeline();
    return () => { cancelled = true; };
  }, [visible]);

  return (
    <div ref={ref} className="panel reveal in">
      <div className="panel-head">
        <span className="title">tictip / release-pipeline</span>
        <div className="dots">
          <span></span><span></span><span></span>
        </div>
      </div>

      <div className="pipeline">
        {PIPELINE_STEPS.map((step, idx) => (
          <div
            key={step}
            className={`pipe-step${activeIdx === idx ? " active" : ""}`}
          >
            <div className="idx">{idx + 1}</div>
            <span>{step}</span>
            <div className="pipe-line"></div>
            <span className="status">{statuses[idx]}</span>
          </div>
        ))}
      </div>

      <div className="panel-term">
        <span>$ deploy --env production</span>
        <span className="term-cursor"></span>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Home() {
  // Stats counter fires when hero stats come into view
  const statsRef = useRef(null);
  const statsVisible = useOnScreen(statsRef, 0.5);

  return (
    <main>

      {/* ── 1. HERO ───────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="wrap hero-grid">
          {/* Left column */}
          <div>
            <span className="eyebrow">Software Engineering Studio</span>
            <h1>Building modern digital solutions for tomorrow.</h1>
            <p className="lead">
              TicTip Technology designs, builds, and tests digital products for startups, SMEs, and
              enterprises — engineered to launch clean and hold up under real use.
            </p>
            <div className="hero-actions">
              <Link to="/contact" className="btn btn-primary">Start Your Project</Link>
              <Link to="/projects" className="btn btn-outline">View Our Work</Link>
            </div>

            {/* Stats */}
            <div className="hero-stats" ref={statsRef}>
              {STATS.map((s) => (
                <div className="stat" key={s.label}>
                  <Counter target={s.count} visible={statsVisible} />
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — animated pipeline */}
          <PipelinePanel />
        </div>
      </section>

      {/* ── 2. WHO WE ARE ─────────────────────────────────────────────── */}
      <section id="about">
        <div className="wrap intro-grid">
          <Reveal>
            <span className="eyebrow">Who We Are</span>
            <p style={{ marginTop: "16px" }}>
              TicTip Technology is a software development studio that builds digital products companies
              can actually depend on — from first prototype to production traffic.
            </p>
          </Reveal>

          <Reveal>
            <ul className="intro-list">
              {[
                { b: "Full-stack delivery.", t: "Design, engineering, and QA under one roof, so nothing gets lost in handoffs." },
                { b: "Testing built in, not bolted on.", t: "Every build ships with automated coverage, not a final-week scramble." },
                { b: "Built to scale.", t: "Cloud-native architecture and CI/CD from day one, not retrofitted later." },
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

      {/* ── 3. SERVICES ───────────────────────────────────────────────── */}
      <section id="services" className="surface">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">What We Do</span>
            <h2>Services built around how software actually gets shipped.</h2>
            <p>Pick one service or the whole pipeline — we plug in wherever your team needs us.</p>
          </Reveal>

          <div className="service-grid">
            {SERVICES.map((s) => (
              <Reveal key={s.t}>
                <div className="service-card">
                  <div className="service-icon">{s.i}</div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
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

      {/* ── 4. WHY TICTIP ─────────────────────────────────────────────── */}
      <section>
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Why TicTip</span>
            <h2>What makes projects with us different.</h2>
          </Reveal>

          <Reveal>
            <div className="why-grid">
              {[
                { num: "01", h: "Senior engineers only",        p: "No juniors learning on your codebase — every project is led by people who've shipped before." },
                { num: "02", h: "QA from sprint one",           p: "Automated tests are written alongside features, not after launch when bugs are expensive." },
                { num: "03", h: "Fixed, transparent pricing",   p: "You get a scoped estimate up front — no surprise change orders mid-project." },
                { num: "04", h: "You own everything",           p: "Code, designs, and infrastructure access are yours from day one, no lock-in." },
              ].map(({ num, h, p }) => (
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

      {/* ── 5. PROCESS ────────────────────────────────────────────────── */}
      <section id="process" className="surface">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">How We Work</span>
            <h2>A four-stage process, run the same way every time.</h2>
          </Reveal>

          <Reveal>
            <div className="process-list">
              {[
                { n: "1", h: "Discover",          p: "We map your goals, users, and constraints before a single screen gets designed." },
                { n: "2", h: "Design",            p: "Wireframes to high-fidelity UI, reviewed with you at every stage — no big reveals." },
                { n: "3", h: "Build & Test",      p: "Engineering and QA work in parallel, with automated tests written against each feature." },
                { n: "4", h: "Launch & Support",  p: "We deploy, monitor, and stay on for the weeks after launch that matter most." },
              ].map(({ n, h, p }) => (
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

      {/* ── 6. PROJECTS ───────────────────────────────────────────────── */}
      <section id="projects">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Selected Work</span>
            <h2>A few things we've shipped recently.</h2>
          </Reveal>

          <div className="proj-grid">
            {PROJECTS.map((p) => (
              <Reveal key={p.n}>
                <div className="proj-card">
                  <div className={`proj-cover ${p.cov}`}>
                    <span>{p.c}</span>
                  </div>
                  <div className="proj-body">
                    <h3>{p.n}</h3>
                    <p>{p.d}</p>
                    <div className="stack-tags">
                      {p.stack.map((s) => <span key={s}>{s}</span>)}
                    </div>
                    <Link to="/projects" className="link">View case study →</Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. TECH STACK ─────────────────────────────────────────────── */}
      <section className="surface">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Under The Hood</span>
            <h2>Technology we build with.</h2>
          </Reveal>

          <Reveal>
            <div className="stack-row">
              {STACK.map((s) => (
                <span className="stack-chip" key={s}>{s}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 8. TESTIMONIALS ───────────────────────────────────────────── */}
      <section>
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Client Feedback</span>
            <h2>What it's like working with us.</h2>
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
                      <div>
                        <b>{t.n}</b>
                        <span>{t.role}</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 9. CTA BANNER ─────────────────────────────────────────────── */}
      <section id="contact">
        <div className="wrap">
          <Reveal>
            <div className="cta-banner">
              <div>
                <h2>Have a project in mind?</h2>
                <p>Tell us what you're building — we'll reply within one business day with next steps.</p>
              </div>
              <div className="cta-actions">
                <Link to="/contact" className="btn btn-primary">Start Your Project</Link>
                <Link
                  to="/contact"
                  className="btn btn-outline"
                  style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}
                >
                  Book a Call
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </main>
  );
}
