import Link from "next/link";
import { RoomScene } from "./Scene";
import { areaBySlug } from "@/data/areas";
import { bedsLabel, money } from "@/lib/format";

export default function ListingCard({ listing: l, variant = "grid", priority = false }) {
  const area = areaBySlug[l.area];
  return (
    <article className={`card card--${variant}`}>
      <Link href={`/listings/${l.slug}`} className="card__link" aria-label={`${l.title}, ${area.name}, ${money(l.rent)} per month`}>
        <div className="card__media">
          <RoomScene art={l.art} uid={`${l.slug}-${variant}`} label="" />
          <div className="card__tags">
            {l.tags.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
            {l.furnished && <span className="tag tag--ghost">Furnished</span>}
          </div>
          <span className="card__avail">Available {l.available === "Now" ? "now" : l.available}</span>
        </div>
        <div className="card__body">
          <div className="card__row">
            <h3 className="card__title">{l.title}</h3>
            <p className="card__price">
              {money(l.rent)}
              <small>/mo</small>
            </p>
          </div>
          <p className="card__meta">
            {area.name} · {bedsLabel(l.beds)} · {l.size} m²
          </p>
        </div>
      </Link>
    </article>
  );
}
