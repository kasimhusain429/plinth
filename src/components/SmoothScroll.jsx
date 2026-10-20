"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis smooth scrolling for mouse / trackpad users.
 * Skipped for touch devices (native momentum scrolling is better there)
 * and for people who prefer reduced motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    window.__lenis = lenis;

    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });

    // Same-page anchors (#pricing, /#pricing) glide instead of jumping.
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest("a[href*='#']");
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      lenis.scrollTo(el, { offset: -8 });
      window.history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick, true);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick, true);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
