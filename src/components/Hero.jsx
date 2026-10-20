"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { HeroScene } from "./Scene";
import HeroSearch from "./HeroSearch";
import { Arrow } from "./Icons";
import { listings } from "@/data/listings";
import { site } from "@/data/site";

const smooth = (t) => t * t * (3 - 2 * t);

/**
 * The hero is a tall section with a sticky 100svh stage. Scroll progress drives
 * a single CSS variable (--p, 0 → 1) that opens the arched “window” to full
 * bleed. Everything else (headline drift, search fade) hangs off the same
 * progress value, so there is one scroll listener and no React re-renders.
 */
export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const p = useTransform(scrollYProgress, [0, 0.55], [0, 1], { ease: smooth });
  const sceneScale = useTransform(scrollYProgress, [0, 0.55], [1.22, 1]);
  const copyY = useTransform(scrollYProgress, [0, 0.4], [0, -110]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const searchOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const searchY = useTransform(scrollYProgress, [0, 0.18], [0, 36]);
  const searchVis = useTransform(scrollYProgress, (v) => (v > 0.2 ? "hidden" : "visible"));
  const endOpacity = useTransform(scrollYProgress, [0.5, 0.72], [0, 1]);
  const endY = useTransform(scrollYProgress, [0.5, 0.72], [50, 0]);
  const endVis = useTransform(scrollYProgress, (v) => (v < 0.52 ? "hidden" : "visible"));

  return (
    <section ref={ref} className="hero" aria-labelledby="hero-title">
      <div className="hero__sticky">
        <motion.div className="hero__arch" style={{ "--p": p }}>
          <motion.div className="hero__scene" style={{ scale: sceneScale }}>
            <HeroScene />
          </motion.div>
          <div className="hero__shade" />
        </motion.div>

        <motion.div className="hero__copy" style={{ y: copyY, opacity: copyOpacity }}>
          <p className="eyebrow eyebrow--light reveal-line" style={{ "--d": "0.1s" }}>
            <span>{site.city} · Rental agency</span>
          </p>
          <h1 id="hero-title" className="hero__title">
            <span className="reveal-line hero__line hero__line--a" style={{ "--d": "0.2s" }}>
              <span>Homes</span>
            </span>
            <span className="reveal-line hero__line hero__line--b" style={{ "--d": "0.34s" }}>
              <span>
                to <em>rent</em>.
              </span>
            </span>
            <span className="sr-only"> in {site.city} — apartments, lofts and houses with a rental agency that shows you the full cost up front.</span>
          </h1>
          <p className="hero__sub reveal-line" style={{ "--d": "0.55s" }}>
            <span>
              Furnished and unfurnished apartments, lofts and houses across {site.city}. Long leases, flexible stays,
              and viewings in person or on video.
            </span>
          </p>
        </motion.div>

        <motion.div className="hero__search" style={{ opacity: searchOpacity, y: searchY, visibility: searchVis }}>
          <HeroSearch />
          <p className="hero__count">
            {listings.length} homes to view · <Link href="/listings">See them all</Link>
          </p>
        </motion.div>

        <div className="hero__scroll" aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>

        <motion.div className="hero__end" style={{ opacity: endOpacity, y: endY, visibility: endVis }}>
          <p className="hero__end-title">
            Your next address
            <br />
            is waiting.
          </p>
          <div className="hero__end-actions">
            <Link href="/listings" className="btn btn--light">
              <span>Browse all rentals</span>
              <Arrow />
            </Link>
            <Link href="/contact" className="btn btn--outline-light">
              <span>Talk to an agent</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
