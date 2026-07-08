import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";

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

const CATEGORIES = ["All", "Website", "Mobile App", "Software", "AI", "UI/UX", "E-Commerce"];

const MOCK_PROJECTS = [
  {
    key: "northline-crm",
    name: "Northline CRM",
    category: "Software",
    cover: "cover-1",
    stack: ["React", "FastAPI", "PostgreSQL"],
    desc: "An education-sector CRM that replaced three spreadsheets with a single system teams actually use.",
  },
  {
    key: "fernway-retail",
    name: "Fernway Retail",
    category: "E-Commerce",
    cover: "cover-2",
    stack: ["Next.js", "Stripe", "Shopify"],
    desc: "A headless storefront rebuild that cut checkout time and lifted mobile conversion by 40%.",
  },
  {
    key: "voltra-ev",
    name: "Voltra EV",
    category: "Mobile App",
    cover: "cover-3",
    stack: ["React Native", "Node.js", "AWS"],
    desc: "A driver-facing EV fleet app covering charging, diagnostics, and trip logs for 12,000+ daily users.",
  },
  {
    key: "meridian-ai",
    name: "Meridian AI Platform",
    category: "AI",
    cover: "cover-1",
    stack: ["Python", "FastAPI", "OpenAI"],
    desc: "An internal AI research tool that routes complex queries through vector search and LLM pipelines.",
  },
  {
    key: "atelier-brand",
    name: "Atelier Noir",
    category: "UI/UX",
    cover: "cover-2",
    stack: ["Figma", "React", "GSAP"],
    desc: "Editorial fashion brand website with immersive motion design and full e-commerce integration.",
  },
  {
    key: "vessel-web",
    name: "Vessel Museum",
    category: "Website",
    cover: "cover-3",
    stack: ["Next.js", "Contentful", "Vercel"],
    desc: "A modern museum web presence featuring an interactive exhibit explorer and ticket booking system.",
  },
];

const TYPEWRITER_PHRASES = [
  "shipped recently.",
  "built for scale.",
  "designed to convert.",
  "delivered on time.",
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

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [loading, setLoading] = useState(true);

  // Floating hover preview coordinates
  const [hoveredProject, setHoveredProject] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const typewriterText = useTypewriter(TYPEWRITER_PHRASES);

  useEffect(() => {
    fetch(`${API_URL}/api/projects`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => {
        const mapped = data.map((item, idx) => {
          const mock = MOCK_PROJECTS[idx % MOCK_PROJECTS.length];
          return {
            key: item.key || mock.key,
            name: item.title || mock.name,
            category: item.category || mock.category,
            cover: mock.cover,
            stack: mock.stack,
            desc: item.desc || mock.desc,
          };
        });
        setProjects(mapped.length > 0 ? mapped : MOCK_PROJECTS);
        setLoading(false);
      })
      .catch(() => { setProjects(MOCK_PROJECTS); setLoading(false); });
  }, []);

  const filtered = filter === "All"
    ? projects
    : projects.filter((p) => p.category.toLowerCase() === filter.toLowerCase());

  return (
    <div onMouseMove={handleMouseMove}>
      {/* ── Page Hero ─────────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="wrap">
          <div className="breadcrumb">
            <Link to="/">Home</Link> / <span>Projects</span>
          </div>
          <div className="page-hero-inner">
            <div>
              <span className="eyebrow">Selected Work</span>
              <h1 style={{ minHeight: "2.2em" }}>
                A few things we've<br />
                <span className="typewriter-phrase">
                  {typewriterText}
                  <span className="typewriter-cursor" />
                </span>
              </h1>
              <p className="lead">
                A curated portfolio of client work across web, mobile, AI, and e-commerce.
                Each project is a close collaboration — not a handoff.
              </p>
            </div>
            <div className="stat-meta-box">
              <div className="stat-meta-row">
                <span className="stat-meta-label">Projects</span>
                <span className="stat-meta-value">120+</span>
              </div>
              <div className="stat-meta-row">
                <span className="stat-meta-label">Industries</span>
                <span className="stat-meta-value">15+</span>
              </div>
              <div className="stat-meta-row">
                <span className="stat-meta-label">Countries</span>
                <span className="stat-meta-value">08</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Portfolio Rows (Ignite Agency style) ─────────────────── */}
      <section>
        <div className="wrap">
          {/* Filter Bar */}
          <div className="filter-bar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-btn${filter === cat ? " active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: "60px 0", textAlign: "center", color: "var(--muted)", fontFamily: "var(--mono)" }}>
              Loading projects...
            </div>
          ) : (
            <div className="project-rows">
              {filtered.map((p, idx) => (
                <Link
                  to={`/projects/${p.key}`}
                  key={p.key}
                  className="project-row-item"
                  onMouseEnter={() => setHoveredProject(p.key)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="project-row-left">
                    <span className="project-row-num">{String(idx + 1).padStart(2, "0")}</span>
                    <span className="project-row-name">{p.name}</span>
                  </div>
                  <span className="project-row-category">{p.category}</span>

                  {/* Floating interactive image popup */}
                  {hoveredProject === p.key && (
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
                      <div className={`proj-cover ${p.cover}`} style={{ position: "absolute", inset: 0 }} />
                      <span style={{ position: "relative", zIndex: 1, fontFamily: "var(--mono)", fontSize: "11px", background: "rgba(0,0,0,0.8)", padding: "4px 8px", borderRadius: "4px", color: "var(--accent)" }}>{p.stack.join(" · ")}</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ padding: "60px 0", textAlign: "center", color: "var(--muted)" }}>
              No projects in this category yet.
            </div>
          )}
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
                <Link to="/contact" className="btn btn-primary">Start Your Project →</Link>
                <Link to="/services" className="btn btn-outline">Our Services</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
