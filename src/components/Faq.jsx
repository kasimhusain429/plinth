import Reveal from "./Reveal";
import { agencyFeeLabel } from "@/lib/costs";

const FAQ = [
  { q: "How much is the deposit?", a: "Most homes ask for one month’s rent as a refundable deposit; some larger or furnished homes ask for two. The amount is shown on every listing and written into your lease." },
  { q: "Is there an agency fee?", a: `Tenants pay a one-off fee of ${agencyFeeLabel}, only once a lease is signed. Viewings and shortlists are free.` },
  { q: "Can I view a home remotely?", a: "Yes. Choose a video viewing when you book and an agent will walk you through the home live, answering questions as you go." },
  { q: "How long do I have to rent for?", a: "Every listing shows its minimum term, from three months to a year. Longer leases are usually very welcome." },
  { q: "Can I bring a pet?", a: "Many homes are pet-friendly — switch on the pets filter to see them. A landlord may ask for a small additional deposit." },
  { q: "What do I need to apply?", a: "A valid ID, proof of income or employment, and a short note about who will be living in the home." },
  { q: "I own a property. Can you let it for me?", a: "Yes. We handle the listing, viewings, tenant checks, lease and handover. Send us the details from the contact page." },
];

export default function Faq() {
  return (
    <section id="faq" className="faq" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <Reveal className="faq__head">
          <p className="eyebrow">Good questions</p>
          <h2 id="faq-title" className="h2">Things people <em>ask us.</em></h2>
        </Reveal>
        <div className="faq__list">
          {FAQ.map((f) => (
            <details key={f.q} className="faq__item">
              <summary>
                <span>{f.q}</span>
                <i aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
