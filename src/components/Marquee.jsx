const ITEMS = [
  "Furnished",
  "Unfurnished",
  "Long leases",
  "Flexible stays",
  "Pet-friendly",
  "Video viewings",
  "Costs shown up front",
  "Dorćol",
  "Vračar",
  "New Belgrade",
  "Savamala",
  "Zemun",
  "Senjak",
];

export default function Marquee() {
  const row = (hidden) => (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {ITEMS.map((t) => (
        <li key={t}>
          {t}
          <i aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee" role="region" aria-label="What we rent">
      <div className="marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
