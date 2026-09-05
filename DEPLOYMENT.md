# Deployment Notes

## GitHub

Repository: https://github.com/sourdoughhousebakery/sourdough-house-web

Push approved, verified changes to the production branch:

```bash
git push -u origin main
```

Use `main` as the production branch.

## Vercel

Production: https://sourdough-house-web.vercel.app

Vercel is connected to the GitHub repository and deploys pushes to `main`. Check the commit's deployment status, then verify the production `/menu` page in a browser.

Required environment variables for the Supabase-backed website:
- `NEXT_PUBLIC_SITE_URL=https://sourdough-house-web.vercel.app`
- `HOTPLATE_CHEF_ID=sourdoughhouse43`
- `ADMIN_DATA_SOURCE=supabase`
- `ADMIN_EMAILS`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` (server-side only)

## Domain

After a custom domain is selected, add it in Vercel project settings and follow the DNS records Vercel provides.

## Catalog content

Supabase stores the editable website catalog and site content. Catalog database changes are separate from code deployment. Hotplate remains the source for current sale data and checkout. See `docs/hotplate-catalog-import.md` for the reviewed non-live catalog import; the dated one-time script must not be rerun blindly for future refreshes.
