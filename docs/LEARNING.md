# Learning Guide: Angular → React + Next.js

This guide helps you learn from the mms-ui migration. Use it **before** and **during** the migration so you build understanding of (1) how to migrate Angular to React+Next.js, (2) tech mapping, (3) React+Next.js app structure, and (4) best practices.

---

## 1. Before You Start: 30–60 Minute Orientation

Do this once so you have a mental map. You don’t need to build anything yet.

### A. React basics (if you haven’t)

- **Components:** Functions that return JSX (no classes).
- **Props:** Data and callbacks passed in (like `@Input()` / `@Output()`).
- **State:** `useState` for local UI state (like component fields in Angular).
- **Effects:** `useEffect` for “run after render” (like `ngOnInit` / `ngOnChanges`); in Next we often avoid it for data and use Server Components or a data library instead.

### B. Next.js App Router (structure)

- **`app/` = routes:** Folders and `page.tsx` define URLs. `app/dashboard/page.tsx` → `/dashboard`.
- **`layout.tsx`:** Wraps all pages in that segment (like a shell). Root `app/layout.tsx` wraps the whole app.
- **`loading.tsx` / `error.tsx`:** Per-segment loading and error UI.
- **Server vs Client:** By default everything is a Server Component (no `useState`/`useEffect`). Add `'use client'` only when you need interactivity or browser APIs.

### C. Angular → React/Next mapping (high level)

- **Template:** `.html` + `*ngIf` / `*ngFor` → JSX: `{ condition && <X /> }`, `items.map(...)`.
- **Services + HTTP:** Injectable + `HttpClient` → `fetch` in Server Components or a small `lib/` helper; or TanStack Query on the client.
- **Routing:** Angular `Router` / `routerLink` → Next.js `<Link href="...">` and `usePathname()` for “active” state.
- **State:** RxJS / services → component state (`useState`), or server data (no client state), or a small store (e.g. Zustand) only if needed.

### Suggested reading (skim, don’t memorize)

