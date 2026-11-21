-- NEW STANDALONE MYJOYPH WEBSITE DATABASE
-- Run in Supabase Dashboard > SQL Editor for the project you supplied.
-- This creates separate table and bucket names; it does not depend on any old website.

create extension if not exists pgcrypto;

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price numeric(10,2) not null check (price >= 0),
  category text not null,
  image_url text,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.menu_items enable row level security;
alter table public.site_admins enable row level security;

create or replace function public.myjoyph_is_site_admin()
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.site_admins where user_id=auth.uid()); $$;
revoke all on function public.myjoyph_is_site_admin() from public;
grant execute on function public.myjoyph_is_site_admin() to authenticated;

drop policy if exists "Public reads available menu items" on public.menu_items;
create policy "Public reads available menu items" on public.menu_items
for select to anon, authenticated using (is_available=true or public.myjoyph_is_site_admin());

drop policy if exists "Site admins insert menu items" on public.menu_items;
create policy "Site admins insert menu items" on public.menu_items
for insert to authenticated with check (public.myjoyph_is_site_admin());

drop policy if exists "Site admins update menu items" on public.menu_items;
create policy "Site admins update menu items" on public.menu_items
for update to authenticated using (public.myjoyph_is_site_admin()) with check (public.myjoyph_is_site_admin());

drop policy if exists "Site admins delete menu items" on public.menu_items;
create policy "Site admins delete menu items" on public.menu_items
for delete to authenticated using (public.myjoyph_is_site_admin());

drop policy if exists "Admins read own site admin row" on public.site_admins;
create policy "Admins read own site admin row" on public.site_admins
for select to authenticated using (user_id=auth.uid());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('myjoyph-menu-photos','myjoyph-menu-photos',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=true,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'];

drop policy if exists "Public can view standalone MyJoyPH photos" on storage.objects;
create policy "Public can view standalone MyJoyPH photos" on storage.objects
for select to anon,authenticated using(bucket_id='myjoyph-menu-photos');

drop policy if exists "Site admins upload standalone MyJoyPH photos" on storage.objects;
create policy "Site admins upload standalone MyJoyPH photos" on storage.objects
for insert to authenticated with check(bucket_id='myjoyph-menu-photos' and public.myjoyph_is_site_admin());

drop policy if exists "Site admins update standalone MyJoyPH photos" on storage.objects;
create policy "Site admins update standalone MyJoyPH photos" on storage.objects
for update to authenticated using(bucket_id='myjoyph-menu-photos' and public.myjoyph_is_site_admin())
with check(bucket_id='myjoyph-menu-photos' and public.myjoyph_is_site_admin());

drop policy if exists "Site admins delete standalone MyJoyPH photos" on storage.objects;
create policy "Site admins delete standalone MyJoyPH photos" on storage.objects
for delete to authenticated using(bucket_id='myjoyph-menu-photos' and public.myjoyph_is_site_admin());

-- After creating the owner account in Authentication > Users, copy its UUID and run:
-- insert into public.site_admins(user_id) values ('OWNER-AUTH-USER-UUID');
