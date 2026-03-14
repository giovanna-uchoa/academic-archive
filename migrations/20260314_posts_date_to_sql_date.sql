-- Ensure posts.date is a SQL DATE type.
-- Supports values previously stored as YYYY/MM/DD or YYYY-MM-DD strings.

alter table public.posts
  alter column date type date
  using (
    case
      when date::text ~ '^\d{4}/\d{2}/\d{2}$' then to_date(date::text, 'YYYY/MM/DD')
      when date::text ~ '^\d{4}-\d{2}-\d{2}$' then to_date(date::text, 'YYYY-MM-DD')
      else date::date
    end
  );
