-- Add per-subject blog visibility and section title controls.
-- Run this migration in Supabase SQL editor or your migration workflow.

alter table public.subjects
  add column if not exists "blogEnabled" boolean;

alter table public.subjects
  add column if not exists "blogSectionTitle" text;

update public.subjects
set "blogEnabled" = true
where "blogEnabled" is null;

update public.subjects
set "blogSectionTitle" = 'Articles & Experiments'
where "blogSectionTitle" is null
   or btrim("blogSectionTitle") = '';

alter table public.subjects
  alter column "blogEnabled" set default true;

alter table public.subjects
  alter column "blogEnabled" set not null;

alter table public.subjects
  alter column "blogSectionTitle" set default 'Articles & Experiments';

alter table public.subjects
  alter column "blogSectionTitle" set not null;
