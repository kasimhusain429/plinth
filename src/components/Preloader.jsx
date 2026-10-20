"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

/**
 * Shown once per browser session. The page content is already in the HTML
 * underneath, so this never blocks crawlers or first paint — it just curtains
 * the first visit. Repeat visits and reduced-motion users skip it entirely
 * (see the boot script in app/layout.jsx).
 */
export default function Preloader() {
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (html.classList.contains("no-preload")) {
      setGone(true);
      return;
    }
    const start = performance.now();
    const duration = 1500;
    let raf;
    let timer;

    const finish = () => {
      html.classList.add("is-ready");
      try {
        sessionStorage.setItem("plinth-seen", "1");
      } catch {
        /* storage can be blocked — not important */
      }
      timer = setTimeout(() => setGone(true), 1100);
    };

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setPct(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  if (gone) return null;

  return (
    <div className="preloader" aria-hidden="true">
      <div className="preloader__inner">
        <span className="preloader__brand">{site.name}</span>
        <span className="preloader__count">{String(pct).padStart(3, "0")}</span>
      </div>
      <span className="preloader__bar" style={{ transform: `scaleX(${pct / 100})` }} />
    </div>
  );
}
