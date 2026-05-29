# Sourdough House Supabase Admin Migration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the placeholder localStorage admin with a Supabase-backed authenticated admin that edits bakery catalog/content objects safely.

**Architecture:** Keep Hotplate as the source for current sale/inventory data. Move the “What we bake” catalog, admin-editable site content, testimonials, and optional announcements into Supabase tables with Row Level Security. Use Next.js App Router server components for public reads, Supabase SSR helpers for auth/session handling, and server actions for admin mutations.

**Tech Stack:** Next.js App Router, React, TypeScript, `@supabase/supabase-js`, `@supabase/ssr`, Supabase Auth, Postgres Row Level Security, Supabase CLI-generated TypeScript types.

---

## Current State

- Hotplate-backed live menu is implemented in `lib/hotplate/api.ts`.
- The “What we bake” catalog is code-backed in `content/site-content.ts` as `bakeCatalogItems`.
- `/menu` has two tabs:
  - “Currently on sale” from Hotplate.
  - “What we bake” from the local catalog.
- `/admin` is a placeholder editor in `app/admin/page.tsx` and `components/admin-catalog-editor.tsx`.
- Admin edits save to browser `localStorage`; they are not shared, secure, or production persistent.
- Supabase placeholders exist in `lib/supabase/`, `.env.example`, and `types/database.ts`.

## Supabase Setup Decisions

- Keep Hotplate as checkout/current inventory source for v1.
- Use Supabase for admin-managed display content only:
  - Typical bakery catalog.
  - Site settings/contact/social links.
  - Testimonials.
  - Announcements or pickup notes.
- Use Supabase Auth with one or more approved admin emails.
- Enable RLS on all public schema tables. Supabase docs state RLS should be enabled for exposed schemas, especially `public`.
- Generate TypeScript types with the Supabase CLI after the schema exists.

References checked:

- Supabase Next.js SSR auth docs: https://supabase.com/docs/guides/auth/server-side/nextjs
- Supabase Row Level Security docs: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase TypeScript type generation docs: https://supabase.com/docs/guides/api/rest/generating-types

## Proposed Schema

Create these tables in Supabase:

```sql
create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  category text not null,
  image_url text not null,
  price_label text,
  note text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  is_typically_available boolean not null default true,
  show_price boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  name text not null,
  source text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  cta_label text,
  cta_url text,
  is_active boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

RLS policy shape:

- Public `select` allowed only for active public content:
  - `catalog_items.is_active = true`
  - `testimonials.is_active = true`
  - active announcements by date.
- Admin `select/insert/update/delete` allowed only when `auth.uid()` is in `admin_users`.
- Do not expose Supabase service role keys to the browser.

## Task 1: Add Supabase Environment And Clients

**Files:**

- Modify: `.env.example`
- Modify: `lib/supabase/config.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/client.ts`
- Create: `middleware.ts`

**Steps:**

1. Add required env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_PROJECT_REF`
2. Implement browser client with `createBrowserClient`.
3. Implement server client with `createServerClient` and Next cookies.
4. Add middleware to refresh Supabase sessions.
5. Run `npm run typecheck`.

Expected result: app still builds with Supabase env vars present; public pages do not require login.

## Task 2: Add Database Types Workflow

**Files:**

- Modify: `package.json`
- Replace: `types/database.ts`
- Create: `supabase/README.md`

**Steps:**

1. Add Supabase CLI dev dependency:
   - `npm install -D supabase`
2. Add scripts:
   - `supabase:login`
   - `supabase:types`
3. Generate types after Supabase project exists:
   - `npx supabase gen types typescript --project-id "$SUPABASE_PROJECT_REF" --schema public > types/database.ts`
4. Run `npm run typecheck`.

Expected result: `types/database.ts` is generated from the live schema and used by Supabase clients.

## Task 3: Migrate Catalog Data To Supabase

**Files:**

- Create: `lib/catalog/queries.ts`
- Create: `lib/catalog/actions.ts`
- Modify: `lib/catalog/types.ts`
- Modify: `lib/catalog/catalog.ts`
- Modify: `app/menu/page.tsx`
- Modify: `app/page.tsx`

**Steps:**

