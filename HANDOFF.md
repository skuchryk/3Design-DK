# HANDOFF — continue on another machine

Snapshot of where the HotspotUV website project stands, so work can continue
from another computer via the repo. See [README.md](README.md) for the full
technical guide (structure, editing, deploy, colours).

_Last updated: 2026-08-12._

---

## Get set up on the new machine

```bash
git clone https://github.com/skuchryk/3Design-DK.git
cd 3Design-DK
python -m http.server 8000     # preview at http://localhost:8000
```

Everything is committed and pushed — the repo is the single source of truth.
No local-only files matter (logo generation scripts live in a scratchpad and are
NOT needed; assets are already committed).

**Pushing from the new machine** needs a GitHub credential: either approve the
Git Credential Manager popup on first `git push`, or create a **fine-grained PAT**
scoped to `skuchryk/3Design-DK` (Contents: Read/write) and use it as the password.
Do not commit tokens.

---

## What the site is

- **Live:** https://3designdk.com (via **Cloudflare** → GitHub Pages; the old
  `skuchryk.github.io/3Design-DK/` redirects here). Cloudflare caches assets, so
  hard-refresh (Ctrl+F5) after a deploy; it also obfuscates the contact email.
- **Buy (Gumroad, $30 / $99 / $249 USD):** https://3designdk.gumroad.com/l/ueunpw
- **Contact:** contact@3designdk.com (mailbox on the domain; shown in the footer).
- **Plugin source (separate repo):** `H:\PROJECTS\HotSpotMaxV2`
- Static HTML/CSS/JS, no build step. Single page: `index.html`.

## Done so far
- Full single-page marketing site (hero with animated plugin mock, features,
  workflow, videos, pricing, requirements, FAQ, changelog, footer).
- Prices **$30 / $99 / $249 USD** (Individual / Team / Studio); all "Get HotspotUV"
  buttons link to the Gumroad page. Regional pricing (up to -40%) is on from
  12.08.2026; the launch offer EARLY50 ended 11.08.2026.
- License copy: **lifetime license · 1 year of updates included**.
- **Monochrome white-on-navy** theme (reworked from the original teal).
- Custom **white-on-navy logo set** in `assets/` (circular badge, mark-only,
  horizontal, favicon/ico/apple-touch); nav emblem sits in a ringed circle.
- **Google Analytics 4** (`G-P0LGVQESN5`) via gtag.js with **Consent Mode v2** +
  a GDPR cookie banner (Accept/Decline, choice stored in localStorage).
  **Confirmed live** — the tag is served on the production site.
- **`purchase_click` GA event** on every "Get HotspotUV" (Gumroad) button
  (`js/main.js`), with `link_location` so you can see which button converts.
- **Changelog / release notes** section (`#changelog`) — collapsible timeline,
  hand-mirrored from the plugin's `release/CHANGELOG.txt`. Linked in nav + footer.
- **GitHub Actions deploy workflow** (`.github/workflows/deploy.yml`) using
  `actions/deploy-pages`. Pages **Source is set to "GitHub Actions"**.
- **Control panel section** (`#controls`) — cards documenting every part of the
  plugin UI with real cropped screenshots (`assets/panel_*`, `menu_file`,
  `toolbar_*`, `dialog_edit_trim`) + click-to-zoom lightbox. Packed with CSS
  multi-column (no JS layout, so mobile-safe). See README → *How the page is built*.
- **Custom domain** `3designdk.com` live via **Cloudflare**; footer shows a visible,
  copyable `contact@3designdk.com` with a `?subject=HotspotUV` mailto prefill.
- **Interactive tutorial page** (`tutorial.html`, 2026-07-09) — self-contained
  (inline CSS/JS + embedded screenshot, no external requests): window anatomy
  with 12 annotated areas (= full function reference), trim-sheet building
  recipe, live matching-engine simulator styled after the real plugin UI,
  modes comparison, concepts. **EN default + PL toggle** (localStorage).
  Linked from nav, footer and a CTA under `#controls`. Source of truth for
  its content: `F:\HotSpotMaxV2` (HotspotUV_GUIDE.md, USER_GUIDE v1.2.0).

---

## ✅ RESOLVED — GA deployment is live

The earlier GitHub Pages deploy failures were transient (GitHub-side). The site has
since republished and now serves the latest commits. Verified on 2026-07-06:

```bash
curl -s https://skuchryk.github.io/3Design-DK/ | grep G-P0LGVQESN5   # prints the ID
```

Consent banner, Consent Mode v2 and the tier pricing are all live. In GA, open the
site, click **Accept**, then GA → **Reports → Realtime** should show you.

---

## Analytics — to finish on the dashboards (no code)

Purchase-click tracking is in the code, but two dashboard steps make purchases
show up end-to-end (details in README → *Analytics & purchase tracking*):

1. **Gumroad → Settings → Advanced → Third-party analytics → Google Analytics**:
   paste `G-P0LGVQESN5`.
2. **GA4 → Admin → Data streams → Configure tag settings → Configure your domains**:
   add `skuchryk.github.io` **and** `gumroad.com` (match type *Contains*) so the
   click-through to Gumroad counts as one session. Do **not** add Gumroad as a
   separate data stream.
3. (Optional) In **GA4 → Admin → Events**, mark `purchase_click` as a **Key event**.

---

## Possible next steps (not started)
- **Privacy Policy page** (recommended alongside GA/GDPR) — link it from the
  cookie banner and footer.
- Custom domain (see README → Custom domain).
- Replace the animated SVG plugin mock with real screenshots/GIFs from the plugin.
- Polish/Polish-language version of the copy.
