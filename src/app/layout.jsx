import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";
import "./sections.css";
import { site } from "@/data/site";
import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const display = Fraunces({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-fraunces",
});

const sans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-instrument",
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Apartments, lofts & houses to rent in ${site.city}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — Homes to rent in ${site.city}`,
    description: site.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name} rental agency` }],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport = {
  themeColor: "#16120F",
  width: "device-width",
  initialScale: 1,
};

// Runs before first paint: flags JS, and skips the preloader for repeat visits
// and for people who prefer reduced motion.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(rm||sessionStorage.getItem('plinth-seen')){d.classList.add('no-preload','is-ready')}}catch(e){d.classList.add('no-preload','is-ready')}})();`;

const agencyJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: site.name,
  url: site.url,
  email: site.email,
  telephone: site.phone,
  description: site.description,
  address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: site.country },
  areaServed: site.city,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Preloader />
        <SmoothScroll />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(agencyJsonLd) }} />
      </body>
    </html>
  );
}
