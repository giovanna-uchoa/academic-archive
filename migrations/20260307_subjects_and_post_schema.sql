-- Add initial subjects and posts Schema
-- Run this migration in Supabase SQL editor or your migration workflow.
create table subjects (
  id text primary key,
  title text not null,
  description text not null,
  overview text,
  icon text,
  created_at timestamp default now()
);

create table posts (
  id bigserial primary key,
  title text not null,
  excerpt text not null,
  content text not null,
  date text not null,
  "timeSpent" text,
  "subjectId" text not null references subjects(id) on delete cascade,
  created_at timestamp default now()
);