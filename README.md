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

1. In the repository **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions** (not “Deploy from a branch”).
2. Push to `master` or `main`, or open **Actions → Deploy to GitHub Pages → Run workflow** (manual runs are enabled).
3. The first time the deploy job runs, GitHub may require you to **approve** the `github-pages` environment: **Settings → Environments → github-pages**.

### Live site shows raw HTML with `/src/main.jsx` (blank page)

That is the **source** `index.html` from the repo root. GitHub Pages is publishing your **Git branch files**, not the **Vite build** in `dist/`.

**Fix:** Only ever publish the **`dist/`** folder after `npm run build`:

- **If you use GitHub Actions** (recommended): **Settings → Pages → Source** must be **GitHub Actions**, **not** “Deploy from a branch” pointing at `main`/`master` **/**. The workflow uploads the **`dist`** artifact from a successful build. After changing the source, run the workflow again (**Actions → Deploy to GitHub Pages → Run workflow**).

- **If you use `npm run deploy`**: That pushes **`dist/`** to the **`gh-pages`** branch. Then **Settings → Pages → Source** must be **Deploy from branch** → **`gh-pages`** → **`/ (root)`** — **not** your default branch root.

A correct production `index.html` references hashed files under **`./assets/…`**, not **`/src/main.jsx`**. Run `npm run build` locally and open `dist/index.html` via **`npm run preview`** to confirm.

### Custom domain (`kashishchawla.com`) — “Site not found”

That page means GitHub received the request for your domain but **no published site** is tied to it yet, or **DNS / domain settings** do not match this repo.

Do these in order:

1. **Confirm the default Pages URL works**  
   Open `https://ka1chawla.github.io` (use your real GitHub username if it differs). If this 404s, fix deployment first (steps above + check the latest workflow run succeeded).

2. **Add the domain in GitHub**  
   **Settings → Pages → Custom domain** → enter `kashishchawla.com` → Save. Leave **Enforce HTTPS** on after DNS verifies.

3. **DNS at your registrar** (must match [GitHub’s custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site))  
   - **Apex** (`kashishchawla.com`): **A** records to GitHub’s IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, **or** an **ALIAS/ANAME** to `ka1chawla.github.io` if your DNS supports it.  
   - **`www`**: **CNAME** `www` → `ka1chawla.github.io`.  
   Use the **same** GitHub username as the account that owns this `username.github.io` repository.

4. **Wait for DNS + certificate**  
   Propagation and HTTPS can take from a few minutes up to 48 hours.

5. **One publishing source**  
   If you use **GitHub Actions**, keep Pages source on **GitHub Actions**. If you instead use **`npm run deploy`** (`gh-pages` branch), set Pages to deploy from the **`gh-pages`** branch — do not mix both without knowing which one is active.

`public/CNAME` (copied into `dist/` on build) should contain only the hostname, e.g. `kashishchawla.com`. The **Custom domain** field in repo settings is what GitHub uses to attach the domain to your site.

## Project layout

- `src/App.jsx` — page content and sections
- `src/index.css` — styles
- `public/` — static assets served as-is (`CNAME`, favicon)

The root `index.html` is Vite’s entry shell; the visible site is rendered by React.
