# Supabase Admin Data Source

The app has a protocol-style admin data boundary in `lib/admin-data/types.ts`.

Implementations:

- `lib/admin-data/disk.ts` reads and writes local JSON files in `data/`.
- `lib/admin-data/supabase.ts` reads and writes Supabase tables and the `site-assets` storage bucket.
- `lib/admin-data/source.ts` chooses the implementation from `ADMIN_DATA_SOURCE`.

Setup:

1. Run `supabase/schema.sql` in the Supabase SQL editor.
2. Create a public storage bucket named `site-assets`.
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SECRET_KEY`.
4. Run `npm run seed:supabase` to copy the current JSON data into Supabase.
5. Create an admin user in Supabase Auth.
6. Set `ADMIN_EMAILS` to the allowed admin email address, or a comma-separated list.
7. Set `ADMIN_DATA_SOURCE=supabase`.

`SUPABASE_SECRET_KEY` must stay server-only. Do not expose it with a `NEXT_PUBLIC_` prefix.
