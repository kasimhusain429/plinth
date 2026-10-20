// "en-US" is pinned so server and browser always print identical strings.
export const money = (n) => `€${Math.round(n).toLocaleString("en-US")}`;

export const bedsLabel = (b) => (b === 0 ? "Studio" : `${b} bed${b > 1 ? "s" : ""}`);

export const bathsLabel = (b) => `${b} bath${b > 1 ? "s" : ""}`;

export const floorLabel = (f) => (f === 0 ? "Ground floor" : `Floor ${f}`);
