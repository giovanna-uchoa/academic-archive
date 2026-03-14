-- Add explicit post tags and make subject icon optional.
-- Run this migration in Supabase SQL editor or your migration workflow.

alter table public.posts
  add column if not exists tags text[];

alter table public.subjects
  alter column icon drop not null;

-- Normalize empty icon strings to NULL for cleaner data.
update public.subjects
set icon = null
where icon = '';
