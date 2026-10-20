import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import ListingsExplorer from "@/components/ListingsExplorer";
import ListingCard from "@/components/ListingCard";
import { listings } from "@/data/listings";
import { site } from "@/data/site";

export const metadata = {
  title: "Apartments, lofts & houses to rent",
  description: `Browse ${listings.length} furnished and unfurnished homes to rent in ${site.city}. Filter by neighborhood, bedrooms, budget and more.`,
  alternates: { canonical: "/listings" },
};

export default function ListingsPage() {
  return (
    <>
      <PageHero eyebrow={`Rentals · ${site.city}`} title="Find your place.">
        <p>
          Filter by neighborhood, size and budget. Every listing shows the full move-in cost.
          {site.showDemoNotice ? " (Sample listings for demonstration.)" : ""}
        </p>
      </PageHero>
      {/* The explorer reads the URL on the client, so crawlers (and the first paint) get the full list from this fallback. */}
      <Suspense
        fallback={
          <div className="explorer">
            <div className="container explorer__static">
              <ul className="grid">
                {listings.map((l) => (
                  <li key={l.slug}>
                    <ListingCard listing={l} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        }
      >
        <ListingsExplorer />
      </Suspense>
    </>
  );
}
