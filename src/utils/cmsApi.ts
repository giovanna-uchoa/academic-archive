import type { Post, Subject, Tag, TagSummary } from './dataTypes'
import { supabase } from './supabaseClient'
import { normalizePostDate, toPostStorageDate } from './contentTaxonomy'

interface DbTag {
  id: number
  name: string
  slug: string
}

interface DbPostRow {
  id: number
  title: string
  excerpt: string
  content: string
  date: string
  timeSpent: string
  subjectId: string
  post_tags?: Array<{
    tags: DbTag | null
  }> | null
}

interface DbTagSummaryRow {
  name: string
  slug: string
  post_tags?: Array<{ tag_id: number }> | null
}

interface DbSubjectRow {
  id: string
  title: string
  description: string
  overview: string
  icon?: string | null
  blogEnabled?: boolean | null
  blogSectionTitle?: string | null
}

const DEFAULT_BLOG_SECTION_TITLE = 'Articles & Experiments'

async function ensureAuthenticated() {
  const { data } = await supabase.auth.getUser()
  if (!data.user) {
    throw new Error('Not authenticated')
  }
  return data.user
}

function mapPostFromDb(post: DbPostRow): Post {
  const relationalTags =
    post.post_tags
      ?.map((entry) => entry.tags?.name?.trim() ?? '')
      .filter(Boolean) ?? []

  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    date: normalizePostDate(post.date) ?? post.date,
    timeSpent: post.timeSpent,
    subjectId: post.subjectId,
    tags: [...new Set(relationalTags)],
  }
}

function mapPostForDb(post: Omit<Post, 'id'>): Omit<Post, 'id' | 'tags'> {
  const storageDate = toPostStorageDate(post.date)
  if (!storageDate) {
    throw new Error('Invalid post date. Use yyyy/mm/dd.')
  }

  return {
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    date: storageDate,
    timeSpent: post.timeSpent,
    subjectId: post.subjectId,
  }
}

function normalizeTagName(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

function normalizeBlogSectionTitle(value: string | null | undefined): string {
  const cleaned = value?.trim() ?? ''
  return cleaned || DEFAULT_BLOG_SECTION_TITLE
}

function mapSubjectFromDb(subject: DbSubjectRow): Subject {
  return {
    id: subject.id,
    title: subject.title,
    description: subject.description,
    overview: subject.overview,
    icon: subject.icon ?? null,
    blogEnabled: subject.blogEnabled ?? true,
    blogSectionTitle: normalizeBlogSectionTitle(subject.blogSectionTitle),
  }
}

function mapSubjectForDb(subject: Subject | Omit<Subject, 'id'>) {
  return {
    ...subject,
    blogEnabled: subject.blogEnabled ?? true,
    blogSectionTitle: normalizeBlogSectionTitle(subject.blogSectionTitle),
  }
}

function toTagSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function resolveTagIds(tagNames: string[]): Promise<number[]> {
  const normalizedNames = [...new Set(tagNames.map(normalizeTagName).filter(Boolean))]
  if (normalizedNames.length === 0) return []

  const tagsToResolve = normalizedNames
    .map((name) => ({ name, slug: toTagSlug(name) }))
    .filter((tag) => Boolean(tag.slug))

  if (tagsToResolve.length === 0) return []

  const slugs = tagsToResolve.map((tag) => tag.slug)
  const { data: existingTags, error: existingError } = await supabase
    .from('tags')
    .select('id, name, slug')
    .in('slug', slugs)

  if (existingError) throw new Error(existingError.message)

  const existingBySlug = new Map((existingTags ?? []).map((tag) => [tag.slug, tag]))
  const missing = tagsToResolve.filter((tag) => !existingBySlug.has(tag.slug))

  if (missing.length > 0) {
    const { data: createdTags, error: createError } = await supabase
      .from('tags')
      .insert(missing)
      .select('id, name, slug')

    if (createError) throw new Error(createError.message)

    for (const tag of createdTags ?? []) {
      existingBySlug.set(tag.slug, tag)
    }
  }

  return tagsToResolve
    .map((tag) => existingBySlug.get(tag.slug)?.id)
    .filter((id): id is number => typeof id === 'number')
}

async function syncPostTags(postId: number, tagNames: string[]) {
  const tagIds = await resolveTagIds(tagNames)

  const { error: deleteError } = await supabase
    .from('post_tags')
    .delete()
    .eq('post_id', postId)

  if (deleteError) throw new Error(deleteError.message)

  if (tagIds.length === 0) return

  const payload = tagIds.map((tagId) => ({
    post_id: postId,
    tag_id: tagId,
  }))

  const { error: insertError } = await supabase
    .from('post_tags')
    .insert(payload)

  if (insertError) throw new Error(insertError.message)
}

export const cmsApi = {
  // =========================
  // READ (public)
  // =========================

  async listSubjects(): Promise<Subject[]> {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw new Error(error.message)
    return (data ?? []).map((subject) => mapSubjectFromDb(subject as DbSubjectRow))
  },

  async getSubject(subjectId: string): Promise<Subject | null> {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('id', subjectId)
      .single()

    if (error) throw new Error(error.message)
    return data ? mapSubjectFromDb(data as DbSubjectRow) : null
  },

  async listPosts(): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, excerpt, content, date, timeSpent, subjectId, post_tags(tags(id, name, slug))')
      .order('date', { ascending: true })

    if (error) throw new Error(error.message)
    return (data ?? []).map((post) => mapPostFromDb(post as unknown as DbPostRow))
  },

  async listPostsBySubjectId(subjectId: string): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, excerpt, content, date, timeSpent, subjectId, post_tags(tags(id, name, slug))')
      .eq('subjectId', subjectId)
      .order('id', { ascending: true })

    if (error) throw new Error(error.message)
    return (data ?? []).map((post) => mapPostFromDb(post as unknown as DbPostRow))
  },

  async getPost(postId: string): Promise<Post | null> {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, excerpt, content, date, timeSpent, subjectId, post_tags(tags(id, name, slug))')
      .eq('id', postId)
      .single()

    if (error) throw new Error(error.message)
    return data ? mapPostFromDb(data as unknown as DbPostRow) : null
  },

  async listTags(): Promise<Tag[]> {
    const { data, error } = await supabase
      .from('tags')
      .select('id, name, slug')
      .order('name', { ascending: true })

    if (error) throw new Error(error.message)
    return data ?? []
  },

  async listTagSummary(): Promise<TagSummary[]> {
    const { data, error } = await supabase
      .from('tags')
      .select('name, slug, post_tags(tag_id)')
      .order('name', { ascending: true })

    if (error) throw new Error(error.message)

    return (data ?? [])
      .map((tag) => {
        const row = tag as unknown as DbTagSummaryRow
        return {
          slug: row.slug,
          label: row.name,
          totalPosts: row.post_tags?.length ?? 0,
        }
      })
      .sort((a, b) => b.totalPosts - a.totalPosts || a.label.localeCompare(b.label))
  },

  // =========================
  // SUBJECTS (admin only)
  // =========================

  async createSubject(subject: Subject): Promise<Subject> {
    await ensureAuthenticated()

    const payload = mapSubjectForDb(subject)

    const { data, error } = await supabase
      .from('subjects')
      .insert(payload)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return mapSubjectFromDb(data as DbSubjectRow)
  },

  async updateSubject(
    subjectId: string,
    subject: Omit<Subject, 'id'>
  ): Promise<Subject> {
    await ensureAuthenticated()

    const payload = mapSubjectForDb(subject)

    const { data, error } = await supabase
      .from('subjects')
      .update(payload)
      .eq('id', subjectId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return mapSubjectFromDb(data as DbSubjectRow)
  },

  async deleteSubject(
    subjectId: string
  ): Promise<{ ok: boolean }> {
    await ensureAuthenticated()

    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', subjectId)

    if (error) throw new Error(error.message)

    return { ok: true }
  },

  // =========================
  // POSTS (admin only)
  // =========================

  async createPost(
    post: Omit<Post, 'id'>
  ): Promise<Post> {
    await ensureAuthenticated()

    const payload = mapPostForDb(post)

    const { data, error } = await supabase
      .from('posts')
      .insert(payload)
      .select('id, title, excerpt, content, date, timeSpent, subjectId')
      .single()

    if (error) throw new Error(error.message)

    await syncPostTags(data.id, post.tags ?? [])

    const updatedPost = await this.getPost(String(data.id))
    if (!updatedPost) {
      throw new Error('Failed to load post after creation.')
    }

    return updatedPost
  },

  async updatePost(
    postId: number,
    post: Omit<Post, 'id'>
  ): Promise<Post> {
    await ensureAuthenticated()

    const payload = mapPostForDb(post)

    const { data, error } = await supabase
      .from('posts')
      .update(payload)
      .eq('id', postId)
      .select('id, title, excerpt, content, date, timeSpent, subjectId')
      .single()

    if (error) throw new Error(error.message)

    await syncPostTags(postId, post.tags ?? [])

    const updatedPost = await this.getPost(String(data.id))
    if (!updatedPost) {
      throw new Error('Failed to load post after update.')
    }

    return updatedPost
  },

  async deletePost(
    postId: number
  ): Promise<{ ok: boolean }> {
    await ensureAuthenticated()

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)

    if (error) throw new Error(error.message)

    return { ok: true }
  },

  async createTag(name: string): Promise<Tag> {
    await ensureAuthenticated()

    const cleanedName = normalizeTagName(name)
    const slug = toTagSlug(cleanedName)

    if (!cleanedName || !slug) {
      throw new Error('Invalid tag name.')
    }

    const { data, error } = await supabase
      .from('tags')
      .insert({ name: cleanedName, slug })
      .select('id, name, slug')
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async updateTag(tagId: number, name: string): Promise<Tag> {
    await ensureAuthenticated()

    const cleanedName = normalizeTagName(name)
    const slug = toTagSlug(cleanedName)

    if (!cleanedName || !slug) {
      throw new Error('Invalid tag name.')
    }

    const { data, error } = await supabase
      .from('tags')
      .update({ name: cleanedName, slug })
      .eq('id', tagId)
      .select('id, name, slug')
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async deleteTag(tagId: number): Promise<{ ok: boolean }> {
    await ensureAuthenticated()

    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', tagId)

    if (error) throw new Error(error.message)

    return { ok: true }
  }
}