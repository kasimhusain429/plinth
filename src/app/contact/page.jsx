import PageHero from "@/components/PageHero";
import InquiryForm from "@/components/InquiryForm";
import { site } from "@/data/site";

export const metadata = {
  title: "Contact & inquiries",
  description: `Talk to a ${site.name} agent in ${site.city}: ask about a home, book a viewing, or list your property for rent.`,
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }) {
  const { topic } = await searchParams;
  return (
    <>
      <PageHero eyebrow="Contact" title="Let’s talk homes.">
        <p>Tell us what you’re looking for — or what you’d like to let — and an agent will reply personally.</p>
      </PageHero>

      <section className="section contact">
        <div className="container contact__grid">
          <div className="contact__form">
            <InquiryForm mode="general" defaultTopic={Array.isArray(topic) ? topic[0] : topic} id="contact-form" />
          </div>
          <aside className="contact__info">
            <h2 className="h3">Reach us directly</h2>
            <dl>
              <div><dt>Phone</dt><dd><a href={site.phoneHref}>{site.phone}</a></dd></div>
              <div><dt>Email</dt><dd><a href={`mailto:${site.email}`}>{site.email}</a></dd></div>
              <div><dt>Hours</dt><dd>{site.hours}</dd></div>
              <div><dt>Office</dt><dd>{site.office}</dd></div>
            </dl>
            <p className="muted">
              Own a property? Choose “I want to list my property” and we’ll talk through listing, tenant checks and
              handover.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
