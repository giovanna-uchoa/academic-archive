import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { dump } from 'js-yaml';

const dumpDir = new URL('../db-dump/', import.meta.url);
const contentDir = new URL('../content/', import.meta.url);

function readJson(name) {
  return JSON.parse(readFileSync(new URL(name, dumpDir), 'utf8'));
}

function normalizePostDate(value) {
  const match = value.trim().match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
  if (!match) throw new Error(`Unrecognized date: ${value}`);
  const [, year, month, day] = match;
  return `${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')}`;
}

function toFrontmatterFile(data, content) {
  const frontmatter = dump(data, { lineWidth: -1 }).trimEnd();
  return `---\n${frontmatter}\n---\n\n${content.trim()}\n`;
}

const subjects = readJson('subjects.json');
const posts = readJson('posts.json');

mkdirSync(new URL('subjects/', contentDir), { recursive: true });
mkdirSync(new URL('posts/', contentDir), { recursive: true });

const outputSubjects = subjects.map((subject) => {
  const frontmatter = {
    title: subject.title,
    description: subject.description,
    icon: subject.icon ?? null,
    blogEnabled: subject.blogEnabled ?? true,
    blogSectionTitle: subject.blogSectionTitle?.trim() || 'Articles & Experiments',
  };

  writeFileSync(
    new URL(`subjects/${subject.id}.md`, contentDir),
    toFrontmatterFile(frontmatter, subject.overview ?? '')
  );

  return { id: subject.id, ...frontmatter, overview: subject.overview ?? '' };
});

const outputPosts = posts.map((post) => {
  const tags = (post.post_tags ?? [])
    .map((entry) => entry.tags?.name)
    .filter(Boolean);

  const date = normalizePostDate(post.date);

  const frontmatter = {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    date,
    timeSpent: post.timeSpent,
    subjectId: post.subjectId,
    tags,
  };

  writeFileSync(
    new URL(`posts/${post.id}.md`, contentDir),
    toFrontmatterFile(frontmatter, post.content)
  );

  return frontmatter;
});

const manifest = {
  subjects: outputSubjects,
  posts: outputPosts,
};

writeFileSync(new URL('manifest.json', contentDir), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`Generated ${outputSubjects.length} subject(s), ${outputPosts.length} post(s), and manifest.json`);
