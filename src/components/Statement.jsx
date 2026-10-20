"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Arrow } from "./Icons";

const TEXT =
  "We help people find rentals they’re glad to come home to. Every listing is described honestly, every cost is shown before you ask, and every viewing is on your schedule — in person or on video.";

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="statement__word">
      {children}{" "}
    </motion.span>
  );
}

export default function Statement() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] });
  const words = TEXT.split(" ");

  return (
    <section className="statement" ref={ref} aria-labelledby="statement-label">
      <div className="container statement__inner">
        <p id="statement-label" className="eyebrow">Who we are</p>
        <p className="statement__text">
          {words.map((w, i) => {
            const start = i / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start * 0.85, start * 0.85 + 0.15]}>
                {w}
              </Word>
            );
          })}
        </p>
        <Link href="/contact" className="btn btn--ink">
          <span>Talk to us</span>
          <Arrow />
        </Link>
      </div>
    </section>
  );
}
