/**
 * Central business + site configuration.
 * Every piece of business data rendered on the site comes from here —
 * only information verified from Moss Landscaping's existing website/Instagram.
 */

function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProd) return `https://${vercelProd}`;
  return "https://moss-landscaping-demo.vercel.app";
}

export const contactInfo = {
  phone: "908-725-7536",
  phoneHref: "tel:+19087257536",
  email: "mnursery@comcast.net",
  emailHref: "mailto:mnursery@comcast.net?subject=Landscaping%20Estimate%20Request",
  website: "mosslandscapingnjusa.com",
  websiteUrl: "https://mosslandscapingnjusa.com",
} as const;

export const siteConfig = {
  name: "Moss Landscaping",
  legalName: "Moss Landscaping Inc.",
  url: resolveSiteUrl(),
  region: "New Jersey",
  yearsInBusiness: 34,
  tagline: "Extraordinary Outdoor Living, Built to Last",
  /**
   * Concept/demo mode:
   *  - shows the small "Website Concept" line
   *  - marks the site noindex so it never competes with the live site in search
   *  - the estimate endpoint returns a mock success instead of dispatching
   * Set to false at launch.
   */
  conceptMode: true,
  conceptLabel: "Website Concept for Moss Landscaping",
  imageryNote: "Concept imagery shown — final site will feature Moss project photography.",
  nav: [
    { label: "Home", href: "/#top" },
    { label: "About", href: "/#about" },
    { label: "Services", href: "/#services" },
    { label: "Gallery", href: "/#gallery" },
    { label: "Service Areas", href: "/#service-areas" },
    { label: "Contact", href: "/#contact" },
  ],
  estimateHref: "/#estimate",
} as const;

export const seoMetadata = {
  title: "Moss Landscaping | Landscape Design, Hardscapes & Outdoor Living in New Jersey",
  shortTitle: "Moss Landscaping — Extraordinary Outdoor Living",
  titleTemplate: "%s | Moss Landscaping",
  description:
    "Custom landscape design, hardscape installation, and outdoor living spaces for residential and commercial properties across New Jersey. Request a free estimate from Moss Landscaping.",
  ogDescription:
    "Landscape design, hardscapes, outdoor kitchens and outdoor living spaces across New Jersey. 34+ years of experience. Request a free estimate.",
  ogImage: {
    path: "/og-moss-landscaping.jpg",
    width: 1200,
    height: 630,
    alt: "Moss Landscaping — Extraordinary Outdoor Living. Landscape Design, Hardscapes, Outdoor Living.",
  },
  keywords: [
    "landscaping New Jersey",
    "landscape design NJ",
    "hardscape contractor NJ",
    "outdoor living NJ",
    "patio installation NJ",
    "retaining walls NJ",
    "commercial landscaping NJ",
  ],
  locale: "en_US",
  themeColor: "#0b141c",
} as const;
