"use client";

import { useState } from "react";
import Link from "next/link";
import { Arrow } from "./Icons";
import Reveal from "./Reveal";

const WAYS = [
  {
    id: "long",
    title: "Long-term leases",
    image: "/images/ways/long-term.jpg",
    line: "12 months and beyond, with clear written terms.",
    body: "The classic tenancy for people putting down roots. Choose furnished or unfurnished, agree the term, and settle in knowing exactly what you’ve signed.",
    points: ["Terms from 12 months", "Furnished or unfurnished", "Deposit and fees shown up front"],
    cta: { label: "Browse long-term homes", href: "/listings?sort=price-asc" },
  },
  {
    id: "flex",
    title: "Flexible stays",
    image: "/images/ways/flexible-stays.jpg",
    line: "From three months — for work, study or a fresh start.",
    body: "Not sure how long you’ll stay? Filter for homes with short minimum terms and move in without committing to a full year.",
    points: ["Minimum terms from 3 months", "Mostly furnished and move-in ready", "Easy to extend if you love it"],
    cta: { label: "See flexible homes", href: "/listings?furnished=1&beds=0" },
  },
  {
    id: "furnished",
    title: "Furnished & move-in ready",
    image: "/images/ways/furnished.jpg",
    line: "Arrive with a suitcase. Everything else is already there.",
    body: "Furnished homes come with beds made, kitchens stocked and internet set up. Perfect if you’re relocating or want to skip the shopping.",
    points: ["Beds, sofas and a full kitchen", "Fibre internet set up", "Quick handover on move-in day"],
    cta: { label: "Browse furnished homes", href: "/listings?furnished=1" },
  },
  {
    id: "landlords",
    title: "For property owners",
    image: "/images/ways/landlords.jpg",
    line: "Let your home with people who treat it like their own.",
    body: "Tell us about your property and we’ll handle the listing, viewings, tenant checks, lease and handover — so renting it out feels simple.",
    points: ["Listing and viewings handled", "Tenant checks and written lease", "Clear updates throughout"],
    cta: { label: "List your property", href: "/contact?topic=landlord" },
  },
];

export default function Ways() {
  const [open, setOpen] = useState("long");

  return (
    <section id="ways" className="ways" aria-labelledby="ways-title">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow eyebrow--light">Ways to rent</p>
          <h2 id="ways-title" className="h2">One agency, <em>every kind</em> of tenancy.</h2>
        </Reveal>

        <ul className="ways__list">
          {WAYS.map((w, i) => {
            const isOpen = open === w.id;
            return (
              <li key={w.id} className={`way ${isOpen ? "is-open" : ""}`}>
                <h3 className="way__heading">
                  <button
                    type="button"
                    className="way__trigger"
                    aria-expanded={isOpen}
                    aria-controls={`way-${w.id}`}
                    onClick={() => setOpen(isOpen ? null : w.id)}
                  >
                    <span className="way__num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="way__title">{w.title}</span>
                    <span className="way__line">{w.line}</span>
                    <span className="way__plus" aria-hidden="true" />
                  </button>
                </h3>
                <div id={`way-${w.id}`} className="way__panel" role="region" aria-label={w.title}>
                  <div className="way__panel-inner">
                    <div className="way__panel-text">
                      <p>{w.body}</p>
                      <ul>
                        {w.points.map((pt) => (
                          <li key={pt}>{pt}</li>
                        ))}
                      </ul>
                      <Link href={w.cta.href} className="btn btn--light">
                        <span>{w.cta.label}</span>
                        <Arrow />
                      </Link>
                    </div>
                    {w.image && (
                      <div className="way__media">
                        <img src={w.image} alt={w.title} className="way__img" loading="lazy" />
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
