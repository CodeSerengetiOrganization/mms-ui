e# MMS-UI Migration Plan

Step-by-step plan for migrating the Angular Machine Monitoring System UI to Next.js (mms-ui). Each step has a **copy-paste prompt** for the AI and **test criteria** so you can verify the work. Use this with the project’s `.cursor/rules/` so the AI follows the same patterns every time.

---

## How to Use This Plan

1. **Run one step at a time.** Use the **Prompt** in the table as your chat message (you can shorten to e.g. “Do Step 2” if the step name is clear).
2. **Rules:** `00-project-and-migration.mdc` is always applied. For other rules, **open the file you’re about to change** (e.g. `app/layout.tsx`) before prompting so the right rule attaches via globs, or **@-mention** the rule (e.g. `@02-layout-and-navigation`) if you want it explicitly included.
3. **After the AI generates code,** run the **How to test** checks. Mark the step done only when all pass.
4. **Reference the Angular repo** when useful: e.g. “Match behavior of Angular sidebar” or attach `@path/to/Angular/component.ts`.

---

## Rules Reference (Mapping for Prompts)

Use this to know which rules apply to each step and how to bring them into the conversation.

| Rule file | When it applies | How to use in prompt |
|-----------|------------------|----------------------|
| **00-project-and-migration** | Every conversation | Always on. No need to mention. |
| **01-nextjs-architecture** | App routes, layouts, pages | Open `app/**/*.tsx` or say “follow our Next.js architecture rules.” |
| **02-layout-and-navigation** | Layout, sidebar, header, nav config | Open `app/layout.tsx` or a sidebar/header file, or say `@02-layout-and-navigation`. |
| **03-data-and-api** | API calls, types, errors, env | Open a file under `lib/`, `types/`, or a service, or say `@03-data-and-api`. |
| **04-ui-patterns** | Dashboard, machine-failure pages, KPIs, loading/error/charts | Open a page or component under `app/` or `components/`, or say `@04-ui-patterns`. |
| **05-styling-and-assets** | Tailwind, icons, `public/` assets | Open a `.tsx`/`.css` or asset, or say `@05-styling-and-assets`. |

**Prompt tip:** For a step you can say: *“Do Step N. Follow [rule names from table].”* Or open the relevant file and: *“Implement [step name] per our rules.”*

---

## Migration Steps

### Step 1: Config and redirect

| | |
|--|--|
| **Prompt** | Add `public/config/sidebar.menu.json` with the same structure as the Angular app’s `src/assets/config/sidebar.menu.json`. Add a root redirect so `/` goes to `/dashboard`. Use our project rules. |
| **Rules to use** | 00 (always), 03 (data/config), 05 (assets). Open `app/page.tsx` so 01 applies. |
| **What gets created/changed** | `public/config/sidebar.menu.json`; `app/page.tsx` updated to `redirect('/dashboard')` (from `next/navigation`). |
| **How to test** | Run `npm run dev`. Visit `http://localhost:3000/` → should redirect to `/dashboard`. Open `public/config/sidebar.menu.json` and confirm it has `navigationItems` with dashboard, machine-failure (with children), etc. |

---

### Step 2: Root layout shell

| | |
|--|--|
| **Prompt** | Implement the root layout: sidebar area + main area (header + content). Use placeholder components for Sidebar and Header (e.g. a div with “Sidebar” and “Header” text). Main content area should render `{children}`. Follow our layout and Next.js rules. |
| **Rules to use** | 00, 01 (app router), 02 (layout). Open `app/layout.tsx`. |
| **What gets created/changed** | `app/layout.tsx` with shell structure; optionally `components/layout/Sidebar.tsx` and `components/layout/Header.tsx` as placeholders. |
| **How to test** | Run app. You see a sidebar area, header area, and main content. Navigate to `/dashboard` (after Step 1) and confirm page content appears in the main area. No console errors. |

---

### Step 3: Sidebar component

| | |
|--|--|
| **Prompt** | Implement the Sidebar component. Load navigation from `public/config/sidebar.menu.json`. Render items with Next.js `Link`; use `usePathname()` for the active link style. Support nested items (children) with expand/collapse. Add a collapse toggle for the sidebar. Follow @02-layout-and-navigation and our styling rules. |
| **Rules to use** | 00, 02 (layout and navigation), 05 (styling). Open the Sidebar file or `app/layout.tsx`. |
| **What gets created/changed** | Sidebar component (e.g. `components/layout/Sidebar.tsx`) with nav config fetch, links, active state, submenu expand, collapse toggle. Layout updated to use it. |
| **How to test** | Nav items match config. Clicking a link goes to the correct route. Active link is visually distinct. Expanding “Machine Failure” shows sub-items; clicking Overview/Alerts/etc. works. Collapse toggle narrows the sidebar. |

