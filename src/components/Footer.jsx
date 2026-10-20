import Link from "next/link";
import { site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__lead">
          <p className="footer__kicker">Looking for a place to rent?</p>
          <Link href="/listings" className="footer__big-link">
            Browse every home →
          </Link>
        </div>

        <nav aria-label="Rent" className="footer__col">
          <h2 className="footer__h">Rent</h2>
          <ul>
            <li><Link href="/listings">All rentals</Link></li>
            <li><Link href="/listings?furnished=1">Furnished homes</Link></li>
            <li><Link href="/listings?pets=1">Pet-friendly</Link></li>
            <li><Link href="/listings?beds=0">Studios</Link></li>
          </ul>
        </nav>

        <nav aria-label="Agency" className="footer__col">
          <h2 className="footer__h">Agency</h2>
          <ul>
            <li><Link href="/#ways">Ways to rent</Link></li>
            <li><Link href="/#areas">Neighborhoods</Link></li>
            <li><Link href="/#pricing">Costs</Link></li>
            <li><Link href="/#faq">FAQ</Link></li>
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="footer__h">Talk to us</h2>
          <ul>
            <li><a href={site.phoneHref}>{site.phone}</a></li>
            <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
            <li>{site.hours}</li>
            <li><Link href="/contact?topic=landlord">List your property</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer__word" aria-hidden="true">
        {site.name}
      </div>

      <div className="container footer__legal">
        <p>© {new Date().getFullYear()} {site.name} Rentals. All rights reserved.</p>
        {site.showDemoNotice && <p>Listings, prices and contact details are sample content.</p>}
      </div>
    </footer>
  );
}
