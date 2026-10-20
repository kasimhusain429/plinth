// x / y place each pin on the stylised neighbourhood map (0–100 / 0–70).
export const areas = [
  { slug: "zemun", name: "Zemun", x: 21, y: 22, blurb: "A village-like old town on the Danube, with the quay on your doorstep." },
  { slug: "novi-beograd", name: "New Belgrade", x: 31, y: 38, blurb: "Wide boulevards, riverside parks and modern towers close to the business districts." },
  { slug: "savamala", name: "Savamala", x: 58, y: 43, blurb: "The creative riverside quarter — galleries, bars and brick-arch lofts." },
  { slug: "dorcol", name: "Dorćol", x: 74, y: 40, blurb: "Old-town streets, cafés and the fortress park right next door." },
  { slug: "vracar", name: "Vračar", x: 70, y: 56, blurb: "Leafy, walkable and lived-in: market stalls, bookshops and long boulevards." },
  { slug: "senjak", name: "Senjak", x: 44, y: 58, blurb: "Quiet, green and residential, with villas, parkland and room to breathe." },
];

export const areaBySlug = Object.fromEntries(areas.map((a) => [a.slug, a]));
