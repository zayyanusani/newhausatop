# NewHausaTop Production V3

## V3 architecture
- Next.js App Router
- Supabase Auth + Postgres CMS
- Protected `/admin` dashboard
- Hausa login/signup UI
- Draft article creation
- Published/draft/archived article model
- Row Level Security (RLS)
- Environment-based site URL
- Production sitemap/robots fixes

## Supabase setup
1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Copy the project URL and publishable key into Vercel environment variables: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
4. Create an account at `/signup`.
5. In Supabase SQL Editor, promote that account to an author/editor/admin by updating `public.profiles.role`.
6. Sign in at `/login` and open `/admin`.

## Important security rules
Never put a Supabase service-role/secret key in `NEXT_PUBLIC_*` variables or browser code. Keep authorization in database RLS policies.

## Next V3 step
Connect the public home, category, article, search and sitemap routes to `public.articles`, then add image uploads, publishing controls, author profiles, analytics and ad management.