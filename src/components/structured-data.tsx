import { locations, siteConfig } from "@/lib/site";

/*
  Restaurant structured data (schema.org) so search engines can surface
  addresses, hours and phone numbers for both locations.
*/
export function StructuredData() {
  const graph = locations.map((location) => ({
    "@type": "Restaurant",
    "@id": `${siteConfig.url}/#${location.id}`,
    name: `${siteConfig.name} — ${location.name}`,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: location.phone,
    priceRange: siteConfig.priceRange,
    servesCuisine: siteConfig.cuisines,
    image: `${siteConfig.url}/images/hero-sushi-platter.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: location.street,
      addressLocality: location.city,
      addressRegion: location.state,
      postalCode: location.postalCode,
      addressCountry: "US",
    },
    areaServed: "Houston, TX",
    sameAs: [siteConfig.social.instagram, siteConfig.social.facebook],
    openingHoursSpecification: location.schemaHours.map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: slot.days,
      opens: slot.opens,
      closes: slot.closes,
    })),
  }));

  const json = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
