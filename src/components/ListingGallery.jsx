"use client";

import { useState } from "react";
import { RoomScene } from "./Scene";

const WINDOW_CYCLE = ["arch", "round", "twin", "grid"];
const FURN_CYCLE = ["sofa", "bed", "desk", "dining"];

/** Three “views” of the same home, generated from the listing's art settings. */
function views(art) {
  const wi = WINDOW_CYCLE.indexOf(art.window);
  const fi = FURN_CYCLE.indexOf(art.furn);
  return [
    { label: "Living space", art },
    { label: "Morning light", art: { ...art, window: WINDOW_CYCLE[(wi + 1) % 4], sun: 1 - art.sun, seed: art.seed + 1 } },
    { label: "Evening", art: { ...art, furn: FURN_CYCLE[(fi + 2) % 4], palette: art.palette, sun: 0.2 + ((art.sun + 0.4) % 0.6), seed: art.seed + 2 } },
  ];
}

export default function ListingGallery({ listing }) {
  const items = views(listing.art);
  const [i, setI] = useState(0);

  return (
    <div className="gallery">
      <div className="gallery__main" aria-live="polite">
        <RoomScene
          key={i}
          art={items[i].art}
          uid={`${listing.slug}-g${i}`}
          className="gallery__scene"
          label={`${listing.title} — ${items[i].label}`}
        />
      </div>
      <div className="gallery__thumbs" role="group" aria-label="Choose a view">
        {items.map((v, n) => (
          <button
            key={v.label}
            type="button"
            className={`gallery__thumb ${n === i ? "is-on" : ""}`}
            aria-pressed={n === i}
            onClick={() => setI(n)}
          >
            <RoomScene art={v.art} uid={`${listing.slug}-t${n}`} label="" />
            <span>{v.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
