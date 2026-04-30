# Deployment

### 1. Backend (Render)

1. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Web Service**
2. Connect GitHub repo
3. Configure:
    - **Root Directory**: `server`
    - **Build Command**: `pnpm install --filter server... --frozen-lockfile && pnpm run build`
    - **Start Command**: `pnpm run start`
    - **Environment Variables**: Refer [server/.env.example](server/.env.example)

### 2. Frontend (Vercel)

1. Go to [Vercel](https://vercel.com) → **New Project** → Import GitHub repo
2. Configure:
    - **Framework Preset**: Vite
    - **Root Directory**: `ui`
    - **Build Command**: `pnpm run build`
    - **Install Command**: `pnpm install --filter ui... --frozen-lockfile`
    - **Output Directory**: `dist`
    - **Environment Variables**: Refer [ui/.env.example](ui/.env.example)


### 3. Update CORS and Deploy both environments

After Vercel gives you a URL, update the `ALLOWED_ORIGIN` env var on Render to match.

