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
  { key: "northline-crm", n: "Northline CRM",  c: "Web Application", cov: "cover-1", stack: ["React", "FastAPI", "PostgreSQL"], d: "An education-sector CRM that replaced spreadsheets." },
  { key: "fernway-retail", n: "Fernway Retail", c: "E-Commerce",      cov: "cover-2", stack: ["Next.js", "Stripe", "Shopify"],  d: "A headless storefront rebuild that cut checkout time." },
  { key: "voltra-ev", n: "Voltra EV",      c: "Mobile App",      cov: "cover-3", stack: ["React Native", "Node.js", "AWS"], d: "A driver-facing EV fleet app for diagnostics." },
];

// Duplicated for seamless infinite marquee loop
const STACK = ["React", "Next.js", "Node.js", "Python", "FastAPI", "PostgreSQL", "AWS", "Docker", "Playwright", "Figma"];
const STACK_DOUBLE = [...STACK, ...STACK];

const TESTIMONIALS = [
  { q: "TicTip shipped our MVP in eight weeks and it hasn't needed a rewrite since. The test coverage they left us with is better than what most agencies deliver at handoff.", n: "R. Menon",     role: "Founder, SaaS Startup" },
  { q: "What stood out was how few bugs made it to production. Their QA process caught things our internal team would have missed.",                                            n: "A. Fernandes", role: "Product Lead, E-commerce" },
  { q: "Clear timelines, no scope creep, and they were honest when something would take longer. Exactly what we needed for a fixed-budget project.",                           n: "S. Iyer",      role: "Operations Director" },
];

const PIPELINE_STEPS = ["Design", "Build", "Test & QA", "Ship"];

const STATS = [
  { count: 120, label: "Products shipped", suffix: "+" },
  { count: 98,  label: "% on-time delivery", suffix: "%" },
  { count: 40,  label: "Engineers & QA", suffix: "+" },
];

