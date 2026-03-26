# MIGRATION_GUIDE.md — Astro → Next.js (App Router) + Supabase

This file is the **source of truth** for the Astro → Next.js migration. It defines **what we build**, **in what order**, and **how we prove it works**.

Per **Code Complete Ch. 3 (Measure Twice, Cut Once)** and **Ch. 8 (Defensive Programming)**: we make progress via a repeatable protocol + objective checklists, not “we think it’s done”.

---

## Goals & non-goals (this kickoff)

- **Goals**
  - Stand up a new Next.js App Router app in `eventio-next/`.
  - Add Tailwind + `clsx` + `tailwind-merge` and a canonical `cn()` helper.
  - Add Supabase initialization for **server**, **client**, and **middleware**.
  - Add a repeatable command to generate **database types** into `eventio-next/src/types/database.ts`.
  - Track migration progress via the checklist at the bottom.

- **Non-goals**
  - No page ports yet (Phase 0 will start after green light).
  - No schema design / RLS design in this step (we’ll document expectations and enforce server checks later).

Per **Code Complete Ch. 2 (Metaphors & conceptual integrity)**: we keep one app “current” at a time while avoiding a risky big-bang switch.

---

## Repo topology (during migration)

- **Current Astro app**: `celestial-cloud/`
- **New Next.js app**: `eventio-next/`

Rationale: safe parallel run, isolated deps, minimal churn during early infrastructure work. (Per **Code Complete Ch. 6 (Building quality into the process)**.)

---

## Phase roadmap

### Phase 0 — Infrastructure

Deliverables:
- **Shared layout shell**: App-wide layout, typography, spacing, background, meta patterns.
- **UI atoms**: `Button`, `Input`, `Textarea`, `Card`, `Badge/Chip`, etc.
- **Auth middleware**: session sync + route protection hooks (no page wiring until Phase 1).
- **Supabase types**: generated into the repo and used in server queries.

Per **Code Complete Ch. 7 (High-Quality Routines)**: stabilize core “routines” first so feature work is mechanical.

### Phase 1 — Auth & User

Pages/flows:
- Login
- Register
- Profile (view + update)

Key concerns:
- session persistence
- redirects
- server-side authorization checks

Per **Code Complete Ch. 23 (Debugging)**: keep auth flows deterministic and observable.

### Phase 2 — Events core

Pages/flows:
- Events list
- Event detail (**dynamic route**)
- Create event (validation via **Zod**)
- Join / leave logic

Key concerns:
- server-side validation
- ownership checks (edit/delete)
- event expiry checks
- concurrency (capacity, duplicate joins)

Per **Code Complete Ch. 22 (Developer testing)**: add route-level smoke checks as we port.

### Phase 3 — Static & content

Pages/flows:
- Home
- About
- Blog (and supporting routes/components)

Per **Code Complete Ch. 5 (Design in construction)**: defer content until the system skeleton is stable.

---

## Project core setup (Next.js + Tailwind + utilities)

### Next.js app

Location: `eventio-next/`

Baseline conventions (App Router):
- `src/app/` contains routes and layouts.
- Prefer **Server Components by default**; opt into Client Components only when needed.  
  (Per **Code Complete Ch. 10 (General issues in software design)**: keep complexity local.)

### Tailwind + `clsx` + `tailwind-merge`

We standardize class composition with:
- `clsx` (conditional class assembly)
- `tailwind-merge` (dedupe conflicting utilities)
- `cn()` helper in `src/lib/cn.ts`

Per **Code Complete Ch. 11 (The Power of Variable Names)**: one canonical helper avoids dozens of ad-hoc patterns.

---

## Supabase setup (Server / Client / Middleware)

### Dependencies

- `@supabase/supabase-js`
- `@supabase/ssr`

### Environment variables

Create `eventio-next/.env.local` (not committed) containing:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; never expose client-side)

Per **Code Complete Ch. 8 (Defensive Programming)**: we treat secrets as hazardous materials—explicit boundaries and no accidental exposure.

### Where code lives

- `eventio-next/src/lib/supabase/client.ts` — browser client
- `eventio-next/src/lib/supabase/server.ts` — server client (uses request cookies)
- `eventio-next/src/lib/supabase/middleware.ts` — middleware helper
- `eventio-next/src/middleware.ts` — Next middleware entrypoint (session sync + hooks)

---

## Database type generation (Supabase `gen types`)

Output file:
- `eventio-next/src/types/database.ts`

### Working agreement (required)

- **When schema/RLS changes**: rerun `db:types` and commit the updated `eventio-next/src/types/database.ts`.
- **CI will fail** if `database.ts` is out-of-date (see repo workflow).

Per **Code Complete Ch. 28 (Configuration management)**: type generation is a build artifact and must be reproducible.

### Recommended workflow: Remote project types

Requires:
- Supabase CLI installed (or `npx supabase ...` if available)
- A Supabase project id

Command shape:

```bash
supabase gen types typescript --project-id "<PROJECT_ID>" --schema public > "src/types/database.ts"
```

CI note:
- Remote type generation requires auth. Use `supabase login` locally, and store `SUPABASE_ACCESS_TOKEN` as a GitHub Actions secret for CI.

