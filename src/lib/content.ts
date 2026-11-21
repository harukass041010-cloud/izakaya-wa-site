import homeJson from "@/content/pages/home.json";
import aboutJson from "@/content/pages/about.json";
import menuJson from "@/content/pages/menu.json";
import galleryJson from "@/content/pages/gallery.json";
import reservationsJson from "@/content/pages/reservations.json";
import contactJson from "@/content/pages/contact.json";
import menuCreditsJson from "@/content/menu-credits.json";

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
  /* Optional background video (e.g. /videos/hero.mp4); the photo is the fallback. */
  video?: string;
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
  /* Display price, including the currency symbol, e.g. "$5", "$4.5 / $18" or "MKT". */
  price?: string;
  signature?: boolean;
  tags?: string[];
  image?: ImageRef;
};

export type MenuSection = {
  /* CMS-only marker: "with_photos" or "no_photos". Ignored by the site. */
  type?: string;
  id: string;
  title: string;
  japanese: string;
  blurb: string;
  /* Photos shown beside this section's dish list (a small grid). */
  photos?: ImageRef[];
  dishes: Dish[];
};

/* One meal — Lunch, Dinner or Drinks — shown as a tab on the menu page. */
export type MenuTab = {
  id: string;
  label: string;
  japanese: string;
  hours: string;
  blurb: string;
  /* Photos shown in the grid at the top of the tab. */
  openingPhotos?: ImageRef[];
  sections: MenuSection[];
};

/* A dish card on the home page. Kept separate from the menu so the home page
   can show a handful of highlights without duplicating the full menu. */
export type FeaturedDish = {
  name: string;
  japanese?: string;
  description: string;
  image: ImageRef;
};

export type MenuContent = {
  seo: Seo;
  hero: Hero;
  notice: { label: string; text: string };
  locationNote: string;
  menus: MenuTab[];
  featured: FeaturedDish[];
  cta: {
    eyebrow: string;
    title: string;
    intro: string;
    callLabels: string[];
    request: Cta;
  };
};

/* Credit fields are only present for borrowed placeholder photos. Photos the
   restaurant uploads in the CMS don't have them. */
export type GalleryPhoto = ImageRef & {
  credit?: string;
  license?: string;
  href?: string;
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
    message: string;
  };
  placeholders: {
    name: string;
    phone: string;
    email: string;
    message: string;
  };
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
  };
};

export type ReservationsContent = {
  seo: Seo;
  hero: Hero;
  /* The loud "reservations are by phone only" notice at the top of the page. */
  phoneOnly: { badge: string; title: string; text: string };
  intro: { eyebrow: string; title: string; paragraph: string };
  form: {
    title: string;
    intro: string;
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

/* Attribution for the placeholder menu photography. Kept out of the CMS so the
   client's editing screens stay clean; the gallery page lists these credits. */
export type PhotoCredit = { credit: string; license: string; href: string };
export const menuPhotoCredits = menuCreditsJson as PhotoCredit[];

/* Dishes highlighted on the home page, in the order set in the CMS. */
export const featuredDishes = menuContent.featured;
