import React, { useState, useEffect, useRef } from "react";
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

const FAQS = [
  { q: "What types of projects do you take on?", a: "We work on web apps, mobile apps, AI integrations, e-commerce platforms, QA automation, and DevOps setups. Most engagements combine 2–3 of our service areas." },
  { q: "How quickly can you start?", a: "Typically within 1–2 weeks of signing. We keep a small intake pipeline so we can onboard new clients quickly without compromising quality." },
  { q: "Do you work with startups or only enterprises?", a: "Both. About half our clients are growth-stage startups; the rest are SMEs and enterprise divisions. We adjust our process to match the team size and pace." },
  { q: "How do you handle fixed-price vs. time & materials?", a: "We prefer scoped fixed-price for initial engagements — you get a clear budget and we get a clear outcome to aim for. For longer retainers, we switch to monthly billing." },
  { q: "Will we own the code at the end?", a: "Completely. Full IP transfer is part of every contract. Code, designs, and infrastructure access are yours from day one — no lock-in." },
];

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {question}
        <span className={`faq-icon${open ? " open" : ""}`}>+</span>
      </button>
      <div className={`faq-answer${open ? " open" : ""}`}>
        <p>{answer}</p>
      </div>
    </div>
  );
}

const TYPEWRITER_PHRASES = [
  "great together.",
  "scalable and clean.",
  "designed for users.",
  "delivered with QA.",
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

// Self-contained Canvas-based Confetti celebration
function Confetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    let animationId;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const colors = ["#C6FF00", "#FF007A", "#00F0FF", "#FFB800", "#7000FF"];
    const particles = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      r: Math.random() * 5 + 3,
      d: Math.random() * height,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 8 - 4,
      tiltAngleIncremental: Math.random() * 0.05 + 0.02,
      tiltAngle: 0
    }));

    let active = true;
    const stopTimer = setTimeout(() => { active = false; }, 5000);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      let alive = false;

      particles.forEach((p) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - p.r / 2) * 4;

        if (p.y < height) {
          alive = true;
        } else if (active) {
          p.x = Math.random() * width;
          p.y = -20;
          p.tilt = Math.random() * 8 - 4;
        }

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      if (alive || active) {
        animationId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(stopTimer);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 99999 }} />;
}

// Top 10 world cities for the rotating studio clock
const WORLD_CITIES = [
  { city: "Chennai",      timezone: "Asia/Kolkata",       tz: "IST (UTC+5:30)",  locale: "en-IN" },
  { city: "London",       timezone: "Europe/London",      tz: "BST / GMT",       locale: "en-GB" },
  { city: "New York",     timezone: "America/New_York",   tz: "EST / EDT",       locale: "en-US" },
  { city: "San Francisco",timezone: "America/Los_Angeles",tz: "PST / PDT",       locale: "en-US" },
  { city: "Dubai",        timezone: "Asia/Dubai",         tz: "GST (UTC+4)",     locale: "en-AE" },
  { city: "Singapore",    timezone: "Asia/Singapore",     tz: "SGT (UTC+8)",     locale: "en-SG" },
  { city: "Tokyo",        timezone: "Asia/Tokyo",         tz: "JST (UTC+9)",     locale: "ja-JP" },
  { city: "Sydney",       timezone: "Australia/Sydney",   tz: "AEST / AEDT",    locale: "en-AU" },
  { city: "Berlin",       timezone: "Europe/Berlin",      tz: "CET / CEST",     locale: "de-DE" },
  { city: "Toronto",      timezone: "America/Toronto",    tz: "EST / EDT",       locale: "en-CA" },
];

export const ESTIMATOR_SERVICES = [
  { label: "UI/UX Design", price: 1500, detail: "Prototypes, user flows & high fidelity UI" },
  { label: "Frontend Development", price: 2500, detail: "Speedy, modern React/Next.js pages" },
  { label: "Backend & API", price: 3000, detail: "Secure databases, APIs & server setup" },
  { label: "Mobile App", price: 4000, detail: "iOS/Android app built using React Native" },
  { label: "QA & Automation", price: 1200, detail: "Full unit, integration & E2E tests" },
];

