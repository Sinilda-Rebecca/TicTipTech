import React, { useState, useEffect, useRef } from "react";
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

export default function Contact() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    service: "Website Development", budget: "< $5,000", message: "",
  });
  const [status, setStatus] = useState("idle");
  const [chennaiTime, setChennaiTime] = useState("");
  const [londonTime,  setLondonTime]  = useState("");

  // Live studio clocks
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setChennaiTime(now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata",   hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }));
      setLondonTime( now.toLocaleTimeString("en-GB", { timeZone: "Europe/London",  hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    const payload = {
      name: form.name, email: form.email, phone: form.phone,
      company: form.company, projectType: form.service,
      description: form.message, budget: form.budget, reference: "",
    };
    try {
      const res = await fetch("http://localhost:8000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", phone: "", company: "", service: "Website Development", budget: "< $5,000", message: "" });
    } catch {
      // Fallback to Google Script
      const scriptURL = "https://script.google.com/macros/s/AKfycbzSLaEDMvloAykLcDvRuymlCGzZqRI4zPpXf-7BU_LJJRYKiXUHaN7lX44KvYSRalqP/exec";
      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) => fd.append(k, v));
      try {
        const r2 = await fetch(scriptURL, { method: "POST", body: fd });
        setStatus(r2.ok ? "success" : "error");
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
              <h1>Let's build something<br />great together.</h1>
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

            {/* LEFT: Form */}
            <Reveal>
              <div className="contact-form-card">
                <h3>Send us a message</h3>
                <form onSubmit={submit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">Full Name *</label>
                      <input id="name" name="name" value={form.name} onChange={handle} required placeholder="Jane Doe" className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="email">Email *</label>
                      <input id="email" name="email" type="email" value={form.email} onChange={handle} required placeholder="jane@company.com" className="form-input" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="phone">Phone</label>
                      <input id="phone" name="phone" value={form.phone} onChange={handle} placeholder="+91 98000 00000" className="form-input" />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="company">Company</label>
                      <input id="company" name="company" value={form.company} onChange={handle} placeholder="Acme Inc." className="form-input" />
                    </div>
                  </div>
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
                    <textarea id="message" name="message" value={form.message} onChange={handle} required rows={5} placeholder="Goals, current situation, timeline, any blockers..." className="form-textarea" />
                  </div>
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={status === "loading"}
                    style={status === "success" ? { background: "#10b981", color: "#fff" } : status === "error" ? { background: "#ef4444", color: "#fff" } : {}}
                  >
                    {status === "loading" ? "Sending…" : status === "success" ? "✓ Message Sent!" : status === "error" ? "Failed — try again" : "Send Message →"}
                  </button>
                </form>
              </div>
            </Reveal>

            {/* RIGHT: Info Column */}
            <div className="contact-info-col">
              {/* Contact Info */}
              <Reveal>
                <div className="info-card">
                  <h4>Contact Info</h4>
                  <div className="info-row">
                    <span className="info-icon">✉</span>
                    <div>
                      <b>Email</b>
                      <p><a href="mailto:hello@tictiptech.com">hello@tictiptech.com</a></p>
                    </div>
                  </div>
                  <div className="info-row">
                    <span className="info-icon">📞</span>
                    <div>
                      <b>Phone</b>
                      <p>+91 00000 00000</p>
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
                    <a href="#" className="social-link">LinkedIn</a>
                    <a href="#" className="social-link">Twitter / X</a>
                    <a href="#" className="social-link">GitHub</a>
                    <a href="#" className="social-link">Dribbble</a>
                  </div>
                </div>
              </Reveal>

              {/* Live Studio Clocks */}
              <Reveal>
                <div className="info-card">
                  <h4>Studio Time</h4>
                  <div className="studio-clocks-grid">
                    <div className="clock-card">
                      <div className="clock-city">Chennai</div>
                      <div className="clock-time">{chennaiTime || "—"}</div>
                      <div className="clock-tz">IST (UTC+5:30)</div>
                    </div>
                    <div className="clock-card">
                      <div className="clock-city">London</div>
                      <div className="clock-time">{londonTime || "—"}</div>
                      <div className="clock-tz">BST / GMT</div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Map embed */}
              <Reveal>
                <div className="map-embed">
                  📍 Chennai, India — Map embed
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
                <a href="mailto:hello@tictiptech.com" className="btn btn-primary">Email Us Directly</a>
                <Link to="/services" className="btn btn-outline" style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}>
                  Our Services
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
