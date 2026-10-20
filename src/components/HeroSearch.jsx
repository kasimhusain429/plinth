"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { areas } from "@/data/areas";
import { DEFAULT_FILTERS, serializeFilters } from "@/lib/filters";
import { Arrow } from "./Icons";

const BUDGETS = [
  { value: "", label: "Any budget" },
  { value: "600", label: "Up to €600" },
  { value: "900", label: "Up to €900" },
  { value: "1200", label: "Up to €1,200" },
  { value: "1800", label: "Up to €1,800" },
  { value: "2500", label: "Up to €2,500" },
];

export default function HeroSearch() {
  const router = useRouter();
  const [area, setArea] = useState("");
  const [beds, setBeds] = useState("any");
  const [max, setMax] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const qs = serializeFilters({
      ...DEFAULT_FILTERS,
      areas: area ? [area] : [],
      beds,
      max: max ? Number(max) : DEFAULT_FILTERS.max,
    });
    router.push(`/listings${qs ? `?${qs}` : ""}`);
  };

  return (
    <form className="hsearch" onSubmit={onSubmit} aria-label="Search rentals">
      <label className="hsearch__field">
        <span>Neighborhood</span>
        <select value={area} onChange={(e) => setArea(e.target.value)}>
          <option value="">Anywhere in Belgrade</option>
          {areas.map((a) => (
            <option key={a.slug} value={a.slug}>{a.name}</option>
          ))}
        </select>
      </label>
      <label className="hsearch__field">
        <span>Bedrooms</span>
        <select value={beds} onChange={(e) => setBeds(e.target.value)}>
          <option value="any">Any</option>
          <option value="0">Studio</option>
          <option value="1">1 bedroom</option>
          <option value="2">2 bedrooms</option>
          <option value="3">3+ bedrooms</option>
        </select>
      </label>
      <label className="hsearch__field">
        <span>Monthly budget</span>
        <select value={max} onChange={(e) => setMax(e.target.value)}>
          {BUDGETS.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>
      </label>
      <button type="submit" className="btn btn--clay hsearch__go">
        <span>Search rentals</span>
        <Arrow />
      </button>
    </form>
  );
}
