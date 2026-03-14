import type { ArchiveGroup, CategorySummary, Post, Subject, TagSummary} from './dataTypes';

export function getPostPath(post: Pick<Post, 'id' | 'subjectId'>): string {
  return `/subjects/${post.subjectId}/post/${post.id}`;
}

function parseDateToken(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const isoLike = new Date(trimmed);
  if (!Number.isNaN(isoLike.getTime())) return isoLike;

  const brFormat = trimmed.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (brFormat) {
    const [, day, month, year] = brFormat;
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  return null;
}

export function getPostDate(post: Post): Date {
  return parseDateToken(post.date) ?? new Date(0);
}

export function sortPostsByDateDesc(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => getPostDate(b).getTime() - getPostDate(a).getTime());
}

export function buildCategorySummary(subjects: Subject[], posts: Post[]): CategorySummary[] {
  return subjects
    .map((subject) => ({
      id: subject.id,
      title: subject.title,
      description: subject.description,
      icon: subject.icon,
      totalPosts: posts.filter((post) => post.subjectId === subject.id).length,
    }))
    .sort((a, b) => b.totalPosts - a.totalPosts || a.title.localeCompare(b.title));
}

function normalizeTag(rawTag: string): string {
  return rawTag
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function titleCase(tag: string): string {
  return tag
    .split('-')
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ');
}

function extractHashtags(post: Post): string[] {
  const source = [post.title, post.excerpt, post.content].join(' ');
  const matches = source.match(/(^|\s)#([a-zA-Z0-9_-]+)/g) ?? [];

  return matches
    .map((match) => match.replace(/^\s*#/, '').trim())
    .filter(Boolean);
}

export function getPostTags(post: Post): string[] {
  const tags = new Set<string>();

  for (const explicitTag of post.tags ?? []) {
    const cleaned = explicitTag.trim();
    if (cleaned) {
      tags.add(cleaned);
    }
  }

  for (const hashtag of extractHashtags(post)) {
    tags.add(hashtag);
  }

  return [...tags];
}

export function buildPostTags(posts: Post[], _subjects: Subject[]): Record<number, string[]> {
  const index: Record<number, string[]> = {};

  for (const post of posts) {
    index[post.id] = getPostTags(post);
  }

  return index;
}

export function buildTagSummary(posts: Post[], subjects: Subject[]): TagSummary[] {
  const postTags = buildPostTags(posts, subjects);
  const usage = new Map<string, { label: string; count: number }>();

  for (const post of posts) {
    const tags = postTags[post.id] ?? [];

    for (const rawTag of tags) {
      const slug = normalizeTag(rawTag);
      if (!slug) continue;

      const existing = usage.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        usage.set(slug, {
          label: titleCase(slug),
          count: 1,
        });
      }
    }
  }

  return [...usage.entries()]
    .map(([slug, value]) => ({
      slug,
      label: value.label,
      totalPosts: value.count,
    }))
    .sort((a, b) => b.totalPosts - a.totalPosts || a.label.localeCompare(b.label));
}

export function buildArchiveGroups(posts: Post[]): ArchiveGroup[] {
  const groups = new Map<string, ArchiveGroup>();

  for (const post of sortPostsByDateDesc(posts)) {
    const date = getPostDate(post);
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${month}`;

    if (!groups.has(key)) {
      groups.set(key, {
        year,
        month,
        label: date.toLocaleString('en-US', {
          month: 'long',
          year: 'numeric',
        }),
        posts: [],
      });
    }

    groups.get(key)?.posts.push(post);
  }

  return [...groups.values()].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
}

export function formatPostDate(value: string): string {
  const parsed = parseDateToken(value);
  if (!parsed) return value;

  return parsed.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function toTagSlug(value: string): string {
  return normalizeTag(value);
}
