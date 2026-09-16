# Deployment

The frontend and backend deploy as **two separate Vercel projects**.

- **UI project** — Vite static site from `ui/`
- **Server project** — Express app from `server/`

## Server

1. Go to [Vercel Dashboard](https://vercel.com) → **New Project** → Import this GitHub repo
2. Configure:
   - **Root Directory**: `server`
   - **Framework Preset**: Other (Express is auto-detected; leave **Build Command** empty)
   - **Environment Variables**: Refer [.env.example](server/.env.example)

## UI

1. Go to [Vercel Dashboard](https://vercel.com) → **New Project** → Import this GitHub repo
2. Configure:
   - **Root Directory**: `ui`
   - **Framework Preset**: Vite (auto-detected; Build Command `npm run build`, Output Directory `dist`)
   - **Environment Variables**: Refer [.env.example](ui/.env.example)

## Custom domain (recommended)

With plain `.vercel.app` URLs the two projects are **cross-site**
(`vercel.app` is a public suffix), so the auth cookie is third-party and
login breaks if third party cookies are disabled in user's browser.

A custom domain fixes this: UI on `myshop.com`, API on `api.myshop.com` —
same site, so the cookie stays first-party and works everywhere with default
browser settings.

1. Deploy both projects first, then in Vercel Dashboard add
   `myshop.com` (plus `www.myshop.com`, redirecting one to the other so only
   one serves the site) to the **UI project** and
   `api.myshop.com` to the **API project**, configuring DNS as instructed.

2. Set `TRUSTED_ORIGINS=https://myshop.com` (add `https://www.myshop.com` too
   if you serve the UI there) on the **API project**.

3. Set `VITE_BACKEND_URL=https://api.myshop.com` on the **UI project**.

## References

- https://vercel.com/docs/frameworks/backend/express
- https://vercel.com/kb/guide/ship-a-express-app-on-vercel
