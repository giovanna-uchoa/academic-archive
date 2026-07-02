import { describe, expect, it } from 'vitest'
import {
  buildArchiveGroups,
  buildCategorySummary,
  normalizePostDate,
  sortPostsByDateDesc,
  toPostStorageDate,
  toTagSlug,
} from './contentTaxonomy'
import type { Post, Subject } from './dataTypes'

function makePost(overrides: Partial<Post>): Post {
  return {
    id: 1,
    title: 'Untitled',
    excerpt: '',
    content: '',
    date: '2026/01/01',
    timeSpent: '1hr',
    subjectId: 'mac0470',
    tags: [],
    ...overrides,
  }
}

describe('date helpers', () => {
  it.each([
    ['2026-02-28', '2026/02/28'],
    ['2026/07/02', '2026/07/02'],
    ['2026-03-31', '2026/03/31'],
  ])('normalizes %s to %s', (input, expected) => {
    expect(normalizePostDate(input)).toBe(expected)
  })

  it('rejects an invalid date', () => {
    expect(normalizePostDate('not-a-date')).toBeNull()
    expect(normalizePostDate('2026/13/40')).toBeNull()
  })

  it('converts to SQL dash form', () => {
    expect(toPostStorageDate('2026/02/28')).toBe('2026-02-28')
  })
})

describe('sortPostsByDateDesc', () => {
  it('orders newest first using the real dump dates', () => {
    const posts = [
      makePost({ id: 2, date: '2026/02/28' }),
      makePost({ id: 15, date: '2026/07/02' }),
      makePost({ id: 11, date: '2026/03/31' }),
    ]

    expect(sortPostsByDateDesc(posts).map((p) => p.id)).toEqual([15, 11, 2])
  })
})

describe('buildArchiveGroups', () => {
  it('groups posts by year/month, newest group first', () => {
    const posts = [
      makePost({ id: 11, date: '2026/03/31' }),
      makePost({ id: 12, date: '2026/04/30' }),
      makePost({ id: 13, date: '2026/05/31' }),
      makePost({ id: 3, date: '2026/03/10' }),
    ]

    const groups = buildArchiveGroups(posts)

    expect(groups.map((g) => `${g.year}-${g.month}`)).toEqual(['2026-4', '2026-3', '2026-2'])
    const march = groups.find((g) => g.month === 2)
    expect(march?.posts.map((p) => p.id).sort((a, b) => a - b)).toEqual([3, 11])
  })
})

describe('buildCategorySummary', () => {
  const subjects: Subject[] = [
    { id: 'mac0470', title: 'Floss', description: '', overview: '', icon: null, blogEnabled: true, blogSectionTitle: 'Articles' },
    { id: 'mac0500', title: 'TCC', description: '', overview: '', icon: null, blogEnabled: false, blogSectionTitle: 'Articles' },
  ]

  it('counts posts per subject and zeroes out subjects with blogEnabled=false', () => {
    const posts = [
      makePost({ id: 2, subjectId: 'mac0470' }),
      makePost({ id: 3, subjectId: 'mac0470' }),
      makePost({ id: 4, subjectId: 'mac0500' }),
    ]

    const summary = buildCategorySummary(subjects, posts)
    const bySubject = new Map(summary.map((s) => [s.id, s.totalPosts]))

    expect(bySubject.get('mac0470')).toBe(2)
    expect(bySubject.get('mac0500')).toBe(0)
  })
})

describe('toTagSlug', () => {
  it('slugifies accented and mixed-case tag names', () => {
    expect(toTagSlug('Linux Kernel')).toBe('linux-kernel')
    expect(toTagSlug('Ciência Aberta')).toBe('ciencia-aberta')
  })
})
