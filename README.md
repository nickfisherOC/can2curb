# Can 2 Curb — Website

A lightweight, static marketing website for **Can 2 Curb**, a bin valet service in Edmonton, Alberta. Built with semantic HTML5, modern CSS, and vanilla JavaScript — no frameworks, no build step, no dependencies.

> Can 2 Curb moves your garbage, recycling, food scraps, and yard-waste bins to the curb before City of Edmonton collection and returns them afterward. **The City still empties the bins — Can 2 Curb handles the trip.**

---

## 1. Preview the site locally

The site uses **clean URLs** (e.g. `/pricing/`), so open it through a small local web server rather than double-clicking the HTML files. Pick whichever you have:

**Windows (no installs needed) — included helper:**
```bash
powershell -ExecutionPolicy Bypass -File serve.ps1
```
Then open <http://localhost:8000/>. (Right-click `serve.ps1` → *Run with PowerShell* also works.)

**If you have Python:**
```bash
python -m http.server 8000
```

**If you have Node:**
```bash
npx serve .
```

---

## 2. File structure

```
can-2-curb/
├── index.html                  Home
├── how-it-works/index.html
├── who-we-help/index.html
├── pricing/index.html
├── service-areas/index.html    (address checker lives here at #check)
├── about/index.html
├── contact/index.html
├── privacy/index.html
├── terms/index.html
├── robots.txt
├── sitemap.xml
├── serve.ps1                   Local preview server (Windows)
├── README.md
└── assets/
    ├── css/styles.css          Design system: all colours, type, spacing, components
    ├── js/main.js              All interactions + SITE CONFIG block (see below)
    ├── icons/favicon.svg
    └── images/                 (add photos + og-image.png here)
```

---

## 3. Where to edit the important things

### Business details (phone, email, domain, social, form endpoint)
**One place:** the `window.CAN2CURB = { … }` block at the top of **`assets/js/main.js`**.
Phone/email placeholders throughout the site are filled in automatically from here (any element with `data-phone` / `data-email` / `data-fb` / `data-ig`).

```js
window.CAN2CURB = {
  phone: "(587) 000-0000",   // ← real number
  email: "hello@can2curb.ca", // ← real email
  domain: "https://www.can2curb.ca",
  social: { facebook: "…", instagram: "…" },
  formEndpoint: "",           // ← see “Forms” below
  formMode: "demo"            // "demo" | "live"
};
```

### Colours, fonts, spacing (whole-site theming)
The `:root { … }` design tokens at the top of **`assets/css/styles.css`**. Change a value once and it updates everywhere (e.g. `--evergreen`, `--green`, `--container`).

### Pricing
- Homepage plan cards: **`index.html`** → “SECTION 9: SERVICE OPTIONS”.
- Full pricing page + comparison table: **`pricing/index.html`**.
- Every price is a **placeholder** written as `$XX` and flagged with a `TBC`/`TBD` pill and a `<!-- TODO(Doug) -->` comment. Search for `$XX` to find them all.

### Service areas / neighbourhoods
**`service-areas/index.html`** — the coverage groups are `<details class="area-group">` blocks with **example** neighbourhoods marked as *requiring confirmation*. The address checker is a **lead form**, not a live map lookup.

### Contact form / address checker
Both use the same form system in `main.js`. See “Forms” next.

---

## 4. Forms (going live)

Forms currently run in **demo mode**: validation, spam honeypot, loading, error, and success states all work, but nothing is sent anywhere yet. To connect them:

1. Choose a provider (Formspree, Netlify Forms, Growtheon, or a custom API/email endpoint).
2. In `assets/js/main.js`:
   - **Formspree / custom endpoint:** set `formEndpoint` to your URL and `formMode: "live"`.
   - **Netlify Forms:** add `data-netlify="true"` to each `<form>`, set `formMode: "live"`, leave `formEndpoint` empty.
3. **Never** put secret API keys in this front-end JavaScript.

---

## 5. SEO / metadata

- Unique `<title>`, meta description, canonical, and Open Graph tags per page.
- `robots.txt` and `sitemap.xml` at the root (update the domain in both).
- `LocalBusiness` JSON-LD on the homepage; `FAQPage` JSON-LD mirrors the visible FAQ.
- **No fake ratings/AggregateRating** — do not add review schema until you have real, verifiable reviews.
- **TODO:** add a `1200×630` social share image at `assets/images/og-image.png` (referenced by the OG tags).

---

## 6. Accessibility & performance notes

- Skip-to-content link, keyboard-accessible menu & accordions, visible focus rings, labelled forms, `aria-current` on the active nav item.
- Respects `prefers-reduced-motion` (animations disable cleanly).
- Fully responsive 320px → large desktop; nothing overflows horizontally.
- No render-blocking scripts (`main.js` is deferred); fonts use `display=swap`; SVG graphics are inline and optimized.

---

## 7. ⚠️ Information still required from Doug (before launch)

Everything below is currently a **clearly-marked placeholder** in the code. Search the project for `TODO(Doug)` and the `TBD`/`TBC` pills to jump to each spot.

**Business basics**
- [ ] Final domain name (used in canonical tags, `robots.txt`, `sitemap.xml`, config)
- [ ] Phone number, email address, business hours
- [ ] Facebook + Instagram URLs
- [ ] Professional photo of Doug + founder story / bio (About + homepage)
- [ ] Team photos (About)

**Service & pricing**
- [ ] Final prices for Home / Property Plus / Multi-Property (all `$XX` now)
- [ ] Bin count limits per plan
- [ ] Whether a one-time / seasonal yard-waste service is offered, and how it's booked
- [ ] Whether “service confirmations” are offered (Property Plus)
- [ ] Confirmed serviced neighbourhoods / coverage boundaries
- [ ] Whether coverage extends beyond Edmonton city limits

**Policies (do not publish guesses)**
- [ ] Severe-weather / winter operations policy
- [ ] Pause & cancellation terms, notice periods, refunds/credits
- [ ] How customers report schedule changes and problems; target response time
- [ ] Insurance and staff background-check / vetting policy (only assert once true)

**Legal**
- [ ] Have `privacy/` and `terms/` reviewed by a qualified professional
- [ ] Registered legal entity name + business/mailing address
- [ ] Effective dates, governing law, fees/billing terms, liability terms

**Content to add when available**
- [ ] Real customer testimonials (with written permission) — homepage currently shows benefit statements in the testimonial slots, **not fabricated quotes**
- [ ] `assets/images/og-image.png` social share image + any real photography

---

*Can 2 Curb is an independent bin valet service. Municipal waste collection is completed by the City of Edmonton.*
