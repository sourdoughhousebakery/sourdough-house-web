# Sourdough House Bakery

Production Next.js site for Sourdough House Bakery, rebuilt from the v3 static prototype into a maintainable multi-route app.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4
- Motion
- Hotplate public menu data
- Disk or Supabase-backed admin data source

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` when local overrides are needed.

```bash
NEXT_PUBLIC_SITE_URL=https://sourdough-house-bakery.vercel.app
HOTPLATE_CHEF_ID=sourdoughhouse43
ADMIN_DATA_SOURCE=disk
ADMIN_EMAILS=owner@example.com
```

Use `ADMIN_DATA_SOURCE=disk` for local JSON files, or `ADMIN_DATA_SOURCE=supabase` after the database has been seeded.

Use `ADMIN_EMAILS` as a comma-separated allow-list for accounts that can open `/admin`. Production denies admin access if this is empty.

Supabase-backed admin data also needs:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

## Project Structure

```text
app/          Routes, metadata, sitemap, robots
components/   Reusable UI and animated sections
content/      Static editable copy and fallback menu content
lib/          Site config, Hotplate adapter, admin data source boundary
types/        Shared TypeScript types
public/       Icons and static assets
archive/      Preserved prototype versions and screenshots
```

## Admin Preview

Open `/admin` locally to edit the catalog, hero, announcement, contact details, and testimonials.

By default, local edits persist to JSON files under `data/`. Set `ADMIN_DATA_SOURCE=supabase` to use the Supabase implementation instead.

## Supabase Setup

Run `supabase/schema.sql` in the Supabase SQL editor, then create a public storage bucket named `site-assets`.

Seed the current local JSON data into Supabase:

```bash
npm run seed:supabase
```

After seeding, change `ADMIN_DATA_SOURCE` to `supabase` locally or in Vercel.

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Deployment

This is Vercel-ready but not deployed yet because the final GitHub/Vercel account is not available.

Future flow:

```bash
git remote add origin <github-repo-url>
git push -u origin main
```

Then import the GitHub repo into the target Vercel account and set:

- `NEXT_PUBLIC_SITE_URL`
- `HOTPLATE_CHEF_ID`
- `ADMIN_DATA_SOURCE`
- `ADMIN_EMAILS`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`

## Prototype Archive

The original static versions and screenshots are preserved under:

```text
archive/prototypes/2026-05-v1-v3/
```
