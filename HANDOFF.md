# HANDOFF — continue on another machine

Snapshot of where the HotspotUV website project stands, so work can continue
from another computer via the repo. See [README.md](README.md) for the full
technical guide (structure, editing, deploy, colours).

_Last updated: 2026-07-06._

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

- **Live:** https://skuchryk.github.io/3Design-DK/
- **Buy (Gumroad, $15 USD):** https://skuchryker.gumroad.com/l/ueunpw
- **Plugin source (separate repo):** `H:\PROJECTS\HotSpotMaxV2`
- Static HTML/CSS/JS, no build step. Single page: `index.html`.

## Done so far
- Full single-page marketing site (hero with animated plugin mock, features,
  workflow, videos, pricing, requirements, FAQ, footer).
- Price **$15 USD**; all "Get HotspotUV" buttons link to the Gumroad page.
- License copy: **lifetime license · 1 year of updates included**.
- **Monochrome white-on-navy** theme (reworked from the original teal).
- Custom **white-on-navy logo set** in `assets/` (circular badge, mark-only,
  horizontal, favicon/ico/apple-touch); nav emblem sits in a ringed circle.
- **Google Analytics 4** (`G-P0LGVQESN5`) via gtag.js with **Consent Mode v2** +
  a GDPR cookie banner (Accept/Decline, choice stored in localStorage).
- **GitHub Actions deploy workflow** (`.github/workflows/deploy.yml`) using
  `actions/deploy-pages`. Pages **Source is set to "GitHub Actions"**.

Commit history (all pushed): workflow `845d75d` · GA `6f38e4b` · monochrome+logo
`28710cc` · logo set `12d34d2` · README `94c6b6e` · license `17c5009`.

---

## ⚠️ OPEN ITEM — finish the GA deployment

The GA/monochrome code is committed and pushed, but the **live site has not
picked up the latest commits yet** because GitHub Pages deployment was failing.

**Diagnosis (confirmed via API):** it is NOT our config and NOT a lock. Every
deployment to the `github-pages` environment was going `queued → in_progress →
failure` with GitHub's generic "Deployment failed, try again later" — a transient
GitHub Pages backend problem (their 500 "unicorn" page showed up too). Deploys
succeeded ~1h earlier, so the setup is correct; it's intermittent on GitHub's side.

There is a leftover legacy **"pages build and deployment" run stuck in _Queued_**.
It is **harmless** (its own deployment already failed) and **cannot be cancelled**
("Failed to cancel workflow"). Ignore it — GitHub will clear it eventually.

### To finish (once GitHub Pages is healthy again)
1. Go to **Actions → "Deploy site to GitHub Pages" → "Run workflow" → main → Run**
   (do a *fresh* run — do NOT use "Re-run", which triggers a
   "Multiple artifacts named github-pages" error).
2. Wait for the `deploy` job to go green.
3. Verify the tag is live:
   `curl -s https://skuchryk.github.io/3Design-DK/ | grep G-P0LGVQESN5`
   (should print the ID).
4. In Google Analytics, the install check should now detect the tag; open the
   site, click **Accept** on the cookie banner, then GA → **Reports → Realtime**
   should show you.

If a run still fails with "Deployment failed, try again later", it's still
GitHub-side — just wait and re-run later.

---

## Possible next steps (not started)
- **Privacy Policy page** (recommended alongside GA/GDPR) — link it from the
  cookie banner and footer.
- Custom domain (see README → Custom domain).
- Replace the animated SVG plugin mock with real screenshots/GIFs from the plugin.
- Polish/Polish-language version of the copy.
