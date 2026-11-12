import settings from "@/content/settings.json";
import locationsData from "@/content/locations.json";

export type HoursRow = {
  days: string;
  hours: string;
  note?: string;
};

export type SchemaHours = {
  days: string[];
  opens: string;
  closes: string;
};

export type LocationRecord = {
  id: string;
  name: string;
  neighborhood: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  mapsQuery: string;
  hours: HoursRow[];
  note?: string;
  schemaHours: SchemaHours[];
};

export type Location = LocationRecord & {
  phoneHref: string;
};

/*
  Global copy for the header, footer and structured data lives in
  /src/content/settings.json and /src/content/locations.json so the restaurant
  can edit it in the CMS without touching code.
*/
export const siteConfig = settings;
export const nav = settings.nav;
export const highlights = settings.highlights;
export const labels = settings.labels;
export const footerContent = settings.footer;
export const notFoundContent = settings.notFound;

function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "").slice(-10);
  return `tel:+1${digits}`;
}

export const locations: Location[] = (
  locationsData.locations as LocationRecord[]
).map((location) => ({
  ...location,
  phoneHref: telHref(location.phone),
}));

export function fullAddress(location: Location) {
  return `${location.street}, ${location.city}, ${location.state} ${location.postalCode}`;
}

export function mapsHref(location: Location) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    location.mapsQuery,
  )}`;
}

export function mapsEmbedHref(location: Location) {
  return `https://www.google.com/maps?q=${encodeURIComponent(
    location.mapsQuery,
  )}&output=embed`;
}
