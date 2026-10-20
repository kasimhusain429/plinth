"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ListingCard from "./ListingCard";
import { areas } from "@/data/areas";
import { listings, propertyTypes } from "@/data/listings";
import {
  BED_OPTIONS,
  DEFAULT_FILTERS,
  MAX_RENT,
  MIN_RENT,
  SORTS,
  applyFilters,
  countActive,
  parseFilters,
  serializeFilters,
} from "@/lib/filters";
import { money } from "@/lib/format";

export default function ListingsExplorer() {
  const searchParams = useSearchParams();
  const reduce = useReducedMotion();
  const [f, setF] = useState(() => parseFilters(searchParams));
  const [panelOpen, setPanelOpen] = useState(false);
  const first = useRef(true);

  // Keep the address bar shareable without triggering a navigation.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const qs = serializeFilters(f);
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }, [f]);

  const results = useMemo(() => applyFilters(listings, f), [f]);
  const active = countActive(f);
  const update = (patch) => setF((s) => ({ ...s, ...patch }));
  const toggleArea = (slug) =>
    update({ areas: f.areas.includes(slug) ? f.areas.filter((a) => a !== slug) : [...f.areas, slug] });
  const reset = () => setF({ ...DEFAULT_FILTERS, sort: f.sort });
  const pct = ((f.max - MIN_RENT) / (MAX_RENT - MIN_RENT)) * 100;

  return (
    <div className="explorer">
      <div className="explorer__bar">
        <div className="container explorer__bar-inner">
          <button
            type="button"
            className="btn btn--outline explorer__toggle"
            aria-expanded={panelOpen}
            aria-controls="filters"
            onClick={() => setPanelOpen((v) => !v)}
          >
            <span>Filters{active ? ` (${active})` : ""}</span>
          </button>

          <p className="explorer__count" role="status" aria-live="polite">
            <strong>{results.length}</strong> {results.length === 1 ? "home" : "homes"}
          </p>

          <label className="explorer__sort">
            <span>Sort</span>
            <select value={f.sort} onChange={(e) => update({ sort: e.target.value })}>
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="container explorer__layout">
        <form
          id="filters"
          className={`filters ${panelOpen ? "is-open" : ""}`}
          onSubmit={(e) => e.preventDefault()}
          aria-label="Filter rentals"
        >
          <fieldset className="filters__group">
            <legend>Neighborhood</legend>
            <div className="chips">
              {areas.map((a) => (
                <button
                  key={a.slug}
                  type="button"
                  className={`chip ${f.areas.includes(a.slug) ? "is-on" : ""}`}
                  aria-pressed={f.areas.includes(a.slug)}
                  onClick={() => toggleArea(a.slug)}
                >
                  {a.name}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="filters__group">
            <legend>Bedrooms</legend>
            <div className="chips">
              {BED_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  className={`chip ${f.beds === o.value ? "is-on" : ""}`}
                  aria-pressed={f.beds === o.value}
                  onClick={() => update({ beds: o.value })}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="filters__group">
            <label htmlFor="f-type" className="filters__label">Home type</label>
            <select id="f-type" value={f.type} onChange={(e) => update({ type: e.target.value })}>
              <option value="any">Any type</option>
              {propertyTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="filters__group">
            <label htmlFor="f-max" className="filters__label">
              Max rent <strong>{f.max >= MAX_RENT ? "No limit" : `${money(f.max)}/mo`}</strong>
            </label>
            <input
              id="f-max"
              className="range"
              type="range"
              min={MIN_RENT}
              max={MAX_RENT}
              step={50}
              value={f.max}
              onChange={(e) => update({ max: Number(e.target.value) })}
              style={{ "--fill": `${pct}%` }}
            />
          </div>

          <fieldset className="filters__group">
            <legend>Must have</legend>
            {[
              ["furnished", "Furnished"],
              ["pets", "Pets welcome"],
              ["parking", "Parking"],
            ].map(([key, label]) => (
              <label key={key} className="check">
                <input type="checkbox" checked={f[key]} onChange={(e) => update({ [key]: e.target.checked })} />
                <span>{label}</span>
              </label>
            ))}
          </fieldset>

          <button type="button" className="filters__reset" onClick={reset} disabled={!active}>
            Clear all filters
          </button>
        </form>

        <div className="explorer__results">
          {results.length === 0 ? (
            <div className="empty">
              <h2>No homes match just yet.</h2>
              <p>Try widening the budget or removing a filter — or tell us what you need and we’ll look for you.</p>
              <div className="empty__actions">
                <button type="button" className="btn btn--ink" onClick={reset}><span>Clear filters</span></button>
                <a className="btn btn--outline" href="/contact?topic=rent"><span>Ask an agent</span></a>
              </div>
            </div>
          ) : (
            <ul className="grid">
              <AnimatePresence mode="popLayout" initial={false}>
                {results.map((l) => (
                  <motion.li
                    key={l.slug}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                    transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ListingCard listing={l} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
