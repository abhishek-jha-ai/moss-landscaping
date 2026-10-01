import { contactInfo, seoMetadata, siteConfig } from "@/data/site";
import { serviceAreas, stateAbbr } from "@/data/serviceAreas";
import { services } from "@/data/services";

/** LandscapingBusiness JSON-LD built only from verified business data. */
export function businessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LandscapingBusiness",
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    description: seoMetadata.description,
    url: siteConfig.url,
    sameAs: [contactInfo.websiteUrl],
    telephone: `+1-${contactInfo.phone}`,
    email: contactInfo.email,
    image: `${siteConfig.url}${seoMetadata.ogImage.path}`,
    logo: `${siteConfig.url}/icon.png`,
    areaServed: serviceAreas.map((a) => ({
      "@type": "City",
      name: `${a.name}, ${stateAbbr}`,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Landscaping Services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.summary },
      })),
    },
  };
}
