import { PALETTES } from "@/data/palettes";

/* Deterministic PRNG so server and client render identical SVG (no hydration drift). */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r1 = (n) => Math.round(n * 10) / 10;

function skyline(seed, x0, x1, hMin, hMax, wMin, wMax) {
  const r = rng(seed);
  const out = [];
  let x = x0 - 20;
  while (x < x1) {
    const w = r1(wMin + r() * (wMax - wMin));
    const h = r1(hMin + r() * (hMax - hMin));
    out.push({ x: r1(x), w, h, roof: r() });
    x += w + (r() < 0.3 ? r() * 10 : 0);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Hero: a golden-hour river skyline. Sized for object-fit: cover.     */
/* ------------------------------------------------------------------ */
export function HeroScene() {
  // Keep a clearing in the middle so the sun and its reflection stay visible inside the arch.
  const clearing = (b, from, to) => b.x + b.w > from && b.x < to;
  const far = skyline(11, 0, 1600, 70, 190, 18, 46).filter((b) => !clearing(b, 690, 910) || b.h < 95);
  const mid = skyline(29, 0, 1600, 110, 330, 26, 70).filter((b) => !clearing(b, 650, 950));
  const near = skyline(47, 0, 1600, 120, 250, 40, 110).filter((b) => b.x + b.w < 540 || b.x > 1060);
  const lit = [];
  const wr = rng(77);
  mid.forEach((b) => {
    const cols = Math.floor((b.w - 8) / 11);
    const rows = Math.floor((b.h - 14) / 16);
    for (let c = 0; c < cols; c++) {
      for (let rw = 0; rw < rows; rw++) {
        if (wr() < 0.1) lit.push({ x: r1(b.x + 6 + c * 11), y: r1(660 - b.h + 10 + rw * 16) });
      }
    }
  });
  const glints = Array.from({ length: 14 }, (_, i) => ({
    y: 684 + i * 15,
    w: 36 + i * 24,
    o: r1(0.55 - i * 0.032),
  }));

  return (
    <svg
      className="scene scene--hero"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Illustration of a river skyline at golden hour"
    >
      <defs>
        <linearGradient id="hs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A2346" />
          <stop offset="0.35" stopColor="#74496F" />
          <stop offset="0.62" stopColor="#E27D60" />
          <stop offset="0.8" stopColor="#F5B97A" />
          <stop offset="1" stopColor="#FBE3B0" />
        </linearGradient>
        <radialGradient id="hs-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFE2A8" stopOpacity="0.85" />
          <stop offset="0.45" stopColor="#FFB878" stopOpacity="0.3" />
          <stop offset="1" stopColor="#FFB878" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hs-sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF4D2" />
          <stop offset="1" stopColor="#FFC98A" />
        </linearGradient>
        <linearGradient id="hs-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E9946B" />
          <stop offset="0.5" stopColor="#7A4A6E" />
          <stop offset="1" stopColor="#241C3F" />
        </linearGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#hs-sky)" />
      <circle className="scene__glow" cx="800" cy="575" r="430" fill="url(#hs-glow)" />
      <circle className="scene__sun" cx="800" cy="575" r="116" fill="url(#hs-sun)" />

      <g className="scene__cloud scene__cloud--a" fill="#F9C9A0" opacity="0.3">
        <rect x="160" y="250" width="460" height="20" rx="10" />
        <rect x="260" y="282" width="300" height="14" rx="7" />
      </g>
      <g className="scene__cloud scene__cloud--b" fill="#F9C9A0" opacity="0.24">
        <rect x="980" y="330" width="420" height="18" rx="9" />
        <rect x="1060" y="360" width="260" height="12" rx="6" />
      </g>

      <g className="scene__layer scene__layer--far" fill="#6B4A78" opacity="0.55">
        {far.map((b, i) => (
          <rect key={i} x={b.x} y={r1(650 - b.h)} width={b.w} height={b.h + 4} />
        ))}
      </g>

      <rect y="650" width="1600" height="250" fill="url(#hs-water)" />
      <g fill="#FFE2A8">
        {glints.map((g, i) => (
          <rect
            key={i}
            className="scene__glint"
            style={{ animationDelay: `${r1(i * 0.28)}s` }}
            x={r1(800 - g.w / 2)}
            y={g.y}
            width={g.w}
            height="3.5"
            rx="1.75"
            opacity={g.o}
          />
        ))}
      </g>

      <g className="scene__layer scene__layer--mid">
        <g fill="#473260">
          {mid.map((b, i) => (
            <g key={i}>
              <rect x={b.x} y={r1(660 - b.h)} width={b.w} height={b.h + 4} />
              {b.roof > 0.82 && <rect x={r1(b.x + b.w / 2 - 1.5)} y={r1(660 - b.h - 26)} width="3" height="26" />}
              {b.roof < 0.18 && <rect x={r1(b.x + b.w * 0.2)} y={r1(660 - b.h - 14)} width={r1(b.w * 0.6)} height="14" />}
            </g>
          ))}
        </g>
        <g fill="#FFD89A" opacity="0.9">
          {lit.map((w, i) => (
            <rect key={i} x={w.x} y={w.y} width="5" height="7" rx="1" />
          ))}
        </g>
      </g>

      <g fill="#17112A">
        {near.map((b, i) => (
          <rect key={i} x={b.x} y={r1(900 - b.h)} width={b.w} height={b.h + 4} />
        ))}
        <circle cx="520" cy="790" r="46" />
        <circle cx="570" cy="820" r="38" />
        <circle cx="1080" cy="800" r="44" />
        <circle cx="1030" cy="830" r="36" />
        <rect x="0" y="850" width="1600" height="50" />
      </g>
      <g fill="#FFC27A" opacity="0.85">
        {near.slice(0, 14).map((b, i) => (
          <rect key={i} x={r1(b.x + 10)} y={r1(900 - b.h + 18 + (i % 3) * 30)} width="6" height="9" rx="1" />
        ))}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Listing rooms.                                                      */
/* ------------------------------------------------------------------ */
const WINDOWS = {
  arch: {
    d: "M105 318 V152 A95 95 0 0 1 295 152 V318 Z",
    box: { x: 105, y: 57, w: 190, h: 261 },
    bars: "M200 57 V318 M105 196 H295",
  },
  round: {
    d: "M100 175 A100 100 0 1 1 300 175 A100 100 0 1 1 100 175 Z",
    box: { x: 100, y: 75, w: 200, h: 200 },
    bars: "M200 75 V275 M100 175 H300",
  },
  twin: {
    d: "M70 318 V172 A55 55 0 0 1 180 172 V318 Z M220 318 V172 A55 55 0 0 1 330 172 V318 Z",
    box: { x: 70, y: 117, w: 260, h: 201 },
    bars: "M125 117 V318 M275 117 V318",
  },
  grid: {
    d: "M95 80 H305 V318 H95 Z",
    box: { x: 95, y: 80, w: 210, h: 238 },
    bars: "M200 80 V318 M95 199 H305",
  },
};

function Furniture({ kind, p }) {
  const light = "#F8F2E8";
  if (kind === "bed") {
    return (
      <g>
        <rect x="64" y="262" width="272" height="124" rx="16" fill={p.ink} opacity="0.2" />
        <ellipse cx="200" cy="414" rx="170" ry="9" fill={p.ink} opacity="0.16" />
        <rect x="54" y="340" width="292" height="74" rx="14" fill={light} />
        <rect x="54" y="376" width="292" height="50" rx="12" fill={p.accent} />
        <rect x="54" y="368" width="292" height="10" fill="#fff" opacity="0.25" />
        <ellipse cx="128" cy="338" rx="42" ry="14" fill="#fff" />
        <ellipse cx="272" cy="338" rx="42" ry="14" fill="#fff" />
        <rect x="14" y="352" width="30" height="60" rx="4" fill={p.ink} opacity="0.55" />
        <rect x="356" y="352" width="30" height="60" rx="4" fill={p.ink} opacity="0.55" />
      </g>
    );
  }
  if (kind === "desk") {
    return (
      <g>
        <ellipse cx="200" cy="420" rx="170" ry="8" fill={p.ink} opacity="0.16" />
        <rect x="224" y="196" width="112" height="7" rx="2" fill={p.ink} opacity="0.7" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={232 + i * 18} y={170 + (i % 2) * 6} width="12" height={26 - (i % 2) * 6} rx="1.5" fill={i % 2 ? p.accent : p.ink} opacity="0.75" />
        ))}
        <rect x="72" y="350" width="256" height="13" rx="4" fill={p.ink} opacity="0.85" />
        <rect x="88" y="362" width="9" height="56" fill={p.ink} opacity="0.85" />
        <rect x="303" y="362" width="9" height="56" fill={p.ink} opacity="0.85" />
        <rect x="146" y="322" width="78" height="28" rx="3" fill="#2B2B2B" />
        <rect x="150" y="326" width="70" height="20" rx="2" fill={p.sun} opacity="0.85" />
        <circle cx="272" cy="344" r="7" fill={p.accent} />
        <path d="M272 337 L286 318 L302 318" stroke={p.ink} strokeWidth="3" fill="none" opacity="0.8" />
        <circle cx="152" cy="392" r="22" fill={p.accent} />
        <rect x="150" y="408" width="4" height="12" fill={p.ink} />
      </g>
    );
  }
  if (kind === "dining") {
    return (
      <g>
        <path d="M200 0 V132" stroke={p.ink} strokeWidth="2" opacity="0.6" />
        <path d="M170 150 A30 30 0 0 1 230 150 Z" fill={p.accent} />
        <ellipse cx="200" cy="420" rx="170" ry="8" fill={p.ink} opacity="0.16" />
        <ellipse cx="200" cy="356" rx="104" ry="14" fill={p.ink} opacity="0.85" />
        <rect x="193" y="368" width="14" height="50" fill={p.ink} opacity="0.85" />
        <rect x="88" y="318" width="38" height="60" rx="10" fill={p.accent} />
        <rect x="274" y="318" width="38" height="60" rx="10" fill={p.accent} />
        <rect x="100" y="378" width="5" height="40" fill={p.ink} opacity="0.7" />
        <rect x="295" y="378" width="5" height="40" fill={p.ink} opacity="0.7" />
        <circle cx="200" cy="344" r="9" fill={light} />
      </g>
    );
  }
  // sofa (default)
  return (
    <g>
      <ellipse cx="200" cy="414" rx="176" ry="9" fill={p.ink} opacity="0.16" />
      <rect x="70" y="308" width="260" height="76" rx="22" fill={p.accent} />
      <rect x="58" y="350" width="284" height="46" rx="14" fill={p.accent} />
      <rect x="58" y="350" width="284" height="46" rx="14" fill={p.ink} opacity="0.12" />
      <rect x="48" y="330" width="34" height="68" rx="16" fill={p.accent} />
      <rect x="318" y="330" width="34" height="68" rx="16" fill={p.accent} />
      <rect x="88" y="324" width="100" height="40" rx="10" fill="#fff" opacity="0.16" />
      <rect x="212" y="324" width="100" height="40" rx="10" fill="#fff" opacity="0.16" />
      <rect x="74" y="396" width="6" height="14" fill={p.ink} />
      <rect x="320" y="396" width="6" height="14" fill={p.ink} />
    </g>
  );
}

export function RoomScene({ art, uid = "room", className = "", label }) {
  const p = PALETTES[art.palette] || PALETTES.clay;
  const win = WINDOWS[art.window] || WINDOWS.arch;
  const { box } = win;
  const r = rng(art.seed ?? 7);
  const sunX = r1(box.x + box.w * (0.22 + 0.56 * (art.sun ?? 0.5)));
  const sunY = r1(box.y + box.h * 0.62);
  const far = skyline((art.seed ?? 7) + 3, box.x - 10, box.x + box.w + 10, 18, 70, 12, 30);
  const near = skyline((art.seed ?? 7) + 9, box.x - 10, box.x + box.w + 10, 30, 100, 16, 38);
  const baseY = box.y + box.h;
  const shift = r1(((art.sun ?? 0.5) - 0.5) * 220);
  const frameX = r() > 0.5 ? 28 : 322;
  const id = (n) => `${uid}-${n}`;

  return (
    <svg
      className={`scene scene--room ${className}`.trim()}
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label || "Illustration of a bright, furnished room"}
    >
      <defs>
        <linearGradient id={id("wall")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.wall} />
          <stop offset="1" stopColor={p.wall2} />
        </linearGradient>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky2} />
          <stop offset="1" stopColor={p.sky1} />
        </linearGradient>
        <linearGradient id={id("beam")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sun} stopOpacity="0.55" />
          <stop offset="1" stopColor={p.sun} stopOpacity="0.05" />
        </linearGradient>
        <radialGradient id={id("vig")} cx="0.5" cy="0.45" r="0.8">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </radialGradient>
        <clipPath id={id("win")}>
          <path d={win.d} />
        </clipPath>
      </defs>

      <rect width="400" height="500" fill={`url(#${id("wall")})`} />
      <rect y="372" width="400" height="128" fill={p.floor} />
      <rect y="366" width="400" height="8" fill={p.wall2} />
      <path d="M0 394 H400 M0 418 H400 M0 446 H400 M0 478 H400" stroke={p.ink} strokeOpacity="0.12" strokeWidth="1.5" />

      {/* picture frames */}
      <g opacity="0.9">
        <rect x={frameX} y="112" width="50" height="66" rx="3" fill={p.accent} />
        <rect x={frameX + 6} y="118" width="38" height="54" rx="2" fill={p.sun} opacity="0.5" />
        <circle cx={frameX + 25} cy="150" r="11" fill={p.accent} />
      </g>

      {/* window */}
      <g clipPath={`url(#${id("win")})`}>
        <rect x={box.x} y={box.y} width={box.w} height={box.h} fill={`url(#${id("sky")})`} />
        <circle className="scene__sun" cx={sunX} cy={sunY} r="30" fill={p.sun} />
        <g fill={p.ink} opacity="0.22">
          {far.map((b, i) => (
            <rect key={i} x={b.x} y={r1(baseY - 20 - b.h)} width={b.w} height={b.h + 24} />
          ))}
        </g>
        <g fill={p.ink} opacity="0.4">
          {near.map((b, i) => (
            <rect key={i} x={b.x} y={r1(baseY - 4 - b.h)} width={b.w} height={b.h + 8} />
          ))}
        </g>
      </g>
      <path d={win.d} fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="8" />
      <path d={win.bars} stroke="#fff" strokeOpacity="0.7" strokeWidth="4" clipPath={`url(#${id("win")})`} />

      {/* light on the floor */}
      <polygon
        className="scene__beam"
        points={`${box.x + 14},${baseY} ${box.x + box.w - 14},${baseY} ${box.x + box.w + shift + 70},500 ${box.x + shift - 70},500`}
        fill={`url(#${id("beam")})`}
      />

      <ellipse cx="200" cy="448" rx="150" ry="22" fill={p.accent} opacity="0.3" />
      <Furniture kind={art.furn} p={p} />

      {/* plant */}
      <g>
        <path d="M18 374 L50 374 L45 416 L23 416 Z" fill={p.ink} opacity="0.7" />
        <g fill="#5C7A52">
          <ellipse cx="34" cy="338" rx="9" ry="30" transform="rotate(-24 34 366)" />
          <ellipse cx="34" cy="336" rx="9" ry="32" />
          <ellipse cx="34" cy="338" rx="9" ry="30" transform="rotate(24 34 366)" />
        </g>
        <ellipse cx="34" cy="344" rx="8" ry="26" fill="#7C9A6A" transform="rotate(-48 34 370)" />
      </g>

      <rect width="400" height="500" fill={`url(#${id("vig")})`} />
    </svg>
  );
}
