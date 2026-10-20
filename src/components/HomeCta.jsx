import Link from "next/link";
import InquiryForm from "./InquiryForm";
import Reveal from "./Reveal";
import { site } from "@/data/site";

export default function HomeCta() {
  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="container cta__grid">
        <Reveal className="cta__copy">
          <p className="eyebrow eyebrow--light">Let’s find it</p>
          <h2 id="cta-title" className="h2">Tell us what you need. We’ll come back with <em>homes</em>.</h2>
          <p className="lede">
            Prefer to talk? Call <a href={site.phoneHref}>{site.phone}</a> or{" "}
            <Link href="/contact">use the full contact form</Link>.
          </p>
        </Reveal>
        <Reveal className="cta__form" delay={0.1}>
          <InquiryForm mode="compact" id="home-inquiry" />
        </Reveal>
      </div>
    </section>
  );
}
