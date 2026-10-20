import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Statement from "@/components/Statement";
import FeaturedRail from "@/components/FeaturedRail";
import Ways from "@/components/Ways";
import Neighborhoods from "@/components/Neighborhoods";
import Pricing from "@/components/Pricing";
import Process from "@/components/Process";
import Faq from "@/components/Faq";
import HomeCta from "@/components/HomeCta";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Statement />
      <FeaturedRail />
      <Ways />
      <Neighborhoods />
      <Pricing />
      <Process />
      <Faq />
      <HomeCta />
    </>
  );
}
