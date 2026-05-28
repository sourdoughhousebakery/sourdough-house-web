# Supabase Boundary

Supabase is intentionally not wired yet. When the project has a Supabase account and schema:

1. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Generate database types into `types/database.ts`.
3. Add server/client helpers here using `@supabase/ssr`.
4. Keep Hotplate as the order source unless the business decides to own ordering data.

