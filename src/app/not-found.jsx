import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <PageHero eyebrow="404" title="This door doesn’t open.">
        <p>The page you’re looking for has moved or never existed. Let’s get you somewhere useful.</p>
      </PageHero>
      <section className="section">
        <div className="container notfound__actions">
          <Link href="/listings" className="btn btn--ink"><span>Browse rentals</span></Link>
          <Link href="/" className="btn btn--outline"><span>Back to home</span></Link>
        </div>
      </section>
    </>
  );
}