// Typewriter phrases cycling in hero
const TYPEWRITER_PHRASES = [
  "modern digital products.",
  "clean, scalable software.",
  "apps that hold up under load.",
  "tomorrow's digital solutions.",
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

/** Odometer / slot-machine style counter */
function Counter({ target, suffix = "", visible }) {
  const [digits, setDigits] = useState(
    String(target).split("").map(() => 0)
  );
  const ran = useRef(false);

  useEffect(() => {
    if (!visible || ran.current) return;
    ran.current = true;
    const targetStr = String(target);
    const totalFrames = 40;
    let frame = 0;
    const tick = () => {
      frame++;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(eased * target);
      setDigits(String(current).padStart(targetStr.length, "0").split("").map(Number));
      if (frame < totalFrames) requestAnimationFrame(tick);
      else setDigits(targetStr.split("").map(Number));
    };
    requestAnimationFrame(tick);
  }, [visible, target]);

  return (
    <b className="odometer">
      <span className="odometer-digits">
        {digits.map((d, i) => (
          <span key={i} className="odometer-digit">{d}</span>
        ))}
      </span>
      {suffix}
    </b>
  );
}

/** Typewriter hook — cycles through phrases */
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

/** Reveal wrapper — supports stagger delay */
function Reveal({ children, style, className = "", delay = 0 }) {
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

/** Infinite horizontal marquee for tech stack */
function Marquee({ items }) {
  return (
    <div className="marquee-wrap" aria-hidden="true">
      <div className="marquee-track">
        {items.map((s, i) => (
          <span className="stack-chip" key={i}>{s}</span>
        ))}
      </div>
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

// ─── Client Logo Marquee ───────────────────────────────────────────────────

function ClientMarquee() {
  const logos = [
    { name: "Stripe", svg: <svg viewBox="0 0 60 25" width="60" height="25" fill="currentColor"><path d="M54.02 11.23c0-3.83-2.14-5.69-5.18-5.69-3.23 0-5.46 2.14-5.46 5.67 0 4.29 2.7 5.56 5.69 5.56 1.48 0 2.82-.36 3.73-.89v-2.31c-.89.47-1.99.73-3.19.73-1.63 0-3.32-.42-3.41-2.47h10.45c.03-.68.37-2.73-.37-6.07v.27zm-7.63 1.94c.16-1.57 1.25-2.22 2.37-2.22.99 0 1.96.53 2.05 2.22h-4.42zm-5.01-7.63c-1.12 0-2.05.51-2.5 1.09V.33h-2.92v21.73l2.92-.61v-5.26c.45.52 1.38 1.02 2.5 1.02 2.85 0 4.96-2.18 4.96-5.63s-2.11-5.63-4.96-5.63zm-1.04 8.78c-1.39 0-2.35-.99-2.35-3.17s.96-3.17 2.35-3.17c1.41 0 2.37.99 2.37 3.17s-.96 3.17-2.37 3.17zm-11.45-8.49c-1.63 0-2.83 1.15-2.83 2.74v.05c0 1.83.91 2.36 2.92 3.09 2.52.91 3.51 1.7 3.51 3.42v.05c0 1.99-1.63 3.08-3.78 3.08-1.74 0-3.37-.59-4.52-1.37v-2.72c1.23.86 2.76 1.37 4.26 1.37 1.13 0 2.02-.5 2.02-1.39v-.05c0-1.61-.71-2.21-3.05-3.03-2.17-.76-3.38-1.73-3.38-3.48v-.05c0-1.92 1.58-3.08 3.65-3.08 1.56 0 3.01.5 4 .97v2.66c-.95-.57-2.26-1.04-3.41-1.04v.02zm-8.3 0c-1.63 0-2.83 1.15-2.83 2.74v.05c0 1.83.91 2.36 2.92 3.09 2.52.91 3.51 1.7 3.51 3.42v.05c0 1.99-1.63 3.08-3.78 3.08-1.74 0-3.37-.59-4.52-1.37v-2.72c1.23.86 2.76 1.37 4.26 1.37 1.13 0 2.02-.5 2.02-1.39v-.05c0-1.61-.71-2.21-3.05-3.03-2.17-.76-3.38-1.73-3.38-3.48v-.05c0-1.92 1.58-3.08 3.65-3.08 1.56 0 3.01.5 4 .97v2.66c-.95-.57-2.26-1.04-3.41-1.04v.02zM12.98 1.56c0-.98.79-1.56 1.77-1.56s1.77.58 1.77 1.56c0 .99-.79 1.56-1.77 1.56s-1.77-.57-1.77-1.56zm1.77 4.2c1.13 0 2.03.49 2.52 1.02V5.76h2.92v21.13h-2.92v-5.26c-.49.53-1.39 1.02-2.52 1.02-2.83 0-4.94-2.18-4.94-5.63s2.11-5.63 4.94-5.63zm.59 8.78c1.39 0 2.35-.99 2.35-3.17s-.96-3.17-2.35-3.17c-1.41 0-2.37 0.99-2.37 3.17s.96 3.17 2.37 3.17zM5.53 4.31v4.86H1.54V5.76h3.99zM1.54 11.23h3.99V26.9H1.54V11.23z"/></svg> },
    { name: "Shopify", svg: <svg viewBox="0 0 60 25" width="60" height="25" fill="currentColor"><path d="M19.74 3.73l-1.37.28.32 1.62-.2 1.01-1.89-2.57-2.61.53c.12.59.39 2.02.39 2.02l-1.12.23s-.73-3.69-.74-3.72l-.76.15-.31-1.6 1.35-.28L11.75.14c-.16-.06-.32-.08-.47-.02l-7.79 3c-.2.08-.34.25-.37.47L.03 24.23c-.04.22.04.45.21.6.14.12.32.18.51.18.06 0 .11 0 .17-.02l22.04-4.52c.22-.04.39-.21.43-.43l1.83-14.73-5.46-1.58zm-7.6 17.51L1.92 23.36 4.7 3.52l5.42-2.09-.72 20.35v-.54zm12.35-3.9l-10.74 2.2V3.46l4.28-1.65.68 4.79c.14.99.8 1.25 1.5 1.39l5.63 1.15-1.35 10.87z"/></svg> },
    { name: "OpenAI", svg: <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M21.73,11.45a3.31,3.31,0,0,0-.48-2.63,3.35,3.35,0,0,0-.4-2.83,3.38,3.38,0,0,0-2.31-1.58,3.33,3.33,0,0,0-2.85.4A3.33,3.33,0,0,0,13.12,3.3,3.39,3.39,0,0,0,10.27,3a3.34,3.34,0,0,0-2.47,1.83A3.34,3.34,0,0,0,5,5.32a3.39,3.39,0,0,0-.37,2.83A3.35,3.35,0,0,0,3,10.62a3.36,3.36,0,0,0,.4,2.83,3.37,3.37,0,0,0,2.31,1.58,3.33,3.33,0,0,0,2.85-.4,3.33,3.33,0,0,0,2.57,1.51,3.39,3.39,0,0,0,2.85.3,3.34,3.34,0,0,0,2.47-1.83,3.34,3.34,0,0,0,2.83-.5,3.39,3.39,0,0,0,.37-2.83A3.35,3.35,0,0,0,21.73,11.45ZM12,14.61a1.27,1.27,0,0,1-.83-.35L7,11.16a1.36,1.36,0,0,1-.41-1,1.38,1.38,0,0,1,1.38-1.38H16a1.38,1.38,0,0,1,1.38,1.38A1.36,1.36,0,0,1,17,11.16l-4.16,3.1a1.27,1.27,0,0,1-.83.35Z"/></svg> },
    { name: "Google", svg: <svg viewBox="0 0 60 25" width="60" height="25" fill="currentColor"><path d="M8.2 12.3c0-3.2 2.5-5.6 5.6-5.6s5.6 2.4 5.6 5.6-2.5 5.6-5.6 5.6-5.6-2.4-5.6-5.6zm13.8 0c0-5-3.8-8.5-8.2-8.5s-8.2 3.5-8.2 8.5 3.8 8.5 8.2 8.5 8.2-3.5 8.2-8.5zm11.1 0c0-3.2 2.5-5.6 5.6-5.6s5.6 2.4 5.6 5.6-2.5 5.6-5.6 5.6-5.6-2.4-5.6-5.6zm13.8 0c0-5-3.8-8.5-8.2-8.5s-8.2 3.5-8.2 8.5 3.8 8.5 8.2 8.5 8.2-3.5 8.2-8.5zm12.3-5.2h-7.8v2.2h5.6c-.6 2.9-2.9 4.3-5.6 4.3-3.7 0-6.1-2.9-6.1-6.7s2.4-6.7 6.1-6.7c2.6 0 4.2 1.3 5 2.1l1.6-1.6C54 1.1 51.5 0 47.9 0 41.5 0 37 4.9 37 11.2S41.5 22.4 47.9 22.4c4 0 7.8-2.6 7.8-8.5 0-.7-.1-1.3-.2-1.8z"/></svg> },
    { name: "AWS", svg: <svg viewBox="0 0 40 25" width="40" height="25" fill="currentColor"><path d="M37.3 18.6c-1.1-.9-2.9-1.5-5.2-1.7-2.3-.2-4.1-.1-4.8.1-1 .2-1.3.8-.8 1.5.5.7 1.6 1 3.5.7.8-.1 1.7-.1 2.5 0 .8.1 1.2.4 1.2.9v1.1c-.8.5-1.9.9-3.2 1-1.3.1-2.5 0-3.5-.2-1-.2-1.7-.6-2.1-1.2-.4-.6-.5-1.3-.2-2 .3-.7 1.1-1.3 2.3-1.6 1.2-.3 2.7-.4 4.5-.3 1.8.1 3.3.3 4.4.7v-2c0-1-.3-1.7-.9-2.1-.6-.4-1.6-.6-3.1-.6-1.5 0-2.8.2-3.8.7-1 .5-1.7.9-2 1.1-.4.3-.8.2-1.1-.2l-1.3-1.8c-.3-.4-.2-.8.2-1.1 1-.8 2.3-1.4 4-1.8 1.7-.4 3.7-.6 5.8-.5 2.5.1 4.5.6 5.9 1.6 1.4 1 2.1 2.5 2.1 4.7v7.5c0 .6.3 1 .9 1.2.6.2 1.1.2 1.5.1.4-.1.7.2.7.6v2c0 .4-.3.7-.8.7-.9.1-1.9 0-2.8-.2-1-.2-1.6-.7-2-1.3-.4-.6-.4-1.1-.2-1.7z"/></svg> },
    { name: "Slack", svg: <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M5.04,15.12a2.52,2.52,0,1,1-2.52-2.52H5.04Zm1.26,0a2.52,2.52,0,0,1,5.04,0v5.04a2.52,2.52,0,0,1-5.04,0ZM8.88,5.04A2.52,2.52,0,1,1,11.4,2.52V5.04Zm0,1.26a2.52,2.52,0,0,1,0,5.04H3.84a2.52,2.52,0,0,1,0-5.04ZM18.96,8.88a2.52,2.52,0,1,1,2.52,2.52H18.96Zm-1.26,0a2.52,2.52,0,0,1-5.04,0V3.84a2.52,2.52,0,0,1,5.04,0ZM15.12,18.96A2.52,2.52,0,1,1,12.6,21.48V18.96Zm0-1.26a2.52,2.52,0,0,1,0-5.04h5.04a2.52,2.52,0,0,1,0,5.04Z"/></svg> },
    { name: "GitHub", svg: <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> },
    { name: "Figma", svg: <svg viewBox="0 0 16 24" width="16" height="24" fill="currentColor"><path d="M8 0a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4zm-4 8a4 4 0 0 0-4 4 4 4 0 0 0 4 4h4v-8H4zm8 4a4 4 0 0 0-4-4v8a4 4 0 0 0 4-4zm-4 4a4 4 0 0 0-4 4 4 4 0 0 0 4 4h4v-8H8zm4 0v8a4 4 0 0 0 0-8h-4v8z"/></svg> }
  ];

  // Repeat for continuous scroll
  const doubleLogos = [...logos, ...logos, ...logos];

  return (
    <div className="client-marquee-container">
      <div className="client-marquee-wrap" aria-hidden="true">
        <div className="client-marquee-track">
          {doubleLogos.map((logo, idx) => (
            <div className="client-logo-item" key={idx} title={logo.name}>
              {logo.svg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Home() {
  const statsRef = useRef(null);
  const statsVisible = useOnScreen(statsRef, 0.5);
  const typewriterText = useTypewriter(TYPEWRITER_PHRASES);

  // Accordion active index
  const [activeService, setActiveService] = useState(0);

  // Floating hover preview coordinates
  const [hoveredProject, setHoveredProject] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <main>

      {/* ── 1. HERO ───────────────────────────────────────────────── */}
      <section className="hero hero-animated-bg">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />

        <div className="wrap hero-grid" style={{ position: "relative", zIndex: 1 }}>
          <div>
            <span className="eyebrow">Software Engineering Studio</span>
            <h1 className="hero-typewriter">
              Building{" "}
              <span className="typewriter-phrase">
                {typewriterText}
                <span className="typewriter-cursor" />
              </span>
            </h1>
            <p className="lead">
              TicTip Technology designs, builds, and tests digital products for startups, SMEs, and
              enterprises — engineered to launch clean and hold up under real use.
            </p>
            <div className="hero-actions">
              <Link to="/contact" className="btn btn-primary">Start Your Project →</Link>
              <Link to="/projects" className="btn btn-outline">View Our Work</Link>
            </div>

            <div className="hero-stats" ref={statsRef}>
              {STATS.map((s) => (
                <div className="stat" key={s.label}>
                  <Counter target={s.count} suffix={s.suffix} visible={statsVisible} />
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <PipelinePanel />
        </div>
      </section>

      {/* ── Client Logo Marquee ── */}
      <ClientMarquee />

      {/* ── 2. BOLD PROBLEM STATEMENT (Ignite Style) ──────────────── */}
      <section className="bold-statement-section">
        <div className="wrap">
          <Reveal>
            <p style={{
              fontSize: "36px",
              lineHeight: 1.4,
              fontWeight: 800,
              fontFamily: "var(--display)",
              color: "var(--ink)",
              maxWidth: "1000px",
              letterSpacing: "-0.03em"
            }}>
              Most digital solutions look like everyone else's, are <span style={{ color: "var(--accent)" }}>painful to maintain</span>, and fail under real traffic. We design and build high-performance products that are QA-first, cloud-native, and built to scale.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 3. INTRO (Who We Are) ─────────────────────────────────── */}
      <section id="about">
        <div className="wrap intro-grid">
          <Reveal>
            <span className="eyebrow">Who We Are</span>
            <p style={{ marginTop: "24px" }}>
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

      {/* ── 4. SERVICES ACCORDION (Ignite style vertical lists) ───── */}
      <section id="services" className="surface">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">What We Do</span>
            <h2>Services built around how software actually gets shipped.</h2>
            <p>Pick one service or the whole pipeline — we plug in wherever your team needs us.</p>
          </Reveal>

          <Reveal>
            <div className="service-accordion-list">
              {SERVICES.map((s, idx) => (
                <div
                  key={s.t}
                  className={`service-row ${activeService === idx ? "open" : ""}`}
                  onClick={() => setActiveService(idx)}
                >
                  <div className="service-row-header">
                    <div className="service-row-left">
                      <span className="service-row-num">0{idx + 1}</span>
                      <span className="service-row-title">{s.t}</span>
                    </div>
                    <span className="service-row-arrow">➔</span>
                  </div>
                  <div className="service-row-desc">
                    <p>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 5. WHY TICTIP ─────────────────────────────────────────────── */}
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

      {/* ── 6. PROCESS ────────────────────────────────────────────────── */}
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

      {/* ── 7. PROJECTS ROWS (Ignite Style Listing with Hover Preview) ── */}
      <section id="projects" onMouseMove={handleMouseMove}>
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Selected Work</span>
            <h2>A few things we've shipped recently.</h2>
          </Reveal>

          <Reveal>
            <div className="project-rows">
              {PROJECTS.map((p, idx) => (
                <Link
                  to={`/projects`}
                  key={p.n}
                  className="project-row-item"
                  onMouseEnter={() => setHoveredProject(p.n)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="project-row-left">
                    <span className="project-row-num">0{idx + 1}</span>
                    <span className="project-row-name">{p.n}</span>
                  </div>
                  <span className="project-row-category">{p.c}</span>

                  {/* Floating interactive image popup */}
                  {hoveredProject === p.n && (
                    <div
                      className="project-row-preview"
                      style={{
                        left: mousePos.x + 20,
                        top: mousePos.y + 20,
                        position: "fixed",
                        display: "flex",
                        alignItems: "flex-end",
                        padding: "16px"
                      }}
                    >
                      <div className={`proj-cover ${p.cov}`} style={{ position: "absolute", inset: 0 }} />
                      <span style={{ position: "relative", zIndex: 1, fontFamily: "var(--mono)", fontSize: "11px", background: "rgba(0,0,0,0.8)", padding: "4px 8px", borderRadius: "4px", color: "var(--accent)" }}>{p.stack.join(" · ")}</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 8. TECH STACK ─────────────────────────────────────────────── */}
      <section className="surface">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Under The Hood</span>
            <h2>Technology we build with.</h2>
          </Reveal>
        </div>
        <Marquee items={STACK_DOUBLE} />
      </section>

      {/* ── 9. TESTIMONIALS (Floating Overlay style) ────────────────── */}
      <section className="testimonials-section">
        <div className="testi-backdrop-text">FEEDBACK</div>
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

      {/* ── 10. CTA BANNER ────────────────────────────────────────────── */}
      <section id="contact">
        <div className="wrap">
          <Reveal>
            <div className="cta-banner">
              <div>
                <h2>Have a project in mind?</h2>
                <p>Tell us what you're building — we'll reply within one business day with next steps.</p>
              </div>
              <div className="cta-actions">
                <Link to="/contact" className="btn btn-primary">Start Your Project →</Link>
                <Link
                  to="/contact"
                  className="btn btn-outline"
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
