import type { Post, Subject } from './dataTypes'
import { supabase } from './supabaseClient'

async function ensureAuthenticated() {
  const { data } = await supabase.auth.getUser()
  if (!data.user) {
    throw new Error('Not authenticated')
  }
  return data.user
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
    return data ?? []
  },

  async getSubject(subjectId: string): Promise<Subject | null> {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('id', subjectId)
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async listPosts(): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('id', { ascending: true })

    if (error) throw new Error(error.message)
    return (data ?? [])
  },

  async listPostsBySubjectId(subjectId: string): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('subjectId', subjectId)
      .order('id', { ascending: true })

    if (error) throw new Error(error.message)
    return (data ?? [])
  },

  async getPost(postId: string): Promise<Post | null> {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  // =========================
  // SUBJECTS (admin only)
  // =========================

  async createSubject(subject: Subject): Promise<Subject> {
    await ensureAuthenticated()

    const { data, error } = await supabase
      .from('subjects')
      .insert(subject)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async updateSubject(
    subjectId: string,
    subject: Omit<Subject, 'id'>
  ): Promise<Subject> {
    await ensureAuthenticated()

    const { data, error } = await supabase
      .from('subjects')
      .update(subject)
      .eq('id', subjectId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
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

    const { data, error } = await supabase
      .from('posts')
      .insert(post)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  },

  async updatePost(
    postId: number,
    post: Omit<Post, 'id'>
  ): Promise<Post> {
    await ensureAuthenticated()

    const { data, error } = await supabase
      .from('posts')
      .update(post)
      .eq('id', postId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
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
  }
}