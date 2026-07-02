
# Academic Archive

> [!WARNING]
> Most of this project was vibecoded and/or bootstrapped from boilerplate. Use it as a starting point, not as a reference for best practices.

A personal academic archive built with React, TypeScript, and a GitHub-backed CMS. Organize content into subjects and posts, tag entries for cross-cutting discovery, and manage everything through a built-in admin panel.

Original UI inspired by [Figma – Personal Tech Portfolio Blog (Community)](https://www.figma.com/design/vGsWTFg8pBClvaGv4ZF62Y/Personal-Tech-Portfolio-Blog--Community-) and [jekyll-theme-chirpy](https://github.com/cotes2020/jekyll-theme-chirpy).

## Features

- Browse posts grouped by **subject** or explore all entries in the **catalog**
- **Tag system** — tags live as a string array in each post's frontmatter; assign tags to posts and filter at `/tags/:tagSlug`
- **Archives** — posts grouped by year/month
- **Admin panel** at `/#/admin` — create, edit, and delete subjects, posts, and tags (requires a GitHub Personal Access Token)
- Dark / light theme toggle
- Markdown rendering with GFM support (tables, strikethrough, task lists)

## Tech stack

| Layer | Library |
|---|---|
| Frontend | React 18 + TypeScript |
| Bundler | Vite |
| UI | Material UI v5 |
| Routing | React Router DOM (hash-based) |
| Backend / DB | GitHub Contents API (`content/` folder in a GitHub repo) |
| Frontmatter | js-yaml |
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
    admin/
      AdminHeader.tsx
      LoginDialog.tsx
      PostForm.tsx
      SubjectForm.tsx
      TagForm.tsx
    archive/
      ArchiveMonthGroup.tsx
      ArchivePostItem.tsx
      ArchivesHeader.tsx
    blog/
      BlogCard.tsx            # Post preview card
      BlogPost.tsx            # Full post view with hero header
      BlogSection.tsx
    catalog/
      CategoryCard.tsx
      CategoryHeader.tsx
    ui/
      BackButton.tsx
      Logo.tsx
      SocialLinks.tsx
      ThemeToggle.tsx
      layout/
        PageContent.tsx
        PageTopBar.tsx
      state/
        Error.tsx
        Loading.tsx
        NotFound.tsx
  pages/
    HomePage.tsx              # /
    ArchivesPage.tsx          # /archives
    CatalogPage.tsx           # /catalog
    SubjectPage.tsx           # /subjects/:subjectId
    PostPage.tsx              # /subjects/:subjectId/post/:postId, /post/:postId
    TagsPage.tsx               # /tags
    TagPage.tsx                # /tags/:tagSlug
    admin/
      AdminPage.tsx           # /admin
  theme/
    muiTheme.ts
    ThemeProvider.tsx
  utils/
    cmsApi.ts                 # GitHub-backed CRUD + date normalisation
    contentTaxonomy.ts        # Tag/category summary, archive grouping, date parsing
    dataTypes.ts              # Shared TypeScript types
    frontmatter.ts             # YAML frontmatter parse/stringify
    githubAuth.ts               # PAT storage + validation
    githubClient.ts             # GitHub Contents API transport
    useCmsContent.ts             # Data-fetching hook
    usePageTitle.ts
    iconRenderer.tsx
    socials.ts
content/
  manifest.json                # Generated index of subject/post summaries
  subjects/*.md
  posts/*.md
```

## Getting started

### 1. Install dependencies

```bash
npm i
```

### 2. Configure the content repo

Create a `.env` file at the project root (see `.env.sample`):

```env
VITE_APP_NAME=
VITE_APP_TITLE=

VITE_SOCIAL_GITHUB=
VITE_SOCIAL_GITLAB=
VITE_SOCIAL_LINKEDIN=
VITE_SOCIAL_MAIL=

VITE_GITHUB_OWNER=
VITE_GITHUB_REPO=
VITE_GITHUB_BRANCH=main
```

`VITE_GITHUB_OWNER`/`VITE_GITHUB_REPO`/`VITE_GITHUB_BRANCH` point at the GitHub repo holding the `content/` folder. There's no database and no migration step — reads hit `raw.githubusercontent.com` directly, no auth required. Writing (the admin panel) additionally needs a GitHub Personal Access Token with `repo` scope, entered at login — see "Notes" below.

### 3. Run the dev server

```bash
npm run dev
```

### 4. Linting

```bash
npm run lint        # check
npm run lint:fix    # auto-fix
```

### 5. Testing

```bash
npm run test          # run once
npm run test:watch    # watch mode
```

### 6. Build for production

```bash
npm run build
```

## Notes

**Admin panel**: Navigate to `/#/admin` and enter a GitHub Personal Access Token with `repo` scope on the configured repository. The token is kept only in `sessionStorage` (cleared when the tab closes) — it's never written to `.env` or persisted anywhere else.

**Post dates**: Dates are entered, stored in frontmatter, and displayed as `yyyy/mm/dd` — there's no separate database storage format to convert to/from.
