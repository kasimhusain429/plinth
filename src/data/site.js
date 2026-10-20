// Single source of truth for brand + contact details.
// Everything here is sample content — replace it with the agency's real details.
export const site = {
  name: "Plinth",
  tagline: "Homes to rent in Belgrade",
  description:
    "Plinth is a Belgrade rental agency. Browse furnished and unfurnished apartments, lofts and houses to rent, see the full move-in cost up front and book a viewing in person or on video.",
  city: "Belgrade",
  country: "RS",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  email: "hello@plinth.example",
  phone: "+381 11 000 0000",
  phoneHref: "tel:+381110000000",
  hours: "Mon–Fri 09:00–18:00 · Sat 10:00–14:00",
  office: "Meetings and viewings by appointment · Belgrade",
  // Shows a small “sample listings” note. Set to false once real listings are in.
  showDemoNotice: true,
  fees: {
    agencyFeeMonths: 0.5, // one-off, paid by the tenant when a lease is signed
    defaultDepositMonths: 1,
  },
};

export const navLinks = [
  { href: "/listings", label: "Rentals" },
  { href: "/#ways", label: "Ways to rent" },
  { href: "/#areas", label: "Neighborhoods" },
  { href: "/#pricing", label: "Costs" },
  { href: "/#process", label: "How it works" },
  { href: "/contact", label: "Contact" },
];
