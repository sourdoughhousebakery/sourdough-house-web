# Sourdough House Bakery

Production Next.js site for Sourdough House Bakery, rebuilt from the v3 static prototype into a maintainable multi-route app.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4
- Motion
- Hotplate public menu data
- Supabase-ready boundary for future data ownership

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
HOTPLATE_CHEF_ID=sourdoughhouse
```

Supabase variables are intentionally commented out until the account and schema exist.

## Project Structure

```text
app/          Routes, metadata, sitemap, robots
components/   Reusable UI and animated sections
content/      Static editable copy and fallback menu content
lib/          Site config, Hotplate adapter, future Supabase boundary
types/        Shared TypeScript types
public/       Icons and static assets
archive/      Preserved prototype versions and screenshots
```

## Admin Preview

Open `/admin` locally to preview the future catalog editor. It can toggle whether a typical bake is shown, featured, usually available, and whether its price appears.

Current limitation: this saves to browser `localStorage` only. It is a placeholder workflow until Supabase or another CMS is connected.

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

## Prototype Archive

The original static versions and screenshots are preserved under:

```text
archive/prototypes/2026-05-v1-v3/
```
