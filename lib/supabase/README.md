# Supabase Boundary

Supabase is intentionally not wired yet. When the project has a Supabase account and schema:

1. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
2. Set `SUPABASE_SECRET_KEY` for server-only admin CRUD in API routes.
3. Generate database types into `types/database.ts`.
4. Add server/client helpers here using `@supabase/ssr`.
5. Keep Hotplate as the order source unless the business decides to own ordering data.
