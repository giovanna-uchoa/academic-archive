# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> [!WARNING]
> Much of this project was vibecoded / bootstrapped from boilerplate. Treat existing patterns as a starting point, not a best-practices reference.

## Commands

```bash
npm run dev         # start Vite dev server
npm run build        # production build -> build/
npm run lint          # eslint on src/**/*.{ts,tsx}
npm run lint:fix      # eslint --fix
```

There is no test suite configured. Type-checking runs implicitly through the Vite/SWC build (no standalone `tsc --noEmit` script exists — run `npx tsc --noEmit` directly if type verification is needed without a full build).

To run the app against a real backend, create `.env` at the project root (see `.env.sample`) with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, and apply the SQL files in `migrations/` **in filename order** to that Supabase project.

## Architecture

**Stack**: React 18 + TypeScript, Vite (SWC), Material UI v5, React Router (`HashRouter`, so routes are `/#/...`), Supabase (Postgres + Auth), `react-markdown` + `remark-gfm`.

### Data flow

Supabase is the only backend. There is no server layer — components talk to Supabase directly through two files:

- `src/utils/supabaseClient.ts` — creates the Supabase client from env vars.
- `src/utils/cmsApi.ts` — the sole data-access layer (`cmsApi` object). All reads/writes to `subjects`, `posts`, `tags`, `post_tags` go through here. Read methods are public; every mutation method starts with `await ensureAuthenticated()` and throws if there's no active Supabase session. **New Supabase queries should be added to this file, not scattered across components.**
- `src/utils/useCmsContent.ts` — the app-wide data hook. Loads subjects/posts/tags/tag-summary in parallel on mount and re-subscribes to a Supabase Realtime channel (`content-changes`) on `posts`, `tags`, and `post_tags` tables, debounced 100ms, to auto-refresh on any change (including from another browser tab/the admin panel).
- `src/utils/dataTypes.ts` — shared domain types (`Subject`, `Post`, `Tag`, `CategorySummary`, `TagSummary`, `ArchiveGroup`). `cmsApi.ts` maps DB rows (which carry a nested `post_tags(tags(...))` join shape) to these flat app-facing types via `mapPostFromDb`/`mapSubjectFromDb`.
- `src/utils/contentTaxonomy.ts` — pure derivation/formatting functions over already-loaded data: date parsing/formatting, `buildCategorySummary`, `buildArchiveGroups`, tag slugging. No Supabase calls here — this is the place for new client-side aggregation logic.

### Dates

Posts store dates as SQL `DATE` (`yyyy-mm-dd`) in Supabase but the UI works in `yyyy/mm/dd`. Conversion happens only in `cmsApi.ts`/`contentTaxonomy.ts` (`normalizePostDate` reading DB→UI, `toPostStorageDate` writing UI→DB). Don't format/parse dates ad hoc elsewhere — route through these helpers.

### Tags

Tags are relational (`tags` + `post_tags` join table), not a text array. `cmsApi.resolveTagIds`/`syncPostTags` handle create-if-missing-by-slug and full delete+reinsert of a post's tag associations on every save — there's no diffing. Tag slugs are generated client-side (`toTagSlug`, also duplicated in `contentTaxonomy.ts`'s `toTagSlug`/`normalizeTag`) via NFD normalization + lowercasing, not server-generated.

### Auth

Admin panel (`/#/admin`) uses Supabase email/password auth (`LoginDialog.tsx` → `supabase.auth.signInWithPassword`). There's no app-level role system — being an authenticated Supabase user is sufficient for all admin mutations; access control is enforced by Supabase RLS policies (see `migrations/20260308_access_policies.sql`), not in the frontend.

### Routing & pages

Routes are declared in `src/App.tsx` using `HashRouter`, with every page lazy-loaded via `React.lazy`. Route params map to `subjectId`/`postId`/`tagSlug` used directly as Supabase lookup keys (see `pages/`). Post URLs exist in two forms — `/subjects/:subjectId/post/:postId` and `/post/:postId` — both resolved by the same `PostPage`.

### Theming

`src/theme/muiTheme.ts` defines the MUI theme plus a separate `getContentPalette(mode)` helper for markdown/content-specific colors (code blocks, blockquotes) that aren't part of the standard MUI palette — `MarkdownContent.tsx` and admin form previews pull from this rather than hardcoding colors, so new markdown-adjacent UI should do the same for light/dark parity.

### Markdown rendering

`MarkdownContent.tsx` is the only markdown renderer, used for both post content and (in `CategoryHeader.tsx`) subject descriptions. It renders through `react-markdown` (raw HTML is not enabled), with custom MUI-styled components per markdown element (headings, paragraphs, code, links, lists) — extend this component's `components` map rather than introducing a second renderer.

### Migrations

SQL files in `migrations/` are plain files, not run by any tooling in this repo — they must be applied manually (Supabase SQL editor or CLI) in filename/date order. Filenames encode intent (e.g. `_normalize_tags_to_relational_tables`, `_subject_blog_controls`) — when a schema change is needed, add a new dated file rather than editing an existing one, since existing ones have presumably already been applied to the live project.

### Path alias

`@/` resolves to `src/` (configured in `vite.config.ts`), available for use in new code alongside relative imports.