- [Next.js App Router](https://nextjs.org/docs/app) – “Routing” and “Rendering” (Server vs Client).
- [React docs](https://react.dev) – “Learn React” → “Your First Component”, “Adding Interactivity”, “Managing State”.

---

## 2. Tech Mapping Cheat Sheet

Keep this open while reviewing AI-generated code. It matches the mapping in `.cursor/rules/00-project-and-migration.mdc`.

| You want… | In Angular | In React / Next.js |
|------------|------------|---------------------|
| Conditional UI | `*ngIf="x"` | `{x && <Y />}` |
| List | `*ngFor="let i of items"` | `{items.map(i => <Item key={i.id} />)}` |
| Property binding | `[prop]="val"` | `prop={val}` |
| Event | `(click)="fn()"` | `onClick={fn}` |
| Route link | `routerLink="/x"` | `<Link href="/x">` |
| Active link | `routerLinkActive` | `usePathname()` and `pathname === href` |
| HTTP get | `HttpClient.get()` (Observable) | `fetch()` or `useQuery()` |
| Shared “service” logic | Injectable + RxJS | `lib/` functions or hooks; Server Components with `fetch` |
| Root layout | `app.component.html` + router-outlet | `app/layout.tsx` with `{children}` |
| Child route | `router-outlet` in parent | Nested `app/.../page.tsx` and optional `layout.tsx` |
| Input | `@Input() prop` | `props.prop` in function signature |
| Output | `@Output() event` | `onEvent` callback prop |
| Async data in template | `observable \| async` | Server Component `async` + `await fetch`, or `useQuery` on client |

---

## 3. React + Next.js Application Structure

After the migration (or after Step 2), walk through the repo and name what each part does:

| Path | Purpose |
|------|---------|
| `app/layout.tsx` | Root shell (sidebar + header + main). Wraps every page. |
| `app/page.tsx` | Root route (`/`). Often just redirects to `/dashboard`. |
| `app/dashboard/page.tsx` | Dashboard route and UI. |
| `app/machine-failure/layout.tsx` | Shared tab strip for all machine-failure routes. |
| `app/machine-failure/overview/page.tsx` | Overview tab content. Same idea for `alerts`, `analysis`, `ai`. |
| `app/**/loading.tsx` | Loading UI for that segment while data loads. |
| `app/**/error.tsx` | Error boundary UI for that segment. |
| `components/` | Reusable UI (Sidebar, Header, cards, tables). |
| `lib/` | Shared logic: types, API helpers, error messages. Not Angular “services” but plain functions or hooks. |
| `public/` | Static assets and config (e.g. `config/sidebar.menu.json`). |

**Mental model:** Routes = folder tree under `app/`. Each `page.tsx` is one route. `layout.tsx` wraps all pages in that folder. Components and `lib/` are used by pages and layouts.

---

## 4. Learning Lens: What to Look At Each Step

Use the migration as the main curriculum. Before or after each step, look at the following so you connect “what the AI did” to your four goals.

| Step (from MIGRATION-PLAN.md) | Focus your learning on |
|-------------------------------|------------------------|
| **1–2** | **Structure:** How `app/` is organized (routes, `layout.tsx`, `page.tsx`). |
| **3–4** | **Mapping + structure:** Sidebar/Header code: JSX, `usePathname()`, `<Link>`. Compare to Angular template and router. |
| **5–6** | **Structure:** One route = one `page.tsx`. Types in `lib/types`. |
| **7–10** | **Migration + best practice:** Where data is fetched (server `async` vs client hook). How loading/error/empty are implemented. Read `.cursor/rules/01-nextjs-architecture.mdc` and `04-ui-patterns.mdc` and see how the code follows them. |
| **All steps** | **Rules:** After the AI generates code, open the relevant `.cursor/rules` file and compare: “The AI did X because the rule says Y.” |

---

## 5. Best Practices (What the Rules Encode)

Summarized from `.cursor/rules/` so you know *why* the code looks the way it does:

- **Server Components first:** Default to no `'use client'`. Add it only for interactivity (state, effects, event handlers, browser APIs).
- **Data fetching:** Prefer `async` Server Components and `fetch`. Use TanStack Query or a hook with `fetch` on the client when you need refetch, filters, or retry. Avoid “fetch in `useEffect`” for initial load when server fetch is possible.
- **Routing:** Use the App Router. One `page.tsx` per route; use `layout.tsx` for shared shell (e.g. tab strip). Use `<Link href="...">` and `usePathname()` for active state.
- **Structure:** Keep types and API helpers in `lib/`. Keep components in `components/` or next to the route. Use Tailwind for styling; Lucide for icons.
- **Errors and loading:** Central error messages; map HTTP status to user-facing text. Show loading and error state in the UI; retry for server/network errors.

---

## 6. Suggested Order of Learning

1. **Structure first:** Skim Next.js App Router docs (routes = folders, `page.tsx`, `layout.tsx`). After Step 2, walk through `app/` in the repo and name each file’s role.
2. **Mapping second:** Use the cheat sheet (Section 2) and, after each component the AI creates, find one example: “Angular would do X, here we have Y.”
3. **Best practice third:** Read `01-nextjs-architecture.mdc` and `04-ui-patterns.mdc`. After Steps 7–10, check: “Is data fetched on the server or client? Where is loading/error?”
4. **Ongoing:** After each step, ask: “What would the Angular version look like for this screen? What’s the React/Next equivalent?” That ties all four goals together.

---

## 7. Before-We-Start Checklist

- [ ] Spend 30–60 min on: React (components, props, useState, useEffect) and Next.js App Router (`app/`, `page.tsx`, `layout.tsx`, Server vs Client).
- [ ] Skim `.cursor/rules/00-project-and-migration.mdc` and use its mapping table as your cheat sheet; keep it open while reviewing code.
- [ ] Know where `MIGRATION-PLAN.md` is and that each step has a prompt, “How to test,” and “Rules to use.”
- [ ] Decide: “After each step I’ll read the changed files and the relevant rule file so I see why the code looks like this.”
- [ ] (Optional) Add your own notes below or in a separate file: “Angular → I see this in React as …” as you go.

---

## 8. Your Notes (optional)

Use this space to jot down what you learned as you migrate, e.g.:

- Angular `X` → In this project we do `Y` because …
- File `Z` is the React/Next equivalent of Angular …
