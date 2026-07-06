# HotspotUV — product website

Marketing site for **HotspotUV**, a smart hotspot & trim UV mapping plugin for
Autodesk 3ds Max, created by 3Design DK.

Static site — no build step required.

## Structure

```
index.html        # single-page product site
css/style.css     # theme (dark navy + teal accent)
js/main.js        # nav, mobile menu, scroll-reveal
assets/           # favicon and static assets
```

## Local preview

Open `index.html` in a browser, or serve the folder:

```
python -m http.server 8000
```

## Deployment (GitHub Pages)

1. Push to `main`.
2. On GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root)**.
3. The site will be published at `https://skuchryk.github.io/3Design-DK/`.
