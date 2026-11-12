import homeJson from "@/content/pages/home.json";
import aboutJson from "@/content/pages/about.json";
import menuJson from "@/content/pages/menu.json";
import galleryJson from "@/content/pages/gallery.json";
import reservationsJson from "@/content/pages/reservations.json";
import contactJson from "@/content/pages/contact.json";

/*
  All page copy and photography lives in /src/content as JSON. These files are
  edited through the CMS at /admin; the site reads them at build time, so a
  publish in the CMS rebuilds and redeploys the static site.
*/

export type ImageRef = {
  src: string;
  alt: string;
};

export type Cta = {
  label: string;
  href: string;
};

export type Seo = {
  title: string;
  description: string;
};

export type Hero = {
  eyebrow: string;
  title: string;
  intro: string;
  image: ImageRef;
};

export type HomeContent = {
  seo: Seo;
  hero: Hero & { primaryCta: Cta; secondaryCta: Cta };
  philosophy: {
    eyebrow: string;
    kanji: string;
    title: string;
    body: string[];
    cta: Cta;
    images: ImageRef[];
  };
  signature: {
    eyebrow: string;
    title: string;
    intro: string;
    cta: Cta;
  };
  experience: {
    eyebrow: string;
    title: string;
    intro: string;
    items: Array<{
      japanese: string;
      title: string;
      copy: string;
      image: ImageRef;
    }>;
  };
  locations: {
    eyebrow: string;
    title: string;
    intro: string;
  };
  cta: {
    eyebrow: string;
    title: string;
    body: string;
    primary: Cta;
    secondary: Cta;
  };
};

export type AboutContent = {
  seo: Seo;
  hero: Hero;
  story: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    stats: Array<{ value: string; label: string }>;
    images: ImageRef[];
  };
  values: {
    eyebrow: string;
    title: string;
    items: Array<{ title: string; copy: string }>;
  };
  locations: {
    eyebrow: string;
    title: string;
    intro: string;
    cta: Cta;
  };
};

export type Dish = {
  name: string;
  japanese?: string;
  description: string;
  signature?: boolean;
  featured?: boolean;
  featuredOrder?: number;
  tags?: string[];
  image?: ImageRef;
};

export type MenuSection = {
  id: string;
  title: string;
  japanese: string;
  blurb: string;
  dishes: Dish[];
};

export type MenuContent = {
  seo: Seo;
  hero: Hero;
  notice: { label: string; text: string };
  sections: MenuSection[];
  cta: {
    eyebrow: string;
    title: string;
    intro: string;
    callLabels: string[];
    request: Cta;
  };
};

export type GalleryPhoto = ImageRef & {
  credit: string;
  license: string;
  href: string;
};

export type GalleryContent = {
  seo: Seo;
  hero: Hero;
  photos: GalleryPhoto[];
  credits: { eyebrow: string; title: string; intro: string };
};

export type ReservationCopy = {
  labels: {
    name: string;
    phone: string;
    email: string;
    location: string;
    partySize: string;
    date: string;
    time: string;
    notes: string;
  };
  placeholders: {
    name: string;
    phone: string;
    email: string;
    notes: string;
  };
  locationPlaceholder: string;
  timePlaceholder: string;
  guestSingular: string;
  guestPlural: string;
  largeParty: string;
  lunchGroup: string;
  dinnerGroup: string;
  submit: string;
  submitting: string;
  disclaimer: string;
  successKanji: string;
  successTitle: string;
  successMessage: string;
  successNote: string;
  validationMessage: string;
  missingKeyMessage: string;
  sendErrorMessage: string;
  errors: {
    name: string;
    phone: string;
    email: string;
    location: string;
    date: string;
    time: string;
    partySize: string;
  };
};

export type ReservationsContent = {
  seo: Seo;
  hero: Hero;
  intro: { eyebrow: string; title: string; paragraph: string };
  form: {
    title: string;
    intro: string;
    lunchTimes: string[];
    dinnerTimes: string[];
    copy: ReservationCopy;
  };
  faqs: Array<{ question: string; answer: string }>;
  closing: { text: string; callPrefix: string };
};

export type ContactContent = {
  seo: Seo;
  hero: Hero;
  labels: {
    address: string;
    phone: string;
    hours: string;
    directions: string;
    reserve: string;
  };
  social: {
    eyebrow: string;
    title: string;
    intro: string;
    instagramTitle: string;
    instagramBody: string;
    facebookTitle: string;
    facebookBody: string;
    callTitle: string;
  };
};

export const homeContent = homeJson as HomeContent;
export const aboutContent = aboutJson as AboutContent;
export const menuContent = menuJson as MenuContent;
export const galleryContent = galleryJson as GalleryContent;
export const reservationsContent = reservationsJson as ReservationsContent;
export const contactContent = contactJson as ContactContent;

/* Dishes flagged for the home page, in the order set in the CMS. */
export const featuredDishes = menuContent.sections
  .flatMap((section) => section.dishes)
  .filter((dish) => dish.featured && dish.image)
  .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));
