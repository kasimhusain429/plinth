"use client";

import { useEffect, useRef } from "react";

/**
 * Fades + lifts its children into view once. Pure CSS transition driven by an
 * IntersectionObserver, so it costs no re-renders. Without JS the content is
 * simply visible (the hidden state only exists under `html.js`).
 */
export default function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`.trim()} style={{ "--d": `${delay}s` }} {...rest}>
      {children}
    </Tag>
  );
}
