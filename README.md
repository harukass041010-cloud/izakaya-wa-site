# Izakaya WA — website

A multi-page marketing website for **Izakaya WA**, a Japanese-owned izakaya with
two locations in Houston, Texas.

Built with [Next.js](https://nextjs.org) (App Router) and
[Tailwind CSS](https://tailwindcss.com). It includes a home page, menu, about,
gallery, reservations and contact pages, plus a responsive header/footer, SEO
metadata and a restaurant structured-data (JSON-LD) block.

The site is a **static website**: `npm run build` produces plain HTML/CSS/JS in
`out/`, which is hosted for free (Cloudflare Pages) with **no server or
database**. All of the text and photography is edited by the restaurant through
a built-in, no-code content manager at **`/admin`** (Sveltia CMS).

> **Before launch:** the menu, photography, domain and contact details in this
> project are **placeholders / representative content**. See
> [Content to replace before launch](#content-to-replace-before-launch) and
> [Image credits](#image-credits) below.

---

## Tech stack

| Area       | Choice                                                         |
| ---------- | -------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack, React 19)                   |
| Styling    | Tailwind CSS v4 (design tokens in `src/app/globals.css`)       |
| Language   | TypeScript                                                     |
| Fonts      | Shippori Mincho (display) + Zen Kaku Gothic New (body)         |
| Output     | Static export (`output: "export"` → `out/`)                    |
| Content    | JSON files in `src/content/`, edited via Sveltia CMS at `/admin` |
| CMS        | [Sveltia CMS](https://sveltiacms.app) (git-based, free, MIT)   |
| Forms      | [Web3Forms](https://web3forms.com) (static-friendly form → email) |

## Getting started

Requires Node.js 20+ (developed on Node 26).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command           | Description                                              |
| ----------------- | -------------------------------------------------------- |
| `npm run dev`     | Start the development server                             |
| `npm run build`   | Build the static site into `out/`                        |
| `npm run preview` | Serve the built `out/` folder locally (run build first)  |
| `npm run lint`    | Run ESLint                                               |

> With static export there is no `next start`. To preview the production build
> locally, run `npm run build` then `npm run preview` (or `npx serve out`).

## Project structure

```
src/
├─ app/
│  ├─ layout.tsx              # Root layout: fonts, metadata, header/footer, JSON-LD
│  ├─ page.tsx                # Home
│  ├─ menu/page.tsx           # Menu
│  ├─ about/page.tsx          # About
│  ├─ gallery/page.tsx        # Gallery (+ visible image credits)
│  ├─ reservations/
│  │  ├─ page.tsx             # Reservations
│  │  └─ reservation-form.tsx # Client form → Web3Forms
│  ├─ contact/page.tsx        # Contact
│  ├─ not-found.tsx           # 404
│  ├─ sitemap.ts / robots.ts  # SEO routes
│  ├─ icon.svg                # Favicon
│  └─ globals.css             # Tailwind theme + design tokens
├─ components/                # Header, footer, hero, photo, logo, seigaiha, …
├─ content/                   # ← All editable content lives here (JSON)
│  ├─ settings.json           # Name, nav, footer, buttons, 404 text
│  ├─ locations.json          # Addresses, phones, hours (both locations)
│  └─ pages/                  # home, menu, about, gallery, reservations, contact
└─ lib/
   ├─ site.ts                 # Typed access to settings.json + locations.json
   ├─ content.ts              # Typed access to the page JSON + featured dishes
   └─ cn.ts                   # Class-name helper
public/
├─ admin/                     # Sveltia CMS (index.html + config.yml)
└─ images/                    # Photography (see credits below)
```

## Editing content (no code required)

Content is managed at **`https://www.izakayawa.com/admin/`** (or
`/admin/index.html` on the local dev server). It is powered by Sveltia CMS,
which signs in with GitHub, edits the JSON files in `src/content/`, and commits
the changes back to the repository. Every commit triggers a Cloudflare Pages
rebuild, so edits go live automatically after a minute or two.

The admin UI has three sections:

- **Pages** — Home, Menu, About, Gallery, Reservations and Contact. Every
  heading, paragraph, button label and photo on each page is editable here.
- **Locations** — the two restaurants: address, phone, map search text and
  hours (both the human-readable hours and the machine-readable hours used for
  Google).
- **Site settings** — site name, navigation, footer text, button labels, social
  links and the 404 page.

### Photos

Images uploaded in the CMS are committed to `public/images/` and referenced as
`/images/<filename>`. To replace a placeholder, open the relevant page, click
the image field and upload the restaurant's own photo. Always fill in the
**Alt text** field — it is used for accessibility and SEO.

### Menus and the home page

- A dish shows a **Signature** badge when **Signature dish** is on.
- A dish appears in the **"A few of our signatures"** grid on the home page
  when **Show on the home page** is on. Use **Home-page order** to control the
  order (1, 2, 3…).
- Menu sections and dishes can be added, reordered or removed freely.

## Reservations

Reservations are taken **by phone**, and the site says so. The reservations page
also offers a request form. Because the site is static, the form posts to
[Web3Forms](https://web3forms.com), a free form-to-email service, so no server
is needed.

1. Create a free Web3Forms account with the restaurant's email address and copy
   the **Access Key**.
2. Set it as an environment variable when building:

   ```bash
   # .env.local (local builds) — see .env.example
   NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your-access-key
   ```

   On Cloudflare Pages, add the same variable under
   **Settings → Environment variables** (Production and Preview).

The key is public (it only routes submissions to your inbox) and is inlined into
the static site at build time. **Until it is set, the form still validates but
shows a "please call us" message instead of sending.**

## Deployment (Cloudflare Pages — free)

Cloudflare Pages hosts the static `out/` folder for free, with no commercial-use
restriction and generous bandwidth.

1. Push this project to a **GitHub** repository (the whole repo; the site lives
   in the `izakaya-wa-site/` subfolder).
2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages →
   Connect to Git** and select the repository.
3. Configure the build:
   - **Framework preset:** None
   - **Root directory:** `izakaya-wa-site`
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
4. Add environment variables (Settings → Environment variables):
   - `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` = your Web3Forms key
   - `NODE_VERSION` = `22` (Next.js 16 needs Node 20.9+)
5. Deploy. After the first build, add the custom domain
   (`www.izakayawa.com`) under **Custom domains**.

Every push to `main` (including CMS edits) redeploys automatically.

## Content manager setup (one-time)

The CMS needs a GitHub login. For non-technical editors the recommended method
is a GitHub App plus the official **Sveltia CMS Authenticator** on Cloudflare
Workers. (A single technical user could instead sign in with a GitHub personal
access token, skipping the worker.)

### 1. Deploy the authenticator

Use the one-click deploy from
[`sveltia/sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth) and
note the Worker URL, e.g. `https://sveltia-cms-auth.<SUBDOMAIN>.workers.dev`.

### 2. Register a GitHub App

Open the
[pre-filled "Register new GitHub App" page](https://github.com/settings/apps/new?name=Sveltia+CMS+Auth+for+Izakaya+WA&url=https://github.com/sveltia/sveltia-cms-auth&webhook_active=false&contents=write&pull_requests=write),
then:

- **GitHub App name:** anything unique, e.g. `Sveltia CMS Auth for Izakaya WA`.
- **Redirect URI:** `<YOUR_WORKER_URL>/callback`.
- **Repository permissions:** Contents **Read and write**, Pull requests
  **Read and write**.
- Create the app, copy the **Client ID**, then **Generate a new client
  secret** and copy it.
- **Install App** on the account that owns the site repository, and grant it
  access to that one repository.

### 3. Configure the Worker

In the Cloudflare Worker → **Settings → Runtime variables and secrets**, add:

| Variable               | Value                                             |
| ---------------------- | ------------------------------------------------- |
| `GITHUB_CLIENT_ID`     | the app's Client ID                               |
| `GITHUB_CLIENT_SECRET` | the app's client secret (mark as **Secret**)      |
| `ALLOWED_DOMAINS`      | `izakayawa.com, *.izakayawa.com, localhost, cms.netlify.com` |

`ALLOWED_DOMAINS` stops other sites from using your worker; `localhost` and
`cms.netlify.com` let you sign in from the local dev server. Save and deploy.

### 4. Point the CMS at the worker and repository

Edit `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: "OWNER/REPO"                        # ← your GitHub repository
  branch: main
  base_url: "https://sveltia-cms-auth.<SUBDOMAIN>.workers.dev"   # ← your Worker URL
```

Commit and redeploy. Editors can now sign in at `/admin/`.

> **Security:** `config.yml` is public and must never contain secrets. The
> Client Secret lives only in the Cloudflare Worker's environment variables.

## Content to replace before launch

Everything below is editable in the CMS at `/admin` unless noted.

- **Photography** — every photo is a freely licensed placeholder from Wikimedia
  Commons (see credits). Replace with the restaurant's own photography via the
  Gallery page and the image fields on each page.
- **Menu** — the dishes are a representative, seasonal guide. Replace with the
  current lineup and decide whether to publish prices (they are intentionally
  omitted today).
- **Contact details** — email (`hello@izakayawa.com`), social links and the site
  URL (`https://www.izakayawa.com`) are placeholders, set in **Site settings**.
- **Hours** — verify against the restaurant, especially holiday hours, in
  **Locations**.
- **Structured data** — `src/components/structured-data.tsx` builds the JSON-LD
  from **Locations**, so keep those hours accurate.

## Image credits

All photography is sourced from [Wikimedia Commons](https://commons.wikimedia.org)
under open licenses and is used here as a placeholder. The same list is shown
publicly on the [Gallery](/gallery) page (the `#credits` section).

| File | Credit | License |
| ---- | ------ | ------- |
| `hero-sushi-platter.jpg` | Sushi platter, Nikko, Japan — Joli Rumi | CC BY-SA 4.0 |
| `nigiri.jpg` | Nigiri Sushi — Tim Reckmann | CC BY 2.0 |
| `sashimi.jpg` | Kawahagi sashimi with liver sauce — Jpatokal | CC BY-SA 4.0 |
| `yakitori.jpg` | Yakitori — Francesc Fort | CC BY-SA 4.0 |
| `yakitori-shop.jpg` | Yakitori shop in Setagaya — Syced | CC0 |
| `izakaya-interior.jpg` | Quality izakaya in Ebisu — Syced | CC0 |
| `izakaya-interior-2.jpg` | Quality izakaya in Ebisu — Syced | CC0 |
| `izakaya-interior-3.jpg` | Quality izakaya in Ebisu — Syced | CC0 |
| `tempura.jpg` | Tempura — Ocdp | CC0 |
| `sake.jpg` | Sake bottles — koutalou | CC BY 2.0 |
| `ramen.jpg` | Ramen Bowl — Shisma | CC BY 4.0 |
| `grilled-fish.jpg` | Grilled fish at restaurant in Tokyo — Syced | CC0 |
| `matcha.jpg` | Matcha tea art — John Beans | CC BY 2.0 |
| `miso-soup.jpg` | Miso Soup — Ocdp | CC0 |
| `donburi.jpg` | Pork Chashu Rice Bowl — Andy Li | CC0 |
| `wagyu.jpg` | Wagyū on plate — Shisma | CC BY 4.0 |
| `interior-kaiten.jpg` | Kaitenzushi restaurant interior — Savannah Rivka | CC BY-SA 4.0 |
| `beer.jpg` | Selection of Japanese beer — uba | CC BY-SA 2.0 |
| `udon.jpg` | Udon Tofu — Mantelmoewe | CC0 |
| `omakase-donburi.jpg` | Take-out omakase donburi — Andy Li | CC0 |

Each photo's source URL is recorded alongside its credit in
`src/content/pages/gallery.json`. If you keep any of these images, retain the
attribution and license; CC BY / CC BY-SA require credit (and share-alike for
derivatives).

## SEO & performance

- Per-page `metadata` (title/description/Open Graph) plus a root template.
- Restaurant JSON-LD in `src/components/structured-data.tsx`.
- Generated `sitemap.xml` and `robots.txt`.
- Every route prerenders to static HTML; images are served as-is
  (`images.unoptimized`) so no image server is required.

---

_This site was generated as a starting point. Hours, menu and pricing are
subject to change — always confirm with the restaurant._
