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

export const agents = [
  {
    name: "Milica Radović",
    role: "Head of Leasing",
    email: "milica@plinth.example",
    phone: "+381 11 321 001",
    image: "/images/agents/milica.jpg",
    bio: "Specializing in Old Belgrade lofts and historic apartments across Dorćol and Vračar.",
  },
  {
    name: "Nikola Jovanović",
    role: "Managing Director",
    email: "nikola@plinth.example",
    phone: "+381 11 321 002",
    image: "/images/agents/nikola.jpg",
    bio: "Guiding international relocations and premium long-term residential leases.",
  },
  {
    name: "Ana Petrović",
    role: "Tenancy Advisor",
    email: "ana@plinth.example",
    phone: "+381 11 321 003",
    image: "/images/agents/ana.jpg",
    bio: "Expert on flexible stays, furnished properties, and smooth handover days.",
  },
  {
    name: "Marko Ilić",
    role: "Property Specialist",
    email: "marko@plinth.example",
    phone: "+381 11 321 004",
    image: "/images/agents/marko.jpg",
    bio: "Dedicated viewing specialist for Senjak villas and New Belgrade residences.",
  },
];

export const editorialPhotos = [
  { src: "/images/editorial/editorial-1.jpg", caption: "Natural stone, lime wash and morning light" },
  { src: "/images/editorial/editorial-2.jpg", caption: "Tall arched windows on historic avenues" },
  { src: "/images/editorial/editorial-3.jpg", caption: "Curated architectural details in every room" },
  { src: "/images/editorial/editorial-4.jpg", caption: "Quiet terraces high above the city canopy" },
];

export const navLinks = [
  { href: "/listings", label: "Rentals" },
  { href: "/#ways", label: "Ways to rent" },
  { href: "/#areas", label: "Neighborhoods" },
  { href: "/#pricing", label: "Costs" },
  { href: "/#process", label: "How it works" },
  { href: "/contact", label: "Contact" },
];