export function calculateEstimate(services, pages, urgency) {
  const servicePricing = {
    "UI/UX Design": 1500,
    "Frontend Development": 2500,
    "Backend & API": 3000,
    "Mobile App": 4000,
    "QA & Automation": 1200,
  };
  
  let baseCost = services.reduce((sum, s) => sum + (servicePricing[s] || 0), 0);
  if (baseCost === 0) return { min: 0, max: 0, weeks: 0 };
  
  // Page/screen multiplier
  const pageMult = 1 + (pages - 1) * 0.08;
  
  // Urgency multiplier
  const urgencyMults = { relaxed: 0.9, standard: 1.0, fast: 1.3 };
  const mult = urgencyMults[urgency] || 1.0;
  
  const estimatedCost = baseCost * pageMult * mult;
  
  // Weeks calculation
  let baseWeeks = Math.max(3, Math.round(services.length * 1.5 + pages * 0.2));
  if (urgency === "relaxed") baseWeeks = Math.round(baseWeeks * 1.3);
  if (urgency === "fast") baseWeeks = Math.max(2, Math.round(baseWeeks * 0.7));

  return {
    min: Math.round(estimatedCost * 0.9),
    max: Math.round(estimatedCost * 1.1),
    weeks: baseWeeks
  };
}

export default function Contact() {
  const [activeTab, setActiveTab] = useState("message");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    service: "Website Development", budget: "< $5,000", message: "",
  });
  
  // Estimator Form state
  const [estServices, setEstServices] = useState(["Frontend Development"]);
  const [estPages, setEstPages] = useState(5);
  const [estUrgency, setEstUrgency] = useState("standard");

  const [validationErrors, setValidationErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const typewriterText = useTypewriter(TYPEWRITER_PHRASES);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Rotating city pair: always show Chennai + one rotating world city
  const [cityTimes, setCityTimes] = useState({ chennai: "", other: "" });
  const [cityIdx, setCityIdx] = useState(1); // start at London (index 1)
  const [clockFade, setClockFade] = useState(true);

  // Tick every second for live time
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const chennai = now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
      const other   = now.toLocaleTimeString(WORLD_CITIES[cityIdx].locale, { timeZone: WORLD_CITIES[cityIdx].timezone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
      setCityTimes({ chennai, other });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [cityIdx]);

  // Rotate city every 2 minutes (120 000 ms)
  useEffect(() => {
    const rotateId = setInterval(() => {
      setClockFade(false);
      setTimeout(() => {
        setCityIdx((i) => {
          let next = (i + 1) % WORLD_CITIES.length;
          if (next === 0) next = 1; // skip index 0 (Chennai is always left)
          return next;
        });
        setClockFade(true);
      }, 400);
    }, 120000);
    return () => clearInterval(rotateId);
  }, []);

  const handle = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) {
      errors.name = "Full name is required";
    }
    if (!form.email.trim()) {
      errors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (activeTab === "message") {
      if (!form.message.trim()) {
        errors.message = "Message is required";
      } else if (form.message.trim().length < 10) {
        errors.message = "Please tell us a bit more (minimum 10 characters)";
      }
    } else {
      if (estServices.length === 0) {
        errors.services = "Please select at least one service";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setStatus("loading");
    
    let projectType = form.service;
    let description = form.message;
    let budget = form.budget;

    if (activeTab === "estimator") {
      const estimation = calculateEstimate(estServices, estPages, estUrgency);
      projectType = `Estimator: ${estServices.join(", ")}`;
      budget = `$${estimation.min.toLocaleString()} – $${estimation.max.toLocaleString()}`;
      description = `PROJECT ESTIMATION BREAKDOWN:
- Services selected: ${estServices.join(", ")}
- Page / Screen count: ${estPages}
- Delivery Speed: ${estUrgency}
- Estimated Timeline: ${estimation.weeks} Weeks`;
    }

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      projectType,
      description,
      budget,
      reference: activeTab === "estimator" ? "Self-Calculated Estimate" : "Direct Message",
    };

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setShowSuccessModal(true);
      setForm({ name: "", email: "", phone: "", company: "", service: "Website Development", budget: "< $5,000", message: "" });
      setEstServices(["Frontend Development"]);
      setEstPages(5);
      setEstUrgency("standard");
    } catch (e) {
      // Fallback to Google Script
      const scriptURL = "https://script.google.com/macros/s/AKfycbzSLaEDMvloAykLcDvRuymlCGzZqRI4zPpXf-7BU_LJJRYKiXUHaN7lX44KvYSRalqP/exec";
      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) => fd.append(k, v));
      try {
        const r2 = await fetch(scriptURL, { method: "POST", body: fd });
        if (r2.ok) {
          setStatus("success");
          setShowSuccessModal(true);
          setForm({ name: "", email: "", phone: "", company: "", service: "Website Development", budget: "< $5,000", message: "" });
          setEstServices(["Frontend Development"]);
          setEstPages(5);
          setEstUrgency("standard");
        } else {
          setStatus("error");
        }
      } catch { setStatus("error"); }
    }
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <>
      {/* ── Page Hero ─────────────────────────────────────────────── */}
      <section className="page-hero">
        <div className="wrap">
          <div className="breadcrumb">
            <Link to="/">Home</Link> / <span>Contact</span>
          </div>
          <div className="page-hero-inner">
            <div>
              <span className="eyebrow">Get In Touch</span>
              <h1 style={{ minHeight: "2.2em" }}>
                Let's build something<br />
                <span className="typewriter-phrase">
                  {typewriterText}
                  <span className="typewriter-cursor" />
                </span>
              </h1>
              <p className="lead">
                Tell us about your project — the more specific, the better.
                We reply within one business day with honest next steps.
              </p>
            </div>
            <div className="stat-meta-box">
              <div className="stat-meta-row">
                <span className="stat-meta-label">Response</span>
                <span className="stat-meta-value">&lt; 24 hrs</span>
              </div>
              <div className="stat-meta-row">
                <span className="stat-meta-label">Location</span>
                <span className="stat-meta-value">Chennai</span>
              </div>
              <div className="stat-meta-row">
                <span className="stat-meta-label">Est.</span>
                <span className="stat-meta-value">2019</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Layout ────────────────────────────────────────── */}
      <section>
        <div className="wrap">
          <div className="contact-layout">

            {/* LEFT COLUMN: Form + What Happens Next */}
            <div className="contact-left-col">
              <Reveal>
                <div className="contact-form-card">
                  {/* Tab Selector */}
                  <div className="contact-tabs">
                    <button
                      type="button"
                      className={`tab-btn ${activeTab === "message" ? "active" : ""}`}
                      onClick={() => {
                        setActiveTab("message");
                        setValidationErrors({});
                      }}
                    >
                      ✉ Quick Message
                    </button>
                    <button
                      type="button"
                      className={`tab-btn ${activeTab === "estimator" ? "active" : ""}`}
                      onClick={() => {
                        setActiveTab("estimator");
                        setValidationErrors({});
                      }}
                    >
                      📊 Project Estimator
                    </button>
                  </div>

                  <form onSubmit={submit} noValidate>
                    {activeTab === "message" ? (
                      /* Tab 1: Direct Message */
                      <div className="tab-pane-content fade-in">
                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label" htmlFor="service">Service Needed</label>
                            <select id="service" name="service" value={form.service} onChange={handle} className="form-select">
                              {["Website Development","Mobile Apps","Web Applications","UI/UX Design","Software Development","AI Solutions","Cloud Solutions","QA & Testing","Automation","API Development","DevOps","E-Commerce"].map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group">
                            <label className="form-label" htmlFor="budget">Budget Range</label>
                            <select id="budget" name="budget" value={form.budget} onChange={handle} className="form-select">
                              {["< $5,000","$5,000–$15,000","$15,000–$50,000","$50,000–$100,000","$100,000+"].map((b) => (
                                <option key={b} value={b}>{b}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="message">Tell Us About Your Project *</label>
                          <textarea
                            id="message"
                            name="message"
                            value={form.message}
                            onChange={handle}
                            rows={4}
                            placeholder="Goals, current situation, timeline, any blockers..."
                            className={`form-textarea ${validationErrors.message ? "error" : ""}`}
                          />
                          {validationErrors.message && <span className="field-error">{validationErrors.message}</span>}
                        </div>
                      </div>
                    ) : (
                      /* Tab 2: Project Estimator */
                      <div className="tab-pane-content fade-in">
                        {/* Service Multi-Select */}
                        <div className="form-group">
                          <label className="form-label">Select Services (Check all that apply) *</label>
                          <div className="estimator-services-grid">
                            {ESTIMATOR_SERVICES.map((s) => {
                              const selected = estServices.includes(s.label);
                              return (
                                <button
                                  type="button"
                                  key={s.label}
                                  className={`estimator-service-pill ${selected ? "selected" : ""}`}
                                  onClick={() => {
                                    setEstServices((prev) =>
                                      prev.includes(s.label)
                                        ? prev.filter((item) => item !== s.label)
                                        : [...prev, s.label]
                                    );
                                    if (validationErrors.services) {
                                      setValidationErrors((prev) => {
                                        const next = { ...prev };
                                        delete next.services;
                                        return next;
                                      });
                                    }
                                  }}
                                >
                                  <span className="pill-check">{selected ? "✓" : "+"}</span>
                                  <div className="pill-info">
                                    <span className="pill-title">{s.label}</span>
                                    <span className="pill-desc">{s.detail}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                          {validationErrors.services && <span className="field-error">{validationErrors.services}</span>}
                        </div>

                        {/* Page Slider */}
                        <div className="form-group" style={{ marginTop: "20px" }}>
                          <div className="slider-header">
                            <label className="form-label">Scale (Screens / Pages): <strong>{estPages}</strong></label>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="30"
                            value={estPages}
                            onChange={(e) => setEstPages(parseInt(e.target.value))}
                            className="form-range-slider"
                          />
                          <div className="slider-labels">
                            <span>1 page (Single Landing)</span>
                            <span>15 pages (Medium App)</span>
                            <span>30+ pages (Enterprise)</span>
                          </div>
                        </div>

                        {/* Urgency Radio pills */}
                        <div className="form-group" style={{ marginTop: "24px" }}>
                          <label className="form-label">Delivery Urgency</label>
                          <div className="urgency-grid">
                            {[
                              { id: "relaxed", title: "Relaxed", sub: "Cheaper rate · 8+ weeks" },
                              { id: "standard", title: "Standard", sub: "Balanced · 4-8 weeks" },
                              { id: "fast", title: "Fast-Track", sub: "Priority speed · 2-4 weeks" },
                            ].map((u) => (
                              <label key={u.id} className={`urgency-pill ${estUrgency === u.id ? "selected" : ""}`}>
                                <input
                                  type="radio"
                                  name="urgency"
                                  value={u.id}
                                  checked={estUrgency === u.id}
                                  onChange={() => setEstUrgency(u.id)}
                                  style={{ display: "none" }}
                                />
                                <strong>{u.title}</strong>
                                <span>{u.sub}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Calculations Box */}
                        {estServices.length > 0 && (
                          <div className="estimator-results-box">
                            <div className="result-metric">
                              <span className="result-label">Estimated Investment</span>
                              <span className="result-value">
                                ${calculateEstimate(estServices, estPages, estUrgency).min.toLocaleString()} – ${calculateEstimate(estServices, estPages, estUrgency).max.toLocaleString()}
                              </span>
                            </div>
                            <div className="result-divider" />
                            <div className="result-metric">
                              <span className="result-label">Estimated Timeline</span>
                              <span className="result-value">
                                ~{calculateEstimate(estServices, estPages, estUrgency).weeks} Weeks
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Common Fields: Your Information */}
                    <div className="common-fields-section">
                      <h4 className="section-title">Your Details</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label" htmlFor="name">Full Name *</label>
                          <input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handle}
                            required
                            placeholder="Jane Doe"
                            className={`form-input ${validationErrors.name ? "error" : ""}`}
                          />
                          {validationErrors.name && <span className="field-error">{validationErrors.name}</span>}
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="email">Email *</label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handle}
                            required
                            placeholder="jane@company.com"
                            className={`form-input ${validationErrors.email ? "error" : ""}`}
                          />
                          {validationErrors.email && <span className="field-error">{validationErrors.email}</span>}
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label" htmlFor="phone">Phone</label>
                          <input
                            id="phone"
                            name="phone"
                            value={form.phone}
                            onChange={handle}
                            placeholder="+91 94477 17691"
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="company">Company</label>
                          <input
                            id="company"
                            name="company"
                            value={form.company}
                            onChange={handle}
                            placeholder="Acme Inc."
                            className="form-input"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={status === "loading"}
                      style={status === "success" ? { background: "#10b981", color: "#fff" } : status === "error" ? { background: "#ef4444", color: "#fff" } : {}}
                    >
                      {status === "loading" ? "Sending…" : status === "success" ? "✓ Request Received!" : status === "error" ? "Failed — try again" : activeTab === "estimator" ? "Send Estimate & Request Proposal →" : "Send Message →"}
                    </button>
                  </form>
                </div>
              </Reveal>

              {/* What Happens Next */}
              <Reveal>
                <div className="expect-panel">
                  <span className="eyebrow">What Happens Next</span>
                  <div className="expect-steps">
                    {[
                      { n: "01", h: "We review your message", t: "Within one business day, a senior engineer reads your brief and assesses fit." },
                      { n: "02", h: "Intro call (30 min)",    t: "We jump on a quick call to understand your goals, timeline, and constraints." },
                      { n: "03", h: "Scoped proposal",        t: "You receive a clear breakdown: deliverables, timeline, and fixed-price estimate." },
                      { n: "04", h: "Kickoff",               t: "Once aligned, we schedule a kickoff within 1–2 weeks and get to work." },
                    ].map(({ n, h, t }) => (
                      <div className="expect-step" key={n}>
                        <span className="expect-num">{n}</span>
                        <div>
                          <b>{h}</b>
                          <p>{t}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* RIGHT COLUMN: Info Column */}
            <div className="contact-info-col">
              {/* Contact Info */}
              <Reveal>
                <div className="info-card">
                  <h4>Contact Info</h4>
                  <div className="info-row">
                    <span className="info-icon">✉</span>
                    <div>
                      <b>Email</b>
                      <p><a href="mailto:admin@tictiptech.com">admin@tictiptech.com</a></p>
                    </div>
                  </div>
                  <div className="info-row">
                    <span className="info-icon">📞</span>
                    <div>
                      <b>Phone</b>
                      <p>+91 94477 17691</p>
                    </div>
                  </div>
                  <div className="info-row">
                    <span className="info-icon">📍</span>
                    <div>
                      <b>Office</b>
                      <p>Chennai, Tamil Nadu, India — 600001</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Business Hours */}
              <Reveal>
                <div className="info-card">
                  <h4>Business Hours</h4>
                  <div className="hours-list">
                    <div className="hours-row"><span>Monday – Friday</span><span>9:00 AM – 6:00 PM IST</span></div>
                    <div className="hours-row"><span>Saturday</span><span>10:00 AM – 2:00 PM IST</span></div>
                    <div className="hours-row"><span>Sunday</span><span>Closed</span></div>
                  </div>
                </div>
              </Reveal>

              {/* Social Links */}
              <Reveal>
                <div className="info-card">
                  <h4>Follow Us</h4>
                  <div className="social-row">
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">Twitter / X</a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>
                  </div>
                </div>
              </Reveal>

              {/* Live Studio Clocks — rotating 10 world cities */}
              <Reveal>
                <div className="info-card">
                  <h4>Studio Time</h4>
                  <div className="studio-clocks-grid">
                    {/* Left: always Chennai */}
                    <div className="clock-card">
                      <div className="clock-city">Chennai</div>
                      <div className="clock-time">{cityTimes.chennai || "—"}</div>
                      <div className="clock-tz">IST (UTC+5:30)</div>
                    </div>
                    {/* Right: rotating world city */}
                    <div className="clock-card" style={{ opacity: clockFade ? 1 : 0, transition: "opacity 0.4s ease" }}>
                      <div className="clock-city">{WORLD_CITIES[cityIdx].city}</div>
                      <div className="clock-time">{cityTimes.other || "—"}</div>
                      <div className="clock-tz">{WORLD_CITIES[cityIdx].tz}</div>
                    </div>
                  </div>
                  <div className="clock-rotation-hint">Cycles through {WORLD_CITIES.length - 1} cities · every 2 min</div>
                </div>
              </Reveal>

              {/* Why TicTip — trust mini-card */}
              <Reveal>
                <div className="info-card trust-card">
                  <h4>Why Clients Choose Us</h4>
                  <div className="trust-list">
                    {[
                      { icon: "⚡", b: "1–2 week kickoff",    t: "We start fast without sacrificing scoping." },
                      { icon: "🔒", b: "Full IP ownership",    t: "Your code and designs, from day one." },
                      { icon: "✅", b: "QA from sprint one",   t: "Tests ship alongside features, always." },
                      { icon: "📊", b: "Fixed-price estimates", t: "No surprise invoices, no scope creep." },
                    ].map(({ icon, b, t }) => (
                      <div className="trust-row" key={b}>
                        <span className="trust-icon">{icon}</span>
                        <div>
                          <b>{b}</b>
                          <p>{t}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="surface">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Common Questions</span>
            <h2>Frequently Asked Questions</h2>
          </Reveal>
          <div className="faq-list">
            {FAQS.map((f) => <FaqItem key={f.q} question={f.q} answer={f.a} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section>
        <div className="wrap">
          <Reveal>
            <div className="cta-banner">
              <div>
                <h2>Still not sure where to start?</h2>
                <p>Book a free 30-minute call and we'll help you figure out the right approach.</p>
              </div>
              <div className="cta-actions">
                <a href="mailto:admin@tictiptech.com" className="btn btn-primary">Email Us Directly</a>
                <Link to="/services" className="btn btn-outline">
                  Our Services
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Success Modal Popup */}
      {showSuccessModal && (
        <>
          <Confetti />
          <div className="modal-backdrop" onClick={() => setShowSuccessModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-icon">✓</div>
              <h2>Thank You!</h2>
              <p>We will get back to you shortly.</p>
              <button className="btn btn-primary" onClick={() => setShowSuccessModal(false)}>
                Got it
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
