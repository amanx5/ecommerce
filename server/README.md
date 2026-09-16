# E-Commerce Backend

## Requirements

* **Node.js 22.x**
  This server relies on Node's built-in `--env-file` flag to load custom environment variables before application code executes.

---

## Development

### Start the Server

```sh
npm run dev
```

Or run directly:

```sh
# Using tsx watch
tsx watch --env-file=.env.dev src/server.ts
```

---

## Production (Serverless)

The API deploys as its own Vercel project (Root Directory: `server`) with
zero configuration: `src/app.ts` default-exports the Express app and
Vercel serves it as a single function ([see docs](https://vercel.com/docs/frameworks/backend/express)). 

No `vercel.json`, build command, or serverless wrapper is needed.

Required production env vars (see `.env.example`): `DATABASE_URL`
(Postgres), `AUTH_SECRET`, `TRUSTED_ORIGINS` (the UI origin),
`VERCEL_EXPERIMENTAL_BACKENDS=1` (path-alias support), `NODE_ENV`.

---

## Production (long running server)

- Build the server
```sh
npm run build
```

> [!NOTE]
> It uses "tsup" to compile the source files. "tsc" is not used as the source files contains path-aliases and extension-less imports and "tsc" doesn't convert them to relative imports. Node only understands relative imports, so non-relative imports will break during runtime code. A bundler like "tsup" rewrites non relative imports present in source code to relative imports in compiled code.

-  Run the build
```sh
node --env-file=.env.prod dist/server.js
```

---