---

### Step 4: Header component

| | |
|--|--|
| **Prompt** | Implement the Header with the app title “Machine Monitoring System” and a simple user section (e.g. “Admin User” and a Logout button, or “Login” when not logged in). Static for now. Follow layout and styling rules. |
| **Rules to use** | 00, 02 (layout), 05 (styling). Open the Header file. |
| **What gets created/changed** | Header component (e.g. `components/layout/Header.tsx`) with title and user/login UI. Layout uses it in the main area. |
| **How to test** | Title and user/login area visible. No errors. |

---

### Step 5: Route pages (placeholders)

| | |
|--|--|
| **Prompt** | Add placeholder pages: `app/dashboard/page.tsx`, `app/machine-failure/overview/page.tsx`, `app/machine-failure/alerts/page.tsx`, `app/machine-failure/analysis/page.tsx`, `app/machine-failure/ai/page.tsx`. Each page shows a heading only (e.g. “Dashboard”, “Machine Failure – Overview”). Follow Next.js App Router rules. |
| **Rules to use** | 00, 01 (app router). Open `app/dashboard/page.tsx` or one of the machine-failure pages. |
| **What gets created/changed** | One `page.tsx` per route with a title. Optionally `app/machine-failure/layout.tsx` for shared tab shell later. |
| **How to test** | Visit `/dashboard`, `/machine-failure/overview`, `/machine-failure/alerts`, `/machine-failure/analysis`, `/machine-failure/ai`. Each shows the correct heading. Sidebar links to these routes work. |

---

### Step 6: Shared types

| | |
|--|--|
| **Prompt** | Add `lib/types/navigation.ts` (or similar) with `NavigationItem` and any types needed for the sidebar config. Re-export from `lib/types/index.ts` if you use a barrel. Follow @03-data-and-api. |
| **Rules to use** | 00, 03 (data and API / types). Open `lib/types/navigation.ts` or `lib/types/index.ts`. |
| **What gets created/changed** | `lib/types/navigation.ts` with `NavigationItem` (id, label, icon, route?, children?, expanded?). Barrel in `lib/types/index.ts` if desired. |
| **How to test** | No TypeScript errors. Sidebar (or config loader) uses the type. Build passes (`npm run build`). |

---

### Step 7: Dashboard (real UI)

| | |
|--|--|
| **Prompt** | Implement the dashboard page: KPI cards (Machines Online, Active Alerts, Failure Rate, OEE) and Quick Actions section with links to machine-failure alerts, analysis, reports, settings. Use mock data. Follow @04-ui-patterns and styling rules. |
| **Rules to use** | 00, 04 (UI patterns), 05 (styling). Open `app/dashboard/page.tsx`. |
| **What gets created/changed** | Dashboard page with KPI grid and quick action buttons; Tailwind for layout and status styles. Mock KPI data in the component or a small util. |
| **How to test** | Four KPI cards and quick action buttons render. Links go to the right routes. Layout matches the described pattern. Optional: add `app/dashboard/loading.tsx` and confirm loading state shows. |

---

### Step 8: Machine-failure layout and overview shell

| | |
|--|--|
| **Prompt** | Add `app/machine-failure/layout.tsx` with a tab strip (Overview, Alerts, Analysis, AI Insights) using Next.js `Link` and `usePathname()` for active tab. Implement the Overview page: header with title and “Last updated”, placeholder sections for Failed Products, KPIs, Trends, and Top Failure Causes. Follow @02-layout-and-navigation and @04-ui-patterns. |
| **Rules to use** | 00, 01, 02, 04. Open `app/machine-failure/layout.tsx` or `app/machine-failure/overview/page.tsx`. |
| **What gets created/changed** | `app/machine-failure/layout.tsx` with tab nav; `app/machine-failure/overview/page.tsx` with section placeholders. |
| **How to test** | Tabs visible; clicking switches route and active tab updates. Overview shows header and placeholder sections. |

---

