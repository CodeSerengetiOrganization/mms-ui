# Tech note: Dockerfile (Angular vs Next.js) & why we don’t need Nginx in React

Learning material for the mms-ui (Next.js) vs Angular repo Docker setups.

---

## 1. Two Dockerfiles compared

### Stage 1 (Build)

| Aspect | **mms-ui (Next.js)** | **Angular repo** |
|--------|----------------------|------------------|
| Base image | `node:22-alpine` | `node:22-alpine` |
| Package manager | **pnpm** (Corepack + `pnpm install --frozen-lockfile`) | **npm** (`npm ci`) |
| Lockfile / copy | `package.json` + `pnpm-lock.yaml` | `package*.json` |
| Build command | `pnpm run build` | `npm run build:spa` |

### Stage 2 (Runtime)

| Aspect | **mms-ui (Next.js)** | **Angular repo** |
|--------|----------------------|------------------|
| Final image | `node:22-alpine` | `nginx:alpine` |
| Non-root user | Yes (`nextjs` / `nodejs`) | No (nginx default user) |
| What’s copied | `.next/standalone`, `.next/static`, `public` | `dist/browser/` → nginx html root |
| Config / setup | — | Custom nginx config; cache buster; cleanup of html dirs |
| Port | **3000** | **80** |
| Env vars | `PORT=3000`, `HOSTNAME="0.0.0.0"` | — |
| CMD | `["node", "server.js"]` | `["nginx", "-g", "daemon off;"]` |

**Takeaway:** Angular image = static build + Nginx to serve it. Next.js image = Node server running the standalone app. Different by design.

---

## 2. Why we don’t need Nginx in the React/Next.js image

### What Nginx does in the Angular image

1. **Serves the built app**  
   Angular build is static files (HTML/JS/CSS). Nginx serves them.

2. **SPA routing**  
   For paths like `/dashboard` or `/machine-failure`, Nginx is configured to serve `index.html` so the client-side router can handle them (no 404 on refresh).

3. **Avoiding CORS (reverse proxy)**  
   The browser talks only to one origin (e.g. `https://app.example.com`). Nginx proxies e.g. `/api/*` to the real backend. The app calls `/api/...` on the same origin; Nginx forwards to the API. So the browser never does a cross-origin request → no CORS.

So in Angular: Nginx = static file server + SPA fallback routing + reverse proxy for the API.

### Why Next.js doesn’t need that inside the image

Next.js runs as a **Node server** (standalone), not only static files:

1. **Routing**  
   The Next.js server already knows all routes (App Router). It serves the right page for `/dashboard`, `/machine-failure`, etc. No need for another layer to “handle routing” or serve `index.html` for every path.

2. **Avoiding CORS**  
   Same idea, but inside Next.js:
   - **API Routes** (`app/api/...`): backend logic in the same app → same origin, no CORS.
   - **Rewrites** in `next.config`: e.g. proxy `/api/*` to the real backend. Browser only talks to the Next.js origin; Next.js server calls the backend. No cross-origin request from the browser → no CORS.

So in the React/Next.js setup we don’t need Nginx in the image because **routing** and **CORS avoidance** can both be handled by the Next.js server (routes + API Routes or rewrites).

### Optional: Nginx in front of Next.js

You can still put Nginx (or another reverse proxy) **in front of** the Next.js container for TLS, load balancing, caching, etc. That’s a deployment choice. Inside the image, the Node process is enough.