### Alternative workflow: Local types (if/when we add a `supabase/` folder)

If you later run local Supabase (`supabase start`), you can generate from local config and keep it in sync.

Per **Code Complete Ch. 28 (Configuration management)**: this is a build step; it must be documented, repeatable, and produce a single canonical artifact.

---

## Strict migration protocol (Astro → Next)

For every page/route:

1. **Identify source** `.astro` and its route.
2. **Port structure** into Next App Router (`src/app/...`) using Server Components by default.
3. **Extract components** into:
   - `src/components/ui/` (atoms)
   - `src/components/shared/` (cross-cutting)
   - `src/components/sections/` (page sections)
4. **Add data + guards** (server-side first; no client-only security).
5. **Test** (smoke + critical guard assertions).
6. **Delete old `.astro` file** once the Next route is live.
7. **Update checklist**: Pending → In Progress → Migrated → Cleaned Up

Per **Code Complete Ch. 12 (Fundamental data types)** and **Ch. 22 (Testing)**: keep each migration step small, verifiable, and reversible.

---

## Component architecture (target)

```text
eventio-next/
  src/
    app/                  # Routes + layouts (App Router)
    components/
      ui/                 # Buttons, inputs, cards (no business logic)
      shared/             # Nav, auth widgets, shells
      sections/           # Page sections (compose ui/shared)
    features/
      auth/               # Auth-specific domain logic
      events/             # Events domain logic (CRUD + joins)
    lib/
      cn.ts               # cn() helper (clsx + tailwind-merge)
      supabase/
        client.ts
        server.ts
        middleware.ts
    types/
      database.ts         # Generated types (Supabase)
```

Per **Code Complete Ch. 4 (Key construction decisions)**: clear boundaries early prevent architecture drift.

---

## Security guards checklist (server-side)

These are **non-negotiable** server checks for event flows. UI affordances are not security.

- **Authentication**
  - [ ] Protected routes redirect unauthenticated users
  - [ ] Authenticated users are redirected away from auth pages (as desired)

- **Authorization: ownership**
  - [ ] Only event owner can edit/update/delete the event
  - [ ] Only event owner can see owner-only controls/data

- **Event expiry**
  - [ ] Cannot join expired events
  - [ ] Cannot edit expired events (policy-defined)
  - [ ] Cannot leave expired events (policy-defined)

- **Join/leave invariants**
  - [ ] No duplicate joins
  - [ ] Capacity enforced (if applicable)
  - [ ] Server rejects inconsistent states (race conditions)

Per **Code Complete Ch. 8 (Defensive Programming)**: trust boundaries are explicit and validated at the boundary.

---

## Interactive checklist (pages)

Legend:
- **Pending**: not started
- **In Progress**: actively being ported
- **Migrated**: Next route works + verified
- **Cleaned Up**: old `.astro` deleted + imports cleaned + checklist updated

> Note: current Astro pages are static mock screens, but they define the routes and UI variants we must preserve.

### Auth & user

- **/** (`celestial-cloud/src/pages/index.astro`)
  - [ ] Pending  - [ ] In Progress  - [ ] Migrated  - [ ] Cleaned Up
- **/login** (`celestial-cloud/src/pages/login.astro`)
  - [ ] Pending  - [ ] In Progress  - [ ] Migrated  - [ ] Cleaned Up
- **/signup** (`celestial-cloud/src/pages/signup.astro`)
  - [ ] Pending  - [ ] In Progress  - [ ] Migrated  - [ ] Cleaned Up
- **/profile** (`celestial-cloud/src/pages/profile.astro`)
  - [ ] Pending  - [ ] In Progress  - [ ] Migrated  - [ ] Cleaned Up

### Events core

- **/dashboard** (grid) (`celestial-cloud/src/pages/dashboard.astro`)
  - [ ] Pending  - [ ] In Progress  - [ ] Migrated  - [ ] Cleaned Up
- **/dashboard-list** (list) (`celestial-cloud/src/pages/dashboard-list.astro`)
  - [ ] Pending  - [ ] In Progress  - [ ] Migrated  - [ ] Cleaned Up
- **/dashboard-detail** (`celestial-cloud/src/pages/dashboard-detail.astro`)
  - [ ] Pending  - [ ] In Progress  - [ ] Migrated  - [ ] Cleaned Up
- **/dashboard-detail-joined** (`celestial-cloud/src/pages/dashboard-detail-joined.astro`)
  - [ ] Pending  - [ ] In Progress  - [ ] Migrated  - [ ] Cleaned Up
- **/dashboard-detail-edit** (`celestial-cloud/src/pages/dashboard-detail-edit.astro`)
  - [ ] Pending  - [ ] In Progress  - [ ] Migrated  - [ ] Cleaned Up
- **/create-new** (`celestial-cloud/src/pages/create-new.astro`)
  - [ ] Pending  - [ ] In Progress  - [ ] Migrated  - [ ] Cleaned Up

### Static & content (future)

- [ ] Home enhancements (Next) — Pending
- [ ] About — Pending
- [ ] Blog — Pending

