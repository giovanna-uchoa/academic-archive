import type { ArchiveGroup, CategorySummary, Post, Subject } from './dataTypes';

export function getPostPath(post: Pick<Post, 'id' | 'subjectId'>): string {
  return `/subjects/${post.subjectId}/post/${post.id}`;
}

interface PostDateParts {
  year: number;
  month: number;
  day: number;
}

function parsePostDateParts(value: string): PostDateParts | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const ymd = trimmed.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
  if (!ymd) return null;

  const year = Number(ymd[1]);
  const month = Number(ymd[2]);
  const day = Number(ymd[3]);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }

  const parsed = new Date(year, month - 1, day);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

function toYmdString(parts: PostDateParts, separator: '/' | '-'): string {
  return [
    String(parts.year).padStart(4, '0'),
    String(parts.month).padStart(2, '0'),
    String(parts.day).padStart(2, '0'),
  ].join(separator);
}

export function normalizePostDate(value: string): string | null {
  const parts = parsePostDateParts(value);
  if (!parts) return null;
  return toYmdString(parts, '/');
}

export function toPostStorageDate(value: string): string | null {
  const parts = parsePostDateParts(value);
  if (!parts) return null;
  return toYmdString(parts, '-');
}

function parseDateToken(value: string): Date | null {
  const parts = parsePostDateParts(value);
  if (!parts) return null;
  return new Date(parts.year, parts.month - 1, parts.day);
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

export function getPostTags(post: Post): string[] {
  const tags = new Set<string>();

  for (const explicitTag of post.tags ?? []) {
    const cleaned = explicitTag.trim();
    if (cleaned) {
      tags.add(cleaned);
    }
  }

  return [...tags];
}

export function buildPostTags(posts: Post[]): Record<number, string[]> {
  const index: Record<number, string[]> = {};

  for (const post of posts) {
    index[post.id] = getPostTags(post);
  }

  return index;
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
        label: date.toLocaleString(undefined, {
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
  if (!parsed) return normalizePostDate(value) ?? value;

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(parsed);
}

export function toTagSlug(value: string): string {
  return normalizeTag(value);
}
