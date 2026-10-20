"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import Reveal from "./Reveal";

const STEPS = [
  { t: "Tell us what you need", d: "Use the search, fill in the form or call us — area, budget, move-in date, and anything that really matters." },
  { t: "Get a shortlist", d: "We pick the homes that genuinely fit and send them over with the full cost for each." },
  { t: "View it your way", d: "Visit in person or take a live video tour with an agent. Bring questions; we’ll have answers." },
  { t: "Sign and move in", d: "Agree the terms, sign the lease, and collect your keys. We’ll be there for the handover." },
];

export default function Process() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.6"] });

  return (
    <section id="process" className="process" aria-labelledby="process-title">
      <div className="container process__grid">
        <div className="process__sticky">
          <p className="eyebrow eyebrow--light">How it works</p>
          <h2 id="process-title" className="h2">From first search to <em>first night.</em></h2>
        </div>

        <div className="process__steps" ref={ref}>
          <span className="process__rail" aria-hidden="true">
            <motion.i style={{ scaleY: scrollYProgress }} />
          </span>
          <ol>
            {STEPS.map((s, i) => (
              <li key={s.t}>
                <Reveal className="step">
                  <span className="step__num">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="step__title">{s.t}</h3>
                  <p>{s.d}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
