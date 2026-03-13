
# Academic Archive

> [!NOTE] **Disclaimer:** Most of this project was vibecoded and/or bootstrapped from boilerplate. Use it as a starting point, not as a reference for best practices.

A personal academic archive built with React, TypeScript, and Supabase. Lets you organize content into subjects and posts, with a built-in admin panel to manage everything. Original UI design from [Figma – Personal Tech Portfolio Blog (Community)](https://www.figma.com/design/vGsWTFg8pBClvaGv4ZF62Y/Personal-Tech-Portfolio-Blog--Community-).

## Tech stack

- **React 18** + **TypeScript** — frontend
- **Vite** — bundler / dev server
- **Material UI v5** — component library and theming
- **React Router DOM** — client-side routing (hash-based)
- **Supabase** — backend / database
- **marked** + **DOMPurify** — safe Markdown rendering
- **lucide-react** — icons

## Project structure

```
src/
  App.tsx                   # Root component, routes, layout
  main.tsx                  # Entry point
  components/               # Shared UI components
    BlogList.tsx
    BlogPost.tsx
    Footer.tsx
    Header.tsx
    Hero.tsx
    SubjectCard.tsx
    SubjectsOverview.tsx
    admin/                  # Admin-only UI
      AdminHeader.tsx
      LoginDialog.tsx
      PostSection.tsx
      SubjectSection.tsx
  pages/
    HomePage.tsx            # /
    SubjectPage.tsx         # /:subjectId
    admin/
      AdminPage.tsx         # /admin
  theme/
    muiTheme.ts
    ThemeProvider.tsx
  utils/
    cmsApi.ts               # API helpers
    dataTypes.ts            # Shared TypeScript types
    renderContent.ts        # Markdown → sanitized HTML
    supabaseClient.ts       # Supabase client init
    useCmsContent.ts        # Data-fetching hook
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

### 3. Run the dev server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

## Admin panel

Navigate to `/#/admin` to create, edit, and delete subjects and posts.

Authentication is handled via Supabase — make sure your project's auth settings are configured before using the admin panel.
  