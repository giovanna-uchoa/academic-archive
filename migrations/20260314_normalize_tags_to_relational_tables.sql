-- Normalize post tags into relational tables.
-- Creates tags + post_tags, migrates existing posts.tags values, and drops posts.tags.

create extension if not exists unaccent;

create or replace function public.slugify_tag(value text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(lower(unaccent(coalesce(value, ''))), '[^a-z0-9]+', '-', 'g'))
$$;

create table if not exists public.tags (
  id bigserial primary key,
  name text not null,
  slug text not null unique,
  created_at timestamp default now()
);

create unique index if not exists tags_name_lower_unique
  on public.tags (lower(name));

create table if not exists public.post_tags (
  post_id bigint not null references public.posts(id) on delete cascade,
  tag_id bigint not null references public.tags(id) on delete cascade,
  created_at timestamp default now(),
  primary key (post_id, tag_id)
);

-- Backfill from legacy posts.tags array if it exists.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'posts'
      and column_name = 'tags'
  ) then
    insert into public.tags (name, slug)
    select distinct
      trimmed.tag_name,
      public.slugify_tag(trimmed.tag_name) as slug
    from (
      select trim(tag_item) as tag_name
      from public.posts p,
      unnest(coalesce(p.tags, '{}')) as tag_item
    ) as trimmed
    where trimmed.tag_name <> ''
      and public.slugify_tag(trimmed.tag_name) <> ''
    on conflict (slug) do update
      set name = excluded.name;

    insert into public.post_tags (post_id, tag_id)
    select distinct
      p.id,
      t.id
    from public.posts p,
    unnest(coalesce(p.tags, '{}')) as tag_item
    join public.tags t
      on t.slug = public.slugify_tag(trim(tag_item))
    where trim(tag_item) <> ''
      and public.slugify_tag(trim(tag_item)) <> ''
    on conflict do nothing;

    alter table public.posts drop column tags;
  end if;
end
$$;

alter table public.tags enable row level security;
alter table public.post_tags enable row level security;

create policy "Public read tags"
on public.tags
for select
using (true);

create policy "Public read post_tags"
on public.post_tags
for select
using (true);

create policy "Admin insert tags"
on public.tags
for insert
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admin update tags"
on public.tags
for update
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admin delete tags"
on public.tags
for delete
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admin insert post_tags"
on public.post_tags
for insert
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admin delete post_tags"
on public.post_tags
for delete
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);
