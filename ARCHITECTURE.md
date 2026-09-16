# Architecture

The UI (`<root>/ui`, Vite) and API (`<root>/server`, Express) are now deployed as two separate Vercel projects.

## Why not use Vercel `<root>/api` convention?

The [`<root>/api` convention](https://vercel.com/templates/other/nodejs-serverless-function-express) requires more setup:

- `<root>/api/index.ts` containing the request handler(vercel function) which wraps the app.
  This file can't be placed inside the server directory like `<root>/server/index.ts`.

- `vercel.json` with rewrites mapping `/api/*` to it.

- Build step (tsup): Must bundle the app along with the dependencies.  
  NOTE: Without bundled dependencies, the imports break at runtime as node tries to find the
  dependencies in `<root>/api/node_modules` (non existent) and the parent folders but never
  finds them since the installed dependencies reside under `<root>/server/node_modules`.

On the other hand, [the standard express project](https://vercel.com/docs/frameworks/backend/express)
requires no handler wrapper, no `/api` rewrites, no bundled dependencies.
The single `vercel.json` rewrite (`/` → `/index.html`) exists only because
root-path directory-index resolution does not apply next to the function
catch-all — without it, `/` falls through to the app's 404 instead of the
static file (verified: `/index.html` serves while `/` 404s).

## Why not a monolith (UI served from the API project)?

Considered and rejected. Serving the UI build from `server/public/` on a
single project would restore same-origin cookies, but:

- **Fragile build-output bookkeeping.** It would copy the UI output
  (`index.html`, `assets/`, favicons, …) into `server/public/` at build time
  while product images in the same directory stay committed — both the copy
  step and `.gitignore` must hardcode Vite's output file list, and any new
  output file silently fails to deploy until both lists are updated.

- **Atomic deployments.** Every UI-only change would redeploy the API too,
  and a broken API build would block a UI hotfix (and vice versa).

- **Unneeded.** The custom domain already gives same-site, first-party
  cookies, which was the monolith's main motivation. And the historical
  reason for splitting (Render free tier sleeping 15 min, making a
  server-hosted UI unreachable for ~50s on wake — see `822b5f4`) does not
  apply to Vercel, where static files serve from the CDN independently of
  the function.
