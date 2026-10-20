"use client";

import { useState } from "react";
import Link from "next/link";
import { areas } from "@/data/areas";
import { listings } from "@/data/listings";
import { money } from "@/lib/format";
import { Arrow } from "./Icons";
import Reveal from "./Reveal";

export default function Neighborhoods() {
  const [active, setActive] = useState("dorcol");
  const area = areas.find((a) => a.slug === active);
  const inArea = listings.filter((l) => l.area === active);
  const from = inArea.length ? Math.min(...inArea.map((l) => l.rent)) : null;

  return (
    <section id="areas" className="areas" aria-labelledby="areas-title">
      <div className="container areas__grid">
        <Reveal className="areas__intro">
          <p className="eyebrow">Neighborhoods</p>
          <h2 id="areas-title" className="h2">Pick the <em>part of town</em> first.</h2>
          <p className="lede">
            Where you live shapes your days more than the floor plan does. Tap a neighborhood to see what it’s like and
            what’s available.
          </p>

          <div className="areas__card" aria-live="polite">
            <div className="areas__card-media">
              <img
                src={area.image || `/images/neighborhoods/${area.slug}.jpg`}
                alt={`${area.name} neighborhood`}
                className="areas__card-img"
              />
            </div>
            <h3 className="areas__name">{area.name}</h3>
            <p>{area.blurb}</p>
            <p className="areas__stat">
              {inArea.length === 0
                ? "No homes listed here right now."
                : `${inArea.length} ${inArea.length === 1 ? "home" : "homes"} available · from ${money(from)}/mo`}
            </p>
            <Link href={`/listings?area=${area.slug}`} className="btn btn--ink">
              <span>See rentals in {area.name}</span>
              <Arrow />
            </Link>
          </div>
        </Reveal>

        <Reveal className="areas__map-wrap" delay={0.1}>
          <div className="areas__map">
            <svg viewBox="0 0 100 70" preserveAspectRatio="none" aria-hidden="true">
              <rect width="100" height="70" fill="#EFE6D3" />
              <g stroke="#D8CBB0" strokeWidth="0.35" fill="none">
                <path d="M8 30 L40 56 M16 24 L52 54 M30 8 L66 44 M44 6 L84 50 M60 12 L96 44" />
                <path d="M4 44 L30 30 M20 60 L56 48 M40 66 L90 58 M60 52 L98 40" />
              </g>
              <path d="M0 10 C22 12 40 22 56 32 S84 34 100 26" stroke="#BFD3D4" strokeWidth="6" fill="none" strokeLinecap="round" />
              <path d="M0 50 C18 50 36 46 56 32" stroke="#BFD3D4" strokeWidth="4.2" fill="none" strokeLinecap="round" />
              <g fill="#CDDDB8" opacity="0.85">
                <ellipse cx="50" cy="60" rx="9" ry="4.5" />
                <ellipse cx="36" cy="30" rx="6" ry="3" />
                <ellipse cx="80" cy="50" rx="5" ry="3.2" />
              </g>
            </svg>
            <span className="areas__river areas__river--a">Danube</span>
            <span className="areas__river areas__river--b">Sava</span>

            {areas.map((a) => {
              const count = listings.filter((l) => l.area === a.slug).length;
              return (
                <button
                  key={a.slug}
                  type="button"
                  className={`pin ${active === a.slug ? "is-active" : ""}`}
                  style={{ left: `${a.x}%`, top: `${(a.y / 70) * 100}%` }}
                  onClick={() => setActive(a.slug)}
                  onFocus={() => setActive(a.slug)}
                  aria-pressed={active === a.slug}
                  aria-label={`${a.name}, ${count} ${count === 1 ? "home" : "homes"}`}
                >
                  <span className="pin__dot">{count}</span>
                  <span className="pin__label">{a.name}</span>
                </button>
              );
            })}
          </div>
          <p className="areas__note">Stylised map, not to scale.</p>
        </Reveal>
      </div>
    </section>
  );
}
