import React, { useEffect, useRef } from "react";

export default function Cursor() {
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);

  useEffect(() => {
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let ringPos = { x: mouse.x, y: mouse.y };
    let dotPos = { x: mouse.x, y: mouse.y };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseDown = () => {
      document.body.classList.add("cursor-click");
    };

    const handleMouseUp = () => {
      document.body.classList.remove("cursor-click");
    };

    const setupCursorHovers = () => {
      const hoverables = document.querySelectorAll(
        "a, button, .project-card, .filter-btn, .cta, input, textarea, .bento-option-label"
      );
      hoverables.forEach((el) => {
        el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
        el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    // Periodically search for new hoverable items (due to dynamic renders)
    const hoverInterval = setInterval(setupCursorHovers, 1000);

    let animationFrameId;
    const animateCursor = () => {
      ringPos.x += (mouse.x - ringPos.x) * 0.15;
      ringPos.y += (mouse.y - ringPos.y) * 0.15;
      
      dotPos.x += (mouse.x - dotPos.x) * 0.5;
      dotPos.y += (mouse.y - dotPos.y) * 0.5;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${dotPos.x}px, ${dotPos.y}px)`;
      }
      animationFrameId = requestAnimationFrame(animateCursor);
    };
    animationFrameId = requestAnimationFrame(animateCursor);

    // Toggle with "C" key
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === "c") {
        if (cursorDotRef.current) {
          cursorDotRef.current.style.display = cursorDotRef.current.style.display === "none" ? "block" : "none";
        }
        if (cursorRingRef.current) {
          cursorRingRef.current.style.display = cursorRingRef.current.style.display === "none" ? "block" : "none";
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(hoverInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div id="cursor">
      <div id="cursor-dot" ref={cursorDotRef}></div>
      <div id="cursor-ring" ref={cursorRingRef}></div>
    </div>
  );
}
