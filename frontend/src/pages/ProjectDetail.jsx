import React, { useRef, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

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

const FALLBACK = {
  "northline-crm": {
    name: "Northline CRM",
    client: "Northline Education",
    category: "Software",
    duration: "14 Weeks",
    team: "5 Engineers, 1 Designer",
    cover: "cover-1",
    industry: "Education",
    challenge: "The client was running three separate spreadsheets for leads, enrolments, and communications — data fell through the gaps constantly, and staff spent hours re-entering the same information across systems.",
    solution: "We designed and built a unified CRM from scratch, integrating lead capture, status workflows, automated email sequences, and a reporting dashboard. The entire system runs on a single database with role-based access for different staff groups.",
    stack: ["React", "FastAPI", "PostgreSQL", "Redis", "AWS EC2"],
    features: ["Lead capture from web form", "Automated email sequences", "Role-based access control", "Kanban pipeline view", "Reporting dashboard", "CSV export & bulk actions", "Audit log", "Mobile-responsive UI"],
    results: [
      { val: "60%", label: "Less admin time" },
      { val: "0",   label: "Data entry duplication" },
      { val: "4.9", label: "Client satisfaction (out of 5)" },
    ],
    overview: "Northline Education is a group of private tuition centres across South India managing 2,000+ student enrolments per year.",
  },
  "fernway-retail": {
    name: "Fernway Retail",
    client: "Fernway Group",
    category: "E-Commerce",
    duration: "10 Weeks",
    team: "4 Engineers, 1 Designer",
    cover: "cover-2",
    industry: "Retail",
    challenge: "An aging Shopify theme was slowing the site to 4-second load times on mobile, causing significant checkout abandonment — especially on the product detail and cart pages.",
    solution: "We rebuilt the storefront as a headless Next.js frontend connected to Shopify's Storefront API and Stripe for payments. The new architecture achieved sub-1s FCP on mobile and a streamlined 3-step checkout.",
    stack: ["Next.js", "Shopify Storefront API", "Stripe", "Vercel", "Contentful"],
    features: ["Headless Shopify integration", "Sub-1s mobile load time", "3-step checkout", "Product search with filters", "Wishlist & compare", "A/B tested CTA buttons", "Inventory sync", "SEO-optimised URLs"],
    results: [
      { val: "40%",  label: "Higher mobile conversion" },
      { val: "0.9s", label: "Average FCP on mobile" },
      { val: "22%",  label: "Lower cart abandonment" },
    ],
    overview: "Fernway Group operates a chain of home décor retail stores and was expanding its direct-to-consumer online presence.",
  },
};

const RELATED = [
  { key: "northline-crm", name: "Northline CRM",   cover: "cover-1", category: "Software" },
  { key: "fernway-retail", name: "Fernway Retail",  cover: "cover-2", category: "E-Commerce" },
  { key: "voltra-ev",     name: "Voltra EV",        cover: "cover-3", category: "Mobile App" },
];

export default function ProjectDetail() {
  const { key } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/projects/${key}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => {
        const fb = FALLBACK[key] || FALLBACK["northline-crm"];
        setProject({
          ...fb,
          name: data.title || fb.name,
          overview: data.desc || fb.overview,
        });
        setLoading(false);
      })
      .catch(() => {
        setProject(FALLBACK[key] || FALLBACK["northline-crm"]);
        setLoading(false);
      });
  }, [key]);

  if (loading) return (
    <div style={{ padding: "160px 0", textAlign: "center", color: "var(--muted)", fontFamily: "var(--mono)" }}>
      Loading case study...
    </div>
  );

  if (!project) return (
    <div style={{ padding: "160px 0", textAlign: "center" }}>
      <h2>Project not found</h2>
      <Link to="/projects" style={{ color: "var(--ink)", marginTop: "16px", display: "inline-block" }}>← Back to Projects</Link>
    </div>
  );

  const coverGradients = {
    "cover-1": "linear-gradient(135deg, #111 0%, #2b2b2b 100%)",
    "cover-2": "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    "cover-3": "linear-gradient(135deg, #0f3460 0%, #533483 100%)",
  };

  return (
    <>
      {/* ── Hero Banner ───────────────────────────────────────────── */}
      <section style={{ padding: "48px 0 0" }}>
        <div className="wrap">
          <div className="breadcrumb" style={{ marginBottom: "20px" }}>
            <Link to="/">Home</Link> / <Link to="/projects">Projects</Link> / <span>{project.name}</span>
          </div>
          <div
            className="case-hero"
            style={{ background: coverGradients[project.cover] || coverGradients["cover-1"] }}
          >
            <div className="case-hero-content">
              <span className="case-tag accent">{project.category}</span>
              <h1>{project.name}</h1>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px", marginTop: "12px", maxWidth: "560px" }}>
                {project.overview}
              </p>
              <div className="case-tags" style={{ marginTop: "20px" }}>
                <span className="case-tag">Client: {project.client}</span>
                <span className="case-tag">{project.duration}</span>
                <span className="case-tag">{project.industry}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Case Study Body ──────────────────────────────────── */}
      <section>
        <div className="wrap">
          <div className="case-body">
            {/* Left: Main content */}
            <div className="case-main">

              {/* Client Overview */}
              <Reveal className="case-section">
                <h2>Client Overview</h2>
                <p>{project.overview}</p>
              </Reveal>

              {/* Business Challenge */}
              <Reveal className="case-section">
                <h2>Business Challenge</h2>
                <p>{project.challenge}</p>
              </Reveal>

              {/* Our Solution */}
              <Reveal className="case-section">
                <h2>Our Solution</h2>
                <p>{project.solution}</p>
              </Reveal>

              {/* Technologies Used */}
              <Reveal className="case-section">
                <h2>Technologies Used</h2>
                <div className="stack-row" style={{ marginTop: "16px" }}>
                  {project.stack.map((s) => <span className="stack-chip" key={s}>{s}</span>)}
                </div>
              </Reveal>

              {/* Features Delivered */}
              <Reveal className="case-section">
                <h2>Features Delivered</h2>
                <div className="feature-list">
                  {project.features.map((f) => (
                    <div className="feature-item" key={f}>
                      <span className="feature-dot"></span>
                      {f}
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Results & Impact */}
              <Reveal className="case-section">
                <h2>Results &amp; Impact</h2>
                <div className="results-grid">
                  {project.results.map((r) => (
                    <div className="result-card" key={r.label}>
                      <b>{r.val}</b>
                      <span>{r.label}</span>
                    </div>
                  ))}
                </div>
              </Reveal>

            </div>

            {/* Right: Sidebar */}
            <div className="case-sidebar">
              <Reveal>
                <div className="sidebar-box">
                  <h4>Project Details</h4>
                  <div className="sidebar-row"><span>Client</span><span>{project.client}</span></div>
                  <div className="sidebar-row"><span>Industry</span><span>{project.industry}</span></div>
                  <div className="sidebar-row"><span>Category</span><span>{project.category}</span></div>
                  <div className="sidebar-row"><span>Duration</span><span>{project.duration}</span></div>
                  <div className="sidebar-row"><span>Team</span><span>{project.team}</span></div>
                </div>
              </Reveal>
              <Reveal>
                <div className="sidebar-box">
                  <h4>Tech Stack</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {project.stack.map((s) => (
                      <span key={s} style={{ fontFamily: "var(--mono)", fontSize: "12px", padding: "5px 10px", borderRadius: "6px", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
              <Reveal>
                <Link to="/contact" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", borderRadius: "10px" }}>
                  Start a Similar Project
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Projects ──────────────────────────────────────── */}
      <section className="surface">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">More Work</span>
            <h2>Related Projects</h2>
          </Reveal>
          <div className="related-grid">
            {RELATED.filter((r) => r.key !== key).slice(0, 3).map((r) => (
              <Reveal key={r.key}>
                <Link to={`/projects/${r.key}`} className="proj-card" style={{ textDecoration: "none", display: "block" }}>
                  <div className={`proj-cover ${r.cover}`}>
                    <span>{r.category}</span>
                  </div>
                  <div className="proj-body">
                    <h3>{r.name}</h3>
                    <span className="link">View case study →</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact CTA ───────────────────────────────────────────── */}
      <section>
        <div className="wrap">
          <Reveal>
            <div className="cta-banner">
              <div>
                <h2>Ready to build something like this?</h2>
                <p>Tell us about your project — we'll reply within one business day.</p>
              </div>
              <div className="cta-actions">
                <Link to="/contact" className="btn btn-primary">Start Your Project</Link>
                <Link to="/projects" className="btn btn-outline" style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}>
                  All Projects
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
