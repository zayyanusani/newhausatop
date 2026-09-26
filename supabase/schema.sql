create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'reader' check (role in ('reader','author','editor','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  category text not null,
  content text not null,
  image_url text,
  author_id uuid references public.profiles(id) on delete set null,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_status_published_at_idx on public.articles(status, published_at desc);
create index if not exists articles_category_idx on public.articles(category);

alter table public.profiles enable row level security;
alter table public.articles enable row level security;

create policy "public can read published articles" on public.articles
  for select to anon, authenticated using (status = 'published');

create policy "users can read own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

create policy "authors can create articles" on public.articles
  for insert to authenticated
  with check ((select auth.uid()) = author_id and exists (
    select 1 from public.profiles p where p.id = (select auth.uid()) and p.role in ('author','editor','admin')
  ));

create policy "authors can update own articles" on public.articles
  for update to authenticated
  using (author_id = (select auth.uid()) and exists (
    select 1 from public.profiles p where p.id = (select auth.uid()) and p.role in ('author','editor','admin')
  ))
  with check (author_id = (select auth.uid()));

create policy "editors can update any article" on public.articles
  for update to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role in ('editor','admin')))
  with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role in ('editor','admin')));

create or replace function public.handle_new_user()
returns trigger language plpgsql security invoker set search_path = public
as $$ begin
  insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name','')) on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create policy "authors can read own articles" on public.articles
  for select to authenticated using (author_id = (select auth.uid()));

create policy "editors can read all articles" on public.articles
  for select to authenticated using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role in ('editor','admin')));
