# Renovation Blue — static site

A clean, framework-free rebuild of **renovationblue.com.au**.
No WordPress, no PHP, no jQuery, no build step. Ready to drag onto Netlify.

---

## Status

| Page | Status |
|---|---|
| Homepage (`index.html`) | ✅ Done |
| About, Services, Your Assurance, Projects, Client Reviews, Contact | ⏳ Next |
| Individual project pages (16) | ⏳ Next |

---

## Folder layout

```
.
├── index.html            # Homepage
├── 404.html              # Not-found page (Netlify serves this automatically)
├── netlify.toml          # Netlify config: headers + caching
├── _redirects            # Old WordPress URLs → new URLs
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/
    │   ├── fonts.css     # Self-hosted Roboto + Roboto Condensed (@font-face only)
    │   └── main.css      # All site styles, numbered sections, design tokens at the top
    ├── js/
    │   └── main.js       # Sticky header, mobile menu, hero slider, scroll reveal
    ├── fonts/            # .woff2 files (latin + latin-ext subsets)
    └── img/              # All images, renamed to something readable
```

Every file is plain text you can open and edit. There is nothing to compile.

---

## How the CSS is organised

`assets/css/main.css` opens with a **design token** block — change a colour or a
font in one place and it updates everywhere:

```css
:root {
  --color-blue:       #2560A7;   /* buttons, card blocks */
  --color-blue-light: #0170B9;   /* logo blue, footer icons */
  --font-body:        "Roboto", ...;
  --font-condensed:   "Roboto Condensed", ...;
  --container-width:  1180px;
  --header-height:    130px;
}
```

After that the file runs in numbered sections (1 tokens → 16 phone styles), so
you can jump straight to the part you want. Class names are BEM-ish and describe
what the thing *is* (`.site-header__logo`, `.card__title`, `.commitment__panel`),
not what it looks like — which is what makes the file easy for a person or an AI
assistant to edit safely.

---

## How the JS is organised

`assets/js/main.js` is one IIFE with five small, independent modules:

| Module | What it does |
|---|---|
| `initHeader` | Adds `.is-scrolled` past 60px — transparent header becomes white |
| `initMobileMenu` | Full-screen overlay menu (replaces the Elementor popup) |
| `initHeroSlider` | 4-slide cross-fade, 5s autoplay, arrows, keyboard, swipe |
| `initReveal` | Entrance animations via `IntersectionObserver` |
| `initYear` | Keeps the footer copyright year current |

No dependencies. Roughly 6 KB unminified.

---

## Images

Originals were pulled from the live site and renamed:

| File | Used for |
|---|---|
| `hero-1..4.jpg` | The four homepage slider backgrounds |
| `commitment-bg.jpg` | Background photo behind "Our Commitment" |
| `card-testimonials.jpg`, `card-projects.jpg` | The two blue feature cards |
| `partner-*.png` | MBA / HIA / Home Show / NSW Home Warranty logos |
| `logo.png`, `logo-footer.png`, `favicon-300.png` | Branding |

`hero-4.jpg` is 746 KB and `hero-1.jpg` is 590 KB — same as the live site. If you
want the page to load faster later, these are the first things to compress or
convert to WebP. Nothing in the code needs to change to do that.

---

## Deploying to Netlify

1. Drag this folder onto <https://app.netlify.com/drop>, **or** connect the Git repo.
2. Build command: *(leave empty)* · Publish directory: `.`
3. Add the domain under **Domain settings**.

`netlify.toml` already sets security headers and long cache lifetimes for fonts
and images. `_redirects` points old WordPress URLs (`/wp-admin`, `/feed`, `?p=123`)
at the homepage so no inbound link 404s.

---

## Forms

The homepage has no form. When the Contact page is converted, the form will use
**Netlify Forms** — add `data-netlify="true"` to the `<form>` tag and submissions
appear in the Netlify dashboard. No server, no PHP, no plugin.

---

## 404 page

`404.html` is deliberately **self-contained** — styles inline, logo embedded as a
data URI. A 404 can be served at any URL depth (`/about/`,
`/projects/coogee-project/`), so a linked stylesheet or image would resolve
against the wrong folder and the page would render unstyled. It also carries a
small preview-only script that repoints the home link when the site is being
viewed from a GitHub Pages project URL; delete that script once the site is on
its own domain.

Until the remaining pages are converted, the menu links resolve to this page.

## /compare/ — temporary

`compare/` holds a phone-comparison page (side-by-side screenshots of the live
WordPress site and this build) used during review. It is `noindex`ed and is not
part of the site. Delete the folder before the final handover.

## Notes on the original site

Three things were carried across exactly as they appear on the live site rather
than silently "fixed" — they are one-line changes whenever you want them changed:

1. **Two different phone numbers.** The live site's transparent top header and the
   in-page call button say `1300 855 032`; the white scrolled header and the footer
   say `1300 885 032`. This build uses **1300 885 032** everywhere.
2. **Email address** reads `info@renovatoinblue.com.au` — "renovatoin", not
   "renovation".
3. **"RERNOVATIONS & EXTENSIONS"** in the footer services list is spelled that way
   on the live site.

Separately, the WordPress install has ~17 injected spam blog posts (casino /
gambling pages in several languages) that are in its sitemap. They are **not**
part of this static build, and `_redirects` returns `410 Gone` for them so search
engines drop them quickly.
