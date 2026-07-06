# HotspotUV — product website

Marketing site for **HotspotUV**, a smart hotspot & trim UV mapping plugin for
Autodesk 3ds Max, created by **3Design DK**.

- **Live site:** https://skuchryk.github.io/3Design-DK/
- **Buy (Gumroad):** https://skuchryker.gumroad.com/l/ueunpw
- **Plugin source (separate project):** `H:\PROJECTS\HotSpotMaxV2`

It's a plain static site — HTML, CSS and a little vanilla JavaScript. **No build
step, no framework, no dependencies.** You can open `index.html` in a browser and
it just works.

---

## Table of contents
1. [Project structure](#project-structure)
2. [How the page is built](#how-the-page-is-built)
3. [Editing common things](#editing-common-things) — price, links, text, colors
4. [Local preview](#local-preview)
5. [Deploying changes](#deploying-changes)
6. [Custom domain](#custom-domain)
7. [Decisions & history](#decisions--history)

---

## Project structure

```
3Design DK/
├── index.html          # the entire page (all sections, one file)
├── css/
│   └── style.css       # all styling + theme variables + responsive rules
├── js/
│   └── main.js         # sticky nav, mobile menu, scroll-reveal, cookie consent,
│                       #   purchase-click tracking, footer year
├── assets/             # logos (SVG + PNG sizes), favicons, apple-touch icon
│   └── favicon.svg     # browser tab icon (trim-sheet motif)
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions workflow that publishes to GitHub Pages
├── .claude/
│   └── launch.json     # local dev-server config (for the preview tool)
├── HANDOFF.md          # cross-machine handoff notes / open items
└── README.md           # this file
```

Everything the visitor sees lives in **`index.html`**. It's a single-page site;
the nav links (`#features`, `#pricing`, …) just scroll to sections on the same page.

---

## How the page is built

**`index.html`** — one HTML file, split into commented sections in this order:
Nav → Hero → Stats strip → Why → Features → How it works → Video → Who it's for →
Pricing → Requirements → FAQ → Changelog → Final CTA → Footer. Each section is
wrapped in a `<section>` with an `id` used by the nav for scrolling.

The hero "plugin window" (the mock UI with UV islands snapping into zones) is **pure
SVG + CSS animation** — no images, no video. It's defined inline in `index.html`
(the `.window` block) and animated by the `@keyframes snapIn` / `cursorMove` rules
in `style.css`.

**`css/style.css`** — all colors are CSS variables defined at the top in `:root`
(see below). The rest is normal CSS. Responsive breakpoints are at the bottom
(`@media (max-width: 980px)` for tablet, `720px` for mobile). Animations respect
`prefers-reduced-motion` (they're disabled for users who ask for reduced motion).

**`js/main.js`** — small and dependency-free. It handles: a border on the nav when
you scroll, the mobile hamburger menu, fading sections in as you scroll
(IntersectionObserver), the GDPR cookie-consent banner (Google Analytics Consent
Mode v2), sending a `purchase_click` event to GA when a "Get HotspotUV" button is
clicked, and filling the current year in the footer.

The **Changelog** section is a plain list of `<details class="release">` blocks
(collapsible, like the FAQ) laid out as a vertical timeline. It's static HTML — no
data file — so a new version is added by hand (see *Update the changelog* below).

---

## Editing common things

### Change the price
The price shows as **$15 USD** (that's the product currency on Gumroad; buyers in
other countries pay the converted local amount at Gumroad checkout). It appears in
**two** places in `index.html`:

- The pricing card: `<span class="price-currency">$</span><span class="price-amount">15</span>`
- The two big buttons: `Get HotspotUV — $15` (hero and final CTA)

Search `index.html` for `15` and update both. The plain nav / pricing buttons that
just say "Get HotspotUV" have no number.

### Change the "Buy" link
All four buttons link to the Gumroad product page. To change the destination,
find-and-replace this URL across `index.html`:

```
https://skuchryker.gumroad.com/l/ueunpw
```

> Note: use the *clean* product URL like above. Don't paste Gumroad share links that
> end in `?_gl=1*...` — that `_gl` part is a temporary Google-Analytics tracking
> token that expires and shouldn't be hard-coded.

### Change the license wording
Current wording is **"Lifetime license · 1 year of updates included"**. It appears in:
- The pricing card note (`class="price-note"`)
- The pricing feature list (`<li>1 year of free updates included</li>`)
- The FAQ answer under "How does licensing work?"

### Change text / copy
All copy is directly in `index.html` as plain text — just edit it. The source
material came from the plugin's own docs in `H:\PROJECTS\HotSpotMaxV2`
(`GUMROAD.md`, `HotspotUV_GUIDE.md`) and the product PDF. Copy is in **English**.

### Change the demo videos
Two YouTube embeds in the `#video` section. Replace the video IDs in the `src`:
```
https://www.youtube-nocookie.com/embed/L8o9stdKdqM
https://www.youtube-nocookie.com/embed/dq66xB1WvG4
```

### Update the changelog / release notes
The `#changelog` section in `index.html` mirrors the plugin's own
`H:\PROJECTS\HotSpotMaxV2\release\CHANGELOG.txt` (the source of truth). To add a
new version, copy the newest `<details class="release …">` block and, at the top of
the list:

1. Give the **new** block the classes `release is-latest` and the `open` attribute,
   and add the `<span class="release-badge">Latest</span>` chip inside its summary.
2. Remove `is-latest`, `open` and the `Latest` badge from the **previous** version
   so it collapses.
3. Fill in the version, date (`d Mmm yyyy`) and the `New` / `Improved` /
   `Performance` / `Fixed` groups. Each item is `<li><strong>Title</strong> — …</li>`.

No JS or CSS changes are needed — the timeline and collapse behaviour are automatic.

### Analytics & purchase tracking
The site uses **Google Analytics 4** (`G-P0LGVQESN5`, in the `<head>` of
`index.html`) with **Consent Mode v2** — nothing is measured until the visitor
clicks **Accept** on the cookie banner (choice saved in `localStorage`).

`js/main.js` fires a custom **`purchase_click`** event (params: `link_location`,
`item_id`, `currency`, `value`) whenever any `gumroad.com` link is clicked, so you
can see which "Get HotspotUV" button drives clicks. Mark it as a **Key event** in
GA4 to count it as a conversion.

The actual *purchase* happens on Gumroad (a different domain). To see purchases in
the same GA4 property: paste `G-P0LGVQESN5` in **Gumroad → Settings → Advanced →
Third-party analytics → Google Analytics**, and in **GA4 → Admin → Data streams →
Configure tag settings → Configure your domains** add both `skuchryk.github.io` and
`gumroad.com` (match type *Contains*) so the click-through counts as one session.

### Change the colors / theme
Edit the CSS variables at the top of `css/style.css`. These were matched to the
original reference site (hotspotuv.crevio.app):

The site uses a **monochrome white-on-navy** theme (no coloured accent):

| Variable      | Value       | Used for                        |
|---------------|-------------|---------------------------------|
| `--bg`        | `#070a24`   | page background (navy)          |
| `--bg-soft`   | `#0a0e2e`   | alternating section background  |
| `--card`      | `#0e1338`   | cards / panels                  |
| `--text`      | `#f3f5f7`   | main text                       |
| `--muted`     | `#9aa6bd`   | secondary text                  |
| `--accent`    | `#f3f5f7`   | white — buttons, highlights, icons |

Change `--accent` alone and the whole site re-themes (buttons, icons, links, glows).
On the white buttons the label colour is hard-set to navy (`#070a24`) in
`.btn-primary` / `.panel-btn`, so if you switch `--accent` to a dark colour, flip
that too.

---

## Local preview

Open `index.html` directly in a browser, **or** serve the folder (needed for the
YouTube embeds to behave like production):

```bash
# from the repo root
python -m http.server 8000
# then open http://localhost:8000
```

---

## Deploying changes

The site is hosted on **GitHub Pages** and published by a **GitHub Actions
workflow** (`.github/workflows/deploy.yml`, using `actions/deploy-pages`).
**Any push to `main` triggers the workflow**, which uploads the repo as a Pages
artifact and deploys it — live within a minute or two.

```bash
git add -A
git commit -m "Describe your change"
git push origin main
```

Config (already set, don't need to touch): GitHub repo **Settings → Pages →
Source: GitHub Actions**, Enforce HTTPS on. The repository is **public** (required
for free GitHub Pages).

If a push doesn't seem to deploy, open **Actions → "Deploy site to GitHub Pages"**.
You can also start one manually via **Run workflow → main** (use a *fresh* run, not
"Re-run", which can trip a "Multiple artifacts named github-pages" error). A run
that fails with GitHub's generic "Deployment failed, try again later" is usually a
transient GitHub-side issue — check https://www.githubstatus.com and re-run later.

**Authentication for pushing:** the first push needs a GitHub credential. Either
approve the "Authorize Git Credential Manager" popup, or use a **fine-grained
Personal Access Token** scoped only to this repo (Settings → Developer settings →
Fine-grained tokens → repository access = `skuchryk/3Design-DK`, Contents =
Read/write). Don't commit tokens; don't reuse a token you've pasted into a chat —
revoke and regenerate.

**Verify a deploy:** `curl -s -o /dev/null -w "%{http_code}" https://skuchryk.github.io/3Design-DK/`
should return `200`. If you ever see GitHub's pink "unicorn" error page, that's a
temporary GitHub-side 5xx — check https://www.githubstatus.com and just refresh.

---

## Custom domain

Not set up yet. To point your own domain (e.g. `hotspotuv.com`) at the site:

1. Buy a domain (Cloudflare, OVH, home.pl, Namecheap — note: Google Domains no
   longer exists, it moved to Squarespace).
2. At the registrar's DNS, add for the apex domain four **A** records to GitHub:
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`;
   and a **CNAME** for `www` → `skuchryk.github.io`.
3. GitHub **Settings → Pages → Custom domain** → enter the domain → Save. GitHub
   writes a `CNAME` file to the repo and issues a free SSL cert.
4. Tick **Enforce HTTPS** once the DNS check passes.

The site uses relative asset paths, so it works unchanged on both the `github.io`
URL and a custom domain.

---

## Decisions & history

- **Why static, no framework?** The old reference site (hotspotuv.crevio.app) was
  a Next.js app on Crevio the owner didn't like. This rebuild is intentionally
  plain so it's trivial to host anywhere, has zero maintenance, and loads instantly.
- **Colors:** the first build used a teal accent (`#00d9d9`) extracted from the
  reference site. It was later reworked to a **monochrome white-on-navy** theme for
  a more premium, timeless look, matching the white-on-navy logo.
- **Logo:** custom spire emblem (`assets/logo_*`), white-on-navy, in circular badge,
  mark-only and horizontal variants, plus favicon/ico/apple-touch. The nav shows the
  emblem inside a ringed circle. Assets are regenerated from the scripts kept in the
  scratchpad; colours follow the `#f3f5f7` mark / navy disc scheme.
- **Selling platform** moved from Crevio to **Gumroad** (`/l/ueunpw`). Price is set
  in **USD ($15)** on Gumroad; the site shows `$15` and notes local-currency
  checkout, rather than a fixed PLN figure, because Gumroad auto-converts.
- **License model:** lifetime license, one year of updates included in the price
  (plugin keeps working after that; updates renewable).
- **Hosting:** GitHub Pages from a public repo. Repo was flipped from private to
  public specifically to enable free Pages. Deployment was later moved from the
  built-in "Deploy from a branch" to a **GitHub Actions workflow** for more
  reliable/repeatable publishes.
- **Analytics:** Google Analytics 4 with Consent Mode v2 and a GDPR banner, added
  so traffic can be measured without dropping cookies before consent. Purchase-
  intent is tracked with a custom `purchase_click` event on the buy buttons; real
  purchases are attributed via Gumroad's third-party GA integration + cross-domain
  measurement (see *Analytics & purchase tracking*).
- **Changelog:** a `#changelog` section was added to surface the plugin's release
  notes on the site (active-development signal). It's a hand-maintained mirror of
  the plugin repo's `CHANGELOG.txt`, styled as a collapsible timeline.
