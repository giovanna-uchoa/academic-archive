-- Add row-level access policies for subjects and posts
-- Run this migration in Supabase SQL editor or your migration workflow.

alter table subjects enable row level security;
alter table posts enable row level security;

create policy "Public read subjects"
on subjects
for select
using (true);

create policy "Public read posts"
on posts
for select
using (true);

create policy "Admin insert subjects"
on subjects
for insert
with check (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admin update subjects"
on subjects
for update
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admin delete subjects"
on subjects
for delete
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admin insert posts"
on posts
for insert
with check (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admin update posts"
on posts
for update
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admin delete posts"
on posts
for delete
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);