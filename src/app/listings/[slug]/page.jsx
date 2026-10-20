import Link from "next/link";
import { notFound } from "next/navigation";
import ListingGallery from "@/components/ListingGallery";
import ListingCard from "@/components/ListingCard";
import InquiryForm from "@/components/InquiryForm";
import { Check } from "@/components/Icons";
import { listings, listingBySlug } from "@/data/listings";
import { areaBySlug } from "@/data/areas";
import { site } from "@/data/site";
import { moveInCosts, agencyFeeLabel } from "@/lib/costs";
import { bathsLabel, bedsLabel, floorLabel, money } from "@/lib/format";

export function generateStaticParams() {
  return listings.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const l = listingBySlug[slug];
  if (!l) return { title: "Home not found" };
  const area = areaBySlug[l.area];
  return {
    title: `${l.title} — ${bedsLabel(l.beds)} to rent in ${area.name}`,
    description: `${l.blurb} ${bedsLabel(l.beds)}, ${l.size} m², ${money(l.rent)} per month in ${area.name}, ${site.city}.`,
    alternates: { canonical: `/listings/${l.slug}` },
  };
}

export default async function ListingPage({ params }) {
  const { slug } = await params;
  const l = listingBySlug[slug];
  if (!l) notFound();

  const area = areaBySlug[l.area];
  const costs = moveInCosts(l.rent, l.depositMonths);
  const similar = listings
    .filter((x) => x.slug !== l.slug)
    .map((x) => ({ x, score: (x.area === l.area ? 2 : 0) + (x.beds === l.beds ? 1 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.x);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Apartment",
    name: l.title,
    description: l.description,
    url: `${site.url}/listings/${l.slug}`,
    numberOfBedrooms: l.beds,
    numberOfBathroomsTotal: l.baths,
    floorSize: { "@type": "QuantitativeValue", value: l.size, unitCode: "MTK" },
    petsAllowed: l.pets,
    address: { "@type": "PostalAddress", addressLocality: area.name, addressRegion: site.city, addressCountry: site.country },
    offers: {
      "@type": "Offer",
      price: l.rent,
      priceCurrency: "EUR",
      priceSpecification: { "@type": "UnitPriceSpecification", price: l.rent, priceCurrency: "EUR", unitText: "MONTH" },
    },
  };

  const facts = [
    ["Bedrooms", bedsLabel(l.beds)],
    ["Bathrooms", bathsLabel(l.baths)],
    ["Size", `${l.size} m²`],
    ["Floor", floorLabel(l.floor)],
    ["Furnishing", l.furnished ? "Furnished" : "Unfurnished"],
    ["Pets", l.pets ? "Welcome" : "Not allowed"],
    ["Parking", l.parking ? "Included" : "Not included"],
    ["Minimum term", `${l.minTermMonths} months`],
  ];

  return (
    <article className="detail">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container detail__top">
        <nav aria-label="Breadcrumb" className="crumbs">
          <Link href="/listings">Rentals</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/listings?area=${area.slug}`}>{area.name}</Link>
        </nav>
        <div className="detail__title-row">
          <div>
            <p className="eyebrow">{l.type} · {area.name}</p>
            <h1 className="detail__title">{l.title}</h1>
          </div>
          <p className="detail__price">
            {money(l.rent)}
            <small>per month</small>
          </p>
        </div>
      </div>

      <div className="container detail__layout">
        <div className="detail__main">
          <ListingGallery listing={l} />

          <p className="detail__lede">{l.blurb}</p>
          <p className="detail__text">{l.description}</p>

          <h2 className="h3">At a glance</h2>
          <dl className="facts">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <h2 className="h3">What’s included</h2>
          <ul className="features">
            {l.features.map((f) => (
              <li key={f}><Check /> {f}</li>
            ))}
            {l.balcony && !l.features.some((f) => /balcon|terrace/i.test(f)) && <li><Check /> Balcony</li>}
          </ul>

          <h2 className="h3">Cost to move in</h2>
          <table className="costs">
            <tbody>
              <tr><th scope="row">First month’s rent</th><td>{money(costs.firstMonth)}</td></tr>
              <tr><th scope="row">Refundable deposit ({l.depositMonths} month{l.depositMonths > 1 ? "s" : ""})</th><td>{money(costs.deposit)}</td></tr>
              <tr><th scope="row">Agency fee ({agencyFeeLabel}, once)</th><td>{money(costs.agencyFee)}</td></tr>
            </tbody>
            <tfoot>
              <tr><th scope="row">Due at signing</th><td>{money(costs.total)}</td></tr>
            </tfoot>
          </table>
          <p className="muted">Available {l.available === "Now" ? "now" : `from ${l.available}`}. Utilities are billed separately.</p>
        </div>

        <aside className="detail__aside" id="viewing" aria-label="Book a viewing">
          <div className="booking">
            <h2 className="booking__title">Book a viewing</h2>
            <p className="booking__sub">In person or on video. Free, no obligation.</p>
            <InquiryForm mode="viewing" listing={l} id="viewing-form" />
          </div>
        </aside>
      </div>

      <section className="container similar" aria-labelledby="similar-title">
        <h2 id="similar-title" className="h3">You might also like</h2>
        <ul className="grid grid--3">
          {similar.map((s) => (
            <li key={s.slug}><ListingCard listing={s} /></li>
          ))}
        </ul>
      </section>

      <div className="mbar">
        <p><strong>{money(l.rent)}</strong><small>/mo</small></p>
        <a href="#viewing" className="btn btn--clay"><span>Book a viewing</span></a>
      </div>
    </article>
  );
}
