import CostCalculator from "./CostCalculator";
import Reveal from "./Reveal";
import { Check } from "./Icons";
import { agencyFeeLabel } from "@/lib/costs";

const LINES = [
  { t: "Monthly rent", d: "Shown on every listing. Utilities are billed separately unless a listing says otherwise." },
  { t: "Refundable deposit", d: "Usually one month’s rent, sometimes two. Always stated before you book a viewing." },
  { t: "Agency fee", d: `A one-off ${agencyFeeLabel}, paid only once your lease is signed.` },
  { t: "Viewings & shortlists", d: "Free — in person or on video, as many as you need." },
];

export default function Pricing() {
  return (
    <section id="pricing" className="pricing" aria-labelledby="pricing-title">
      <div className="container pricing__grid">
        <Reveal className="pricing__copy">
          <p className="eyebrow">Costs</p>
          <h2 id="pricing-title" className="h2">Know the total <em>before</em> you ask.</h2>
          <p className="lede">No surprise line items. Here’s everything a tenancy with us involves.</p>
          <ul className="pricing__lines">
            {LINES.map((l) => (
              <li key={l.t}>
                <Check className="pricing__check" />
                <div>
                  <h3>{l.t}</h3>
                  <p>{l.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <CostCalculator />
        </Reveal>
      </div>
    </section>
  );
}
