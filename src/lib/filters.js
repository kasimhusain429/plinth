import { listings } from "@/data/listings";
import { areaBySlug } from "@/data/areas";

export const MIN_RENT = 300;
export const MAX_RENT = 3500; // slider maximum — treated as "no limit"
export const SORTS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest first" },
  { value: "size", label: "Largest first" },
];
export const BED_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "0", label: "Studio" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3+" },
];

export const DEFAULT_FILTERS = {
  areas: [],
  beds: "any",
  type: "any",
  max: MAX_RENT,
  furnished: false,
  pets: false,
  parking: false,
  sort: "recommended",
};

/** Reads filters from anything with a `.get(key)` (URLSearchParams, ReadonlyURLSearchParams). */
export function parseFilters(params) {
  const get = (k) => (params && typeof params.get === "function" ? params.get(k) : null);
  const areas = (get("area") || "")
    .split(",")
    .filter((slug) => areaBySlug[slug]);
  const beds = ["0", "1", "2", "3"].includes(get("beds")) ? get("beds") : "any";
  const max = Number(get("max"));
  const sort = SORTS.some((s) => s.value === get("sort")) ? get("sort") : "recommended";
  return {
    areas,
    beds,
    type: get("type") || "any",
    max: Number.isFinite(max) && max >= MIN_RENT && max < MAX_RENT ? Math.round(max) : MAX_RENT,
    furnished: get("furnished") === "1",
    pets: get("pets") === "1",
    parking: get("parking") === "1",
    sort,
  };
}

/** Only non-default values are written, which keeps shared URLs short. */
export function serializeFilters(f) {
  const q = new URLSearchParams();
  if (f.areas.length) q.set("area", f.areas.join(","));
  if (f.beds !== "any") q.set("beds", f.beds);
  if (f.type !== "any") q.set("type", f.type);
  if (f.max < MAX_RENT) q.set("max", String(f.max));
  if (f.furnished) q.set("furnished", "1");
  if (f.pets) q.set("pets", "1");
  if (f.parking) q.set("parking", "1");
  if (f.sort !== "recommended") q.set("sort", f.sort);
  return q.toString();
}

export function applyFilters(items, f) {
  const out = items.filter((l) => {
    if (f.areas.length && !f.areas.includes(l.area)) return false;
    if (f.beds !== "any") {
      const n = Number(f.beds);
      if (n === 3 ? l.beds < 3 : l.beds !== n) return false;
    }
    if (f.type !== "any" && l.type !== f.type) return false;
    if (f.max < MAX_RENT && l.rent > f.max) return false;
    if (f.furnished && !l.furnished) return false;
    if (f.pets && !l.pets) return false;
    if (f.parking && !l.parking) return false;
    return true;
  });
  const sorted = [...out];
  if (f.sort === "price-asc") sorted.sort((a, b) => a.rent - b.rent);
  if (f.sort === "price-desc") sorted.sort((a, b) => b.rent - a.rent);
  if (f.sort === "newest") sorted.sort((a, b) => a.listedDaysAgo - b.listedDaysAgo);
  if (f.sort === "size") sorted.sort((a, b) => b.size - a.size);
  return sorted;
}

export function countActive(f) {
  return (
    (f.areas.length ? 1 : 0) +
    (f.beds !== "any" ? 1 : 0) +
    (f.type !== "any" ? 1 : 0) +
    (f.max < MAX_RENT ? 1 : 0) +
    (f.furnished ? 1 : 0) +
    (f.pets ? 1 : 0) +
    (f.parking ? 1 : 0)
  );
}

export const allListings = listings;
