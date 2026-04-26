# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A static multi-page marketing site being built for **SafePlay Pro**, a Utah sport-surface contractor (court surfaces, tennis, running tracks, synthetic turf, G-Max testing). This is an agency deliverable, not a web app — there is no build system, no package manager, no tests, and no server. Open `index.html` (or any landing page) in a browser to preview.

The homepage (`index.html`) is the main marketing page. Alongside it sit service/SEO landing pages that all share `style.css` and `main.js`:

- `pickleball-court-surfacing-utah.html` plus city variants (`-park-city`, `-salt-lake-city`, `-st-george`)
- `tennis-court-resurfacing-utah.html`, `tennis-pickleball-court-construction-utah.html`
- `running-track-maintenance-utah.html`, `synthetic-turf-maintenance-utah.html`, `gmax-testing-utah.html`

Each landing page duplicates the nav (services dropdown + mobile nav) and footer markup from `index.html`. **When the nav or footer changes, it has to change on every page** — this is the biggest footgun in the repo. Grep for the nav anchor (e.g. `nav-dd-toggle`) to find every copy before editing.

Full client/positioning context lives in `safeplaypro-CLAUDE.md` — read it before making content, messaging, or structural decisions. Key points: lead with the **Utah Jazz community court** renovation and **G-Max testing** (underplayed differentiators), address **B2B institutional** and **residential** audiences separately, and never lean on generic "quality / years of experience" language.

## Deployment

`.github/workflows/static.yml` auto-deploys to GitHub Pages on every push to `main` — the entire repo is uploaded as the artifact (no build step, no path filtering). Anything committed to `main`, including drafts and raw images in `images/`, ships. There is no preview environment.

### Cache busting

HTML files reference `style.css?v=N` and `main.js?v=N` (currently `?v=3`). Bump the version in **every** HTML file whenever you make a substantive CSS or JS change so returning visitors don't get a stale GitHub Pages cache. Grep for `?v=` to catch them all.

## File layout

- `index.html` — homepage (markup only). Links to `style.css` in `<head>` and `main.js` right before `</body>`.
- Service landing pages (see list above) — each is a standalone HTML file sharing the same `style.css` / `main.js`.
- `style.css` — all site styles, shared across every page. Design tokens (CSS variables) live at the top; sections follow the same numbered order as the homepage markup.
- `main.js` — shared behavior for all pages: nav scroll shadow, hamburger, services dropdown (click-toggle + outside-click close), `.reveal` scroll-in, counter animation, active-nav IntersectionObserver, estimate-form validation, sticky call bar, full-bleed homepage gallery (`#fullgallery`), and the generic `.lp-photo-carousel` used on landing pages.
- `safeplaypro_homepage_7.html`, `safeplaypro_homepage_prompt.html` — older homepage iterations/drafts. Do not edit unless asked; treat as reference only.
- `images-index.html` (~17 MB) — standalone dark-themed contact-sheet page used to review/pick photos from the client's raw camera roll. Self-contained, not linked from the site.
- `wordpress-top36.html` (~6 MB) — WordPress-flavored export of the same photo picks.
- `images/` — client's **raw** camera-roll source material (JPG + MP4, many multi-MB, original `20YYMMDD_HHMMSS.jpg` filenames). `logo.png` lives here too. These files are the source for picking hero/gallery photography — they are **not** served from the site.
- `images/optimized/` — web-ready versions of the photos actually used on the site (max 1920px on the longest side, JPEG quality 82, progressive, EXIF stripped). The site references these, never the raw originals.
- `website-picks-top36/originals/` — working subset of selected photos.
- `safeplaypro-CLAUDE.md` — client briefing (positioning, competitors, CTAs, do-nots).

## Image pipeline — important

The site references **local optimized images** at `images/optimized/FILENAME.jpg`. The raw camera files in `images/` are the source-of-truth, but never linked from the site directly — they're 4000+ px and 2–10 MB each. To add a new photo:

