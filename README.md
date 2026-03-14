
# Academic Archive

> [!WARNING]
> Most of this project was vibecoded and/or bootstrapped from boilerplate. Use it as a starting point, not as a reference for best practices.

A personal academic archive built with React, TypeScript, and Supabase. Organize content into subjects and posts, tag entries for cross-cutting discovery, and manage everything through a built-in admin panel.

Original UI inspired by [Figma – Personal Tech Portfolio Blog (Community)](https://www.figma.com/design/vGsWTFg8pBClvaGv4ZF62Y/Personal-Tech-Portfolio-Blog--Community-) and [jekyll-theme-chirpy](https://github.com/cotes2020/jekyll-theme-chirpy).

## Features

- Browse posts grouped by **subject** or explore all entries in the **catalog**
- **Tag system** — tag posts inline (via `#hashtag` in content) or explicitly; filter by tag at `/tags/:tagSlug`
- **Archives** — posts grouped by year/month
- **Admin panel** at `/#/admin` — create, edit, and delete subjects and posts (requires Supabase auth)
- Dark / light theme toggle
- Markdown rendering with GFM support (tables, strikethrough, task lists)

## Tech stack

| Layer | Library |
|---|---|
| Frontend | React 18 + TypeScript |
| Bundler | Vite |
| UI | Material UI v5 |
| Routing | React Router DOM (hash-based) |
| Backend / DB | Supabase |
| Markdown | react-markdown + remark-gfm |
| Icons | lucide-react |

## Project structure

```
src/
  App.tsx                     # Root component, routes, layout
  main.tsx                    # Entry point
  components/
    Header.tsx                # Top nav with active-route pills
    Footer.tsx
    Hero.tsx
    MarkdownContent.tsx       # GFM renderer (raw HTML is escaped)
    blog/
      BlogCard.tsx            # Post preview card
      BlogPost.tsx            # Full post view with hero header
      BlogSection.tsx
    subject/
      SubjectCard.tsx
      SubjectsOverview.tsx
    admin/
      AdminHeader.tsx
      LoginDialog.tsx
      PostForm.tsx
      SubjectForm.tsx
  pages/
    HomePage.tsx              # /
    ArchivesPage.tsx          # /archives
    CatalogPage.tsx           # /catalog, /catalog/:categoryId
    SubjectPage.tsx           # /subjects/:subjectId
    PostPage.tsx              # /subjects/:subjectId/post/:postId, /post/:postId
    TagsPage.tsx              # /tags
    TagPage.tsx               # /tags/:tagSlug
    admin/
      AdminPage.tsx           # /admin
  theme/
    muiTheme.ts
    ThemeProvider.tsx
  utils/
    cmsApi.ts                 # Supabase CRUD + date normalisation
    contentTaxonomy.ts        # Tag extraction, archive grouping, date parsing
    dataTypes.ts              # Shared TypeScript types
    supabaseClient.ts         # Supabase client init
    useCmsContent.ts          # Data-fetching hook
    iconRenderer.tsx
migrations/
  20260307_subjects_and_post_schema.sql
  20260308_access_policies.sql
  20260313_tags_and_optional_subject_icon.sql
  20260314_posts_date_to_sql_date.sql
```

## Getting started

### 1. Install dependencies

```bash
npm i
```

### 2. Configure Supabase

Create a `.env` file at the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run DB migrations

Apply the SQL files in `migrations/` to your Supabase project in order, using the Supabase SQL editor or CLI.

### 4. Run the dev server

```bash
npm run dev
```

### 5. Linting

```bash
npm run lint        # check
npm run lint:fix    # auto-fix
```

### 6. Build for production

```bash
npm run build
```

## Notes

**Admin panel**: Navigate to `/#/admin`. Authentication is handled via Supabase — configure your project's auth settings before first use.

**Post dates**: Dates are entered and displayed as `yyyy/mm/dd`. The API layer automatically converts to/from the SQL `DATE` format (`yyyy-mm-dd`) when reading from and writing to Supabase.