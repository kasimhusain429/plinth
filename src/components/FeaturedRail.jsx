"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import ListingCard from "./ListingCard";
import { Arrow } from "./Icons";
import { listings } from "@/data/listings";

const featured = listings.filter((l) => l.featured);

/**
 * Desktop: the section pins and the cards travel sideways as you scroll.
 * Mobile / reduced motion: a plain swipeable, scroll-snapping row.
 */
export default function FeaturedRail() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const measure = () => {
      const on = mq.matches;
      setPinned(on);
      if (on && trackRef.current) {
        setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
      }
    };
    measure();
    mq.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => {
      mq.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.04, 0.96], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className={`rail ${pinned ? "rail--pinned" : ""}`}
      style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}
      aria-labelledby="rail-title"
    >
      <div className="rail__sticky">
        <div className="container rail__head">
          <div>
            <p className="eyebrow eyebrow--light">Available now</p>
            <h2 id="rail-title" className="h2 rail__title">Homes ready to view</h2>
          </div>
          <Link href="/listings" className="btn btn--outline-light rail__all">
            <span>All rentals</span>
            <Arrow />
          </Link>
        </div>

        <motion.ul ref={trackRef} className="rail__track" style={pinned ? { x } : undefined}>
          {featured.map((l) => (
            <li key={l.slug} className="rail__item">
              <ListingCard listing={l} variant="rail" />
            </li>
          ))}
          <li className="rail__item rail__item--end">
            <Link href="/listings" className="rail__more">
              <span>See every rental</span>
              <Arrow />
            </Link>
          </li>
        </motion.ul>

        {pinned && (
          <div className="rail__progress" aria-hidden="true">
            <motion.i style={{ scaleX: bar }} />
          </div>
        )}
      </div>
    </section>
  );
}
