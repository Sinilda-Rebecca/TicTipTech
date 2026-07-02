import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Cursor from "./components/Cursor";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Contact from "./pages/Contact";

/** Scroll progress bar + back-to-top + scroll-to-top on route change */
function ScrollUtils() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop]   = useState(false);
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const el  = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setProgress(pct);
      setShowTop(el.scrollTop > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <div className="scroll-progress" style={{ width: `${progress}%` }} aria-hidden="true" />
      {/* Back to top */}
      <button
        className={`back-to-top${showTop ? " visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        ↑
      </button>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollUtils />
      <div className="app-container">
        <Cursor />
        <Header />

        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/about"         element={<About />} />
          <Route path="/services"      element={<Services />} />
          <Route path="/projects"      element={<Projects />} />
          <Route path="/projects/:key" element={<ProjectDetail />} />
          <Route path="/contact"       element={<Contact />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}
