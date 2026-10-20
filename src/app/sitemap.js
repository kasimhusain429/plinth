import { site } from "@/data/site";
import { listings } from "@/data/listings";

export default function sitemap() {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, priority: 1 },
    { url: `${site.url}/listings`, lastModified: now, priority: 0.9 },
    { url: `${site.url}/contact`, lastModified: now, priority: 0.6 },
    ...listings.map((l) => ({ url: `${site.url}/listings/${l.slug}`, lastModified: now, priority: 0.8 })),
  ];
}
