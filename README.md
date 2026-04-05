# Ka1Chawla — Personal Site

Single-page personal site built with **React** and **Vite**, deployed to **GitHub Pages** via GitHub Actions.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Static output is written to `dist/`.

## GitHub Pages

1. In the repository **Settings → Pages**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).
2. Push to `master` or `main`. The workflow in `.github/workflows/deploy.yml` builds the site and publishes it.

Custom domain: `public/CNAME` is copied into `dist/` on build (currently `kashishchawla.com`). Configure the domain in Pages settings if needed.

## Project layout

- `src/App.jsx` — page content and sections
- `src/index.css` — styles (same look as the previous static site)
- `public/` — static assets served as-is (`CNAME`, favicon)

The root `index.html` is Vite’s entry shell; the visible site is rendered by React.