1. Seed Supabase `catalog_items` from current `bakeCatalogItems`.
2. Implement `getCatalogItems()` server query:
   - reads active items ordered by `sort_order`, then name.
   - maps DB rows into the existing `PublicCatalogItem` shape.
3. Keep code-backed fallback if Supabase is unavailable.
4. Update `/menu` and home page to read catalog from Supabase first.
5. Add tests for DB-row-to-public-item mapping.
6. Run `npm run test`, `npm run typecheck`, and `npm run build`.

Expected result: public catalog renders from Supabase when configured and falls back to code data when not configured.

## Task 4: Add Protected Admin Login

**Files:**

- Create: `app/login/page.tsx`
- Create: `app/auth/callback/route.ts`
- Create: `lib/auth/admin.ts`
- Modify: `app/admin/page.tsx`

**Steps:**

1. Add email magic-link login or password login through Supabase Auth.
2. Add callback route for session establishment.
3. Add `requireAdmin()` helper:
   - reads current user.
   - checks `admin_users`.
   - redirects unauthenticated users to `/login`.
   - blocks authenticated non-admin users.
4. Protect `/admin` with `requireAdmin()`.
5. Add logout action.
6. Browser test:
   - logged out `/admin` redirects to `/login`.
   - approved admin can access `/admin`.
   - unapproved user is blocked.

Expected result: `/admin` is not publicly accessible.

## Task 5: Replace localStorage Admin Editor

**Files:**

- Modify: `components/admin-catalog-editor.tsx`
- Create: `components/admin-catalog-table.tsx`
- Create: `components/admin-catalog-form.tsx`
- Modify: `lib/catalog/actions.ts`
- Modify: `app/admin/page.tsx`

**Steps:**

1. Remove localStorage reads/writes.
2. Load catalog rows from Supabase on the server.
3. Use server actions for:
   - create item.
   - update item.
   - toggle active.
   - toggle show price.
   - toggle typically available.
   - toggle featured.
   - reorder item.
4. Validate admin permission inside every server action.
5. Revalidate `/`, `/menu`, and `/admin` after mutations.
6. Browser test an edit and verify it appears on `/menu`.

Expected result: admin changes persist across browsers/devices.

## Task 6: Move Site Settings And Testimonials

**Files:**

- Create: `lib/content/queries.ts`
- Create: `lib/content/actions.ts`
- Modify: `components/site-footer.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `components/testimonial-band.tsx`
- Modify: `content/site-content.ts`

**Steps:**

1. Seed `site_settings` with:
   - email.
   - social URLs.
   - pickup area.
   - short footer copy.
2. Seed `testimonials` from current code values.
3. Read public settings/testimonials from Supabase with code fallback.
4. Add admin editor fields for settings/testimonials only after catalog admin works.
5. Run full verification.

Expected result: non-menu copy that needs owner editing is Supabase-backed.

## Task 7: Production Hardening

**Files:**

- Modify: `README.md`
- Modify: `DEPLOYMENT.md`
- Create: `docs/admin-runbook.md` or save under workspace Documents if this repo should stay lean.

**Steps:**

1. Document Supabase project setup.
2. Document required env vars for Vercel.
3. Document how to add an admin user.
4. Document how to regenerate types.
5. Document rollback:
   - disable `/admin` route.
   - fall back to code-backed catalog.
6. Verify production build with env vars set.

Expected result: the site is deployable with a real authenticated admin workflow.

## Verification Checklist

Run after implementation:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Browser QA:

- `/` renders featured catalog items.
- `/menu` renders two tabs.
- “Currently on sale” still uses Hotplate.
- “What we bake” uses Supabase catalog rows.
- `/admin` redirects when logged out.
- approved admin can edit catalog items.
- price visibility toggle hides/shows price on `/menu`.
- active toggle removes/restores item on `/menu`.
- featured toggle affects home page.

## Acceptance Criteria

- No public `/admin` access without login.
- No service role key in browser code or client env vars.
- RLS enabled on all new public schema tables.
- Public reads only expose active display content.
- Admin mutations require an authenticated approved admin.
- Code-backed fallback remains available for catalog/content if Supabase is down during development.
- Generated database types are committed after the Supabase schema exists.