### Step 9: Data layer and failed products API

| | |
|--|--|
| **Prompt** | Add types for the failed-products API (e.g. `FailedProductDto`, `MachineStatusResponse`) under `lib/types` or `lib/api`. Add a function (or hook) that POSTs to `{apiBaseUrl}/{apiVersion}/machines/status` with `{ machineId }` and returns failed products. Use env for base URL. Add central error messages (e.g. `lib/errors.ts`) per @03-data-and-api. |
| **Rules to use** | 00, 03 (data and API). Open `lib/types` or a new `lib/api` / `lib/failed-products.ts` file. |
| **What gets created/changed** | Types; `lib/failed-products.ts` (or similar) with fetch + error mapping; `lib/errors.ts` (or similar) with user-facing messages; `.env.local` example for `NEXT_PUBLIC_API_BASE_URL`. |
| **How to test** | Build passes. If backend is available, call the fetch from a temporary page or log result; otherwise mock and confirm types and error handling are used correctly. |

---

### Step 10: Failed products on Overview

| | |
|--|--|
| **Prompt** | On the machine-failure Overview page, add the Failed Products block: call the failed-products API (or hook). Show loading state, error state with message and retry, and empty state. Display a simple table or list of failed products. Follow @04-ui-patterns and @03-data-and-api. |
| **Rules to use** | 00, 03, 04. Open `app/machine-failure/overview/page.tsx` or a new `components/failed-products-table.tsx`. |
| **What gets created/changed** | Overview page (or a child component) that fetches failed products and shows loading/error/empty/data. |
| **How to test** | With mock or real API: loading shows, then data or error or empty. Retry works after error. No unhandled promise rejections. |

---

### Step 11: Alerts, Analysis, and AI Insights pages

| | |
|--|--|
| **Prompt** | Implement placeholder content for Alerts, Analysis, and AI Insights pages (e.g. a title and a short description or “Coming soon”). Match the Angular structure where it exists. Use @04-ui-patterns. |
| **Rules to use** | 00, 04. Open each page file. |
| **What gets created/changed** | `app/machine-failure/alerts/page.tsx`, `analysis/page.tsx`, `ai/page.tsx` with basic content. |
| **How to test** | Each route loads and shows the expected content. Tabs and sidebar work. |

---

### Step 12: Polish (loading, error boundaries, icons)

| | |
|--|--
| **Prompt** | Add `loading.tsx` for dashboard and machine-failure where useful. Add `error.tsx` for the same segments if not already present. Replace any emoji or placeholder icons with Lucide React where appropriate. Follow @04-ui-patterns and @05-styling-and-assets. |
| **Rules to use** | 00, 04, 05. Open `app/dashboard/loading.tsx`, `app/machine-failure/error.tsx`, or icon usage in components. |
| **What gets created/changed** | `loading.tsx` and `error.tsx`; Lucide icons in sidebar/header/dashboard as needed. |
| **How to test** | Navigate and confirm loading states appear; trigger an error and confirm error UI. Icons render correctly. |

---

## Rules-to-Steps Quick Map

| Step | Primary rules |
|------|----------------|
| 1 Config & redirect | 00, 01, 03, 05 |
| 2 Layout shell | 00, 01, 02 |
| 3 Sidebar | 00, 02, 05 |
| 4 Header | 00, 02, 05 |
| 5 Route pages | 00, 01 |
| 6 Shared types | 00, 03 |
| 7 Dashboard | 00, 04, 05 |
| 8 Machine-failure shell & overview | 00, 01, 02, 04 |
| 9 Data layer & API | 00, 03 |
| 10 Failed products UI | 00, 03, 04 |
| 11 Alerts / Analysis / AI | 00, 04 |
| 12 Polish | 00, 04, 05 |

---

## Checklist (copy and tick when done)

- [ ] Step 1: Config and redirect
- [ ] Step 2: Root layout shell
- [ ] Step 3: Sidebar component
- [ ] Step 4: Header component
- [ ] Step 5: Route pages (placeholders)
- [ ] Step 6: Shared types
- [ ] Step 7: Dashboard (real UI)
- [ ] Step 8: Machine-failure layout and overview shell
- [ ] Step 9: Data layer and failed products API
- [ ] Step 10: Failed products on Overview
- [ ] Step 11: Alerts, Analysis, AI Insights pages
- [ ] Step 12: Polish (loading, error, icons)
