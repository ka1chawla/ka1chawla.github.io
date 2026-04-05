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

Static output is written to **`docs/`** (not the repo root). The root `index.html` is **only for `npm run dev`** — it must never be the published site.

## GitHub Pages

Pick **one** of these (the wrong combo is why you still see `/src/main.jsx`):

### Option A — Deploy from branch → `/docs` (simplest)

1. Run `npm run build` before each release, then **commit and push** the **`docs/`** folder (this repo includes a built `docs/` so the site works as soon as you push).
2. **Settings → Pages → Build and deployment → Source** → **Deploy from a branch**.
3. Branch: **`main`** or **`master`** (your default). Folder: **`/docs`** — **not** `/ (root)`**.  
   Publishing **root** serves the dev `index.html` with `/src/main.jsx`; **`/docs`** serves the built site.

### Option B — GitHub Actions

1. **Settings → Pages → Source** → **GitHub Actions** (not “Deploy from a branch” on `/`).
2. Push to `master` or `main`, or **Actions → Deploy to GitHub Pages → Run workflow**.
3. First run: approve the **`github-pages`** environment if prompted (**Settings → Environments**).

The workflow runs `npm run build` and uploads the **`docs/`** output.

### Live site shows raw HTML with `/src/main.jsx` (blank page)

That is the **source** `index.html` from the **repo root**. Pages is publishing **`/` (root)** on your default branch instead of the **built** site in **`docs/`**.

**Fix:**

- **Deploy from branch:** Folder must be **`/docs`**, **not** **`/ (root)`**.
- **GitHub Actions:** Source must be **GitHub Actions**, not branch **`/`**.

A good `docs/index.html` loads **`./assets/…`**, not **`/src/main.jsx`**. Check with `npm run build` and **`npm run preview`**.

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
   If you use **GitHub Actions**, keep Pages source on **GitHub Actions**. If you use **`npm run deploy`**, it publishes the **`docs/`** folder to the **`gh-pages`** branch; set Pages to deploy from **`gh-pages`** at **`/`** — or prefer **default branch + `/docs`** / **Actions** instead of mixing sources by mistake.

`public/CNAME` (copied into `docs/` on build) should contain only the hostname, e.g. `kashishchawla.com`. The **Custom domain** field in repo settings is what GitHub uses to attach the domain to your site.

## Project layout

- `src/App.jsx` — page content and sections
- `src/index.css` — styles
- `public/` — static assets served as-is (`CNAME`, favicon)

The root `index.html` is Vite’s entry shell; the visible site is rendered by React.