1. Pick the source file from `images/` (the captions in `images-index.html` describe each one).
2. Run it through the optimization pipeline (see below) to produce `images/optimized/FILENAME.jpg`.
3. Replace the matching `<div class="img-ph" data-slot="...">` placeholder block in `index.html` with `<img src="images/optimized/FILENAME.jpg" alt="..." loading="lazy" style="width:100%;height:100%;object-fit:cover;">`. The hero background is swapped via `background-image: url('images/optimized/FILENAME.jpg')` in the `#hero` rule in `style.css`.

A few image slots remain as styled `.img-ph` placeholders for content the client hasn't supplied yet — most importantly the standalone `gmax-photo` slot (G-Max testing equipment / missile drop). Leave these as placeholders until real photos arrive; the captioned `images-index.html` set is 100% courts.

Do not change the gallery grid classes (`gslot`, `gslot-large`, `gslot-wide`) — they control the layout.

### Optimization pipeline

`sips` (built into macOS) preserves EXIF orientation tags in a way that double-rotates portrait JPEGs from Samsung phones, so use **Pillow** instead. From the project root:

```python
from PIL import Image, ImageOps
img = Image.open('images/SOURCE.jpg')
img = ImageOps.exif_transpose(img)             # bake EXIF rotation into pixels, drop tag
img.thumbnail((1920, 1920), Image.LANCZOS)     # max 1920px on longest side
img.save('images/optimized/SOURCE.jpg', 'JPEG', quality=82, optimize=True, progressive=True)
```

Targets: max 1920px longest side, quality 82, progressive, EXIF stripped. Typical results: 2–5 MB → 200–800 KB per file.

**Chromium quirk:** Pillow's saved JPEGs include a JFIF density field that triggers unwanted rotation when used as a CSS `background-image` for portrait photos. The `#hero` rule already includes `image-orientation: none` to disable that — keep it there if you swap the hero background to another portrait file. `<img>` elements are unaffected.

## Photo carousels

Two carousel systems exist, both reading from `images/optimized/`:

1. **Full-bleed homepage gallery** (`#fullgallery` on `index.html`) — image list is **hard-coded** in `main.js` in the `fgImages` array near the top of the carousel block. To change it, edit the array in `main.js` and bump the cache-buster.
2. **Generic landing-page carousel** — any section with `class="lp-photo-carousel"` and a `data-pc-images="a.jpg,b.jpg,c.jpg"` attribute is auto-wired by `main.js`. The section must contain `.pc-img`, `.pc-counter`, `.pc-prev`, `.pc-next` child elements (see an existing landing page for the exact markup). Filenames in `data-pc-images` are relative to `images/optimized/`.

Both carousels support left/right arrow keys when the section is in view and preload the next image before swapping `src`.

## Structure of `index.html`

Sections are top-level `<section id="...">` blocks in this order: `hero` → `trust` (div) → `services` → `jazz` → `gmax` → `gallery` → `certs` → `testimonials` → `estimate` → footer. Each section is preceded by a large comment banner (e.g. `06 — G-MAX DIFFERENTIATOR`). `main.js` sets up three `IntersectionObserver`s — `.reveal` fade-ins, animated counters, active-nav highlighting — so any new section with an `id` automatically participates in nav highlighting.

Design tokens are defined as CSS variables at the top of `style.css` (`--court-blue`, `--court-red`, `--court-green`, surface/text neutrals). Reuse these rather than hardcoding hex values. The global reset sets `border-radius: 0 !important` — this is intentional (sharp-edged brand), do not add rounded corners.

Typography: Bebas Neue (headings, via `.bebas`) and DM Sans (body), loaded from Google Fonts.

## Editing conventions

- Preserve the section comment banners and the `data-slot` attributes — downstream image-swap steps rely on them.
- When adding content, match the existing pattern: `.eyebrow` label, Bebas `h2`, DM Sans body, `.btn btn-blue` / `.btn btn-outline-blue` CTAs.
- Phone number currently in use: `303-880-9362` (appears in header, hero, footer).
- Do not introduce a build step or framework unless the user explicitly asks. The three-file split (`index.html` + `style.css` + `main.js`) is the intended structure — do not re-inline, and do not add bundlers, preprocessors, or package managers.
