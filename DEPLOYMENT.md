# Deployment

The Vite frontend and the Express API deploy together as one Vercel project:

- UI is served from `ui/dist`
- All `/api/*` requests are handled by the serverless function in `api/serverless.js`
- Product images are static assets (`ui/public/images` → `/images/*` on the CDN), not served by the function.


## Production deployment

1. Go to [Vercel Dashboard](https://vercel.com) → **New Project** → Import this GitHub repo
2. Configure:
    - **Framework Preset**: Vite
    - **Root Directory**: `./` (monorepo root)
    - **Build Command**: `pnpm build`
    - **Output Directory**: `ui/dist`
    - **Environment Variables**:
      - `DATABASE_URL`: Your PostgreSQL database URL (e.g. from Neon, Supabase, with `?sslmode=require`)
      - `AUTH_SECRET`: Secret key for JWT auth token
      - `NODE_ENV`: `production`
3. **First deploy only** — seed the catalog: temporarily add `DB_SEED=true`,
   deploy, then remove the variable again.


## Environment variables

All variables and their defaults are documented with comments in each package's `.env.example`:
- [`server/.env.example`](server/.env.example)
- [`ui/.env.example`](ui/.env.example)
