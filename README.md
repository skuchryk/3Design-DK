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
│   └── main.js         # sticky nav, mobile menu, scroll-reveal, footer year
├── assets/
│   └── favicon.svg     # browser tab icon (trim-sheet motif)
├── .claude/
│   └── launch.json     # local dev-server config (for the preview tool)
└── README.md           # this file
```

Everything the visitor sees lives in **`index.html`**. It's a single-page site;
the nav links (`#features`, `#pricing`, …) just scroll to sections on the same page.

---

## How the page is built

**`index.html`** — one HTML file, split into commented sections in this order:
Nav → Hero → Stats strip → Why → Features → How it works → Video → Who it's for →
Pricing → Requirements → FAQ → Final CTA → Footer. Each section is wrapped in a
`<section>` with an `id` used by the nav for scrolling.

The hero "plugin window" (the mock UI with UV islands snapping into zones) is **pure
SVG + CSS animation** — no images, no video. It's defined inline in `index.html`
(the `.window` block) and animated by the `@keyframes snapIn` / `cursorMove` rules
in `style.css`.

**`css/style.css`** — all colors are CSS variables defined at the top in `:root`
(see below). The rest is normal CSS. Responsive breakpoints are at the bottom
(`@media (max-width: 980px)` for tablet, `720px` for mobile). Animations respect
`prefers-reduced-motion` (they're disabled for users who ask for reduced motion).

**`js/main.js`** — small and dependency-free. It only does four things: adds a
border to the nav on scroll, toggles the mobile hamburger menu, fades sections in
as you scroll (IntersectionObserver), and fills the current year in the footer.

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
cd "H:\PROJECTS\3Design DK"
python -m http.server 8000
# then open http://localhost:8000
```

---

## Deploying changes

The site is hosted on **GitHub Pages** from the `main` branch, root folder.
**Any push to `main` automatically rebuilds and republishes** the site within a
minute or two.

```bash
cd "H:\PROJECTS\3Design DK"
git add -A
git commit -m "Describe your change"
git push origin main
```

Config (already set, don't need to touch): GitHub repo **Settings → Pages →
Source: Deploy from a branch → `main` / `(root)`**, Enforce HTTPS on.
The repository is **public** (required for free GitHub Pages).

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
  public specifically to enable free Pages.
