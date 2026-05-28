# Deployment Notes

## GitHub

When the GitHub account/repository exists:

```bash
git remote add origin <github-repo-url>
git push -u origin main
```

Use `main` as the production branch.

## Vercel

1. Sign in to the correct Vercel account.
2. Import the GitHub repository.
3. Framework preset should detect Next.js.
4. Add environment variables:
   - `NEXT_PUBLIC_SITE_URL`
   - `HOTPLATE_CHEF_ID`
5. Deploy.

## Domain

After a custom domain is selected, add it in Vercel project settings and follow the DNS records Vercel provides.

## Supabase Later

Do not add Supabase credentials until the project has:

- A Supabase account.
- A database schema.
- A decision about which data moves from Hotplate/static content into Supabase.

