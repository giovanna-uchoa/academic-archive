import { useCallback, useEffect, useRef, useState } from 'react'
import { cmsApi } from './cmsApi'
import { supabase } from './supabaseClient'
import type { Post, Subject, Tag, TagSummary } from './dataTypes'

export function useCmsContent() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [tagSummary, setTagSummary] = useState<TagSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadingRef = useRef(false)

  const reload = useCallback(async () => {
    if (loadingRef.current) return

    loadingRef.current = true
    setLoading(true)
    setError(null)

    try {
      const [nextSubjects, nextPosts, nextTags, nextTagSummary] = await Promise.all([
        cmsApi.listSubjects(),
        cmsApi.listPosts(),
        cmsApi.listTags(),
        cmsApi.listTagSummary(),
      ])

      setSubjects(nextSubjects)
      setPosts(nextPosts)
      setTags(nextTags)
      setTagSummary(nextTagSummary)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load content'
      )
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('content-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        () => {
          setTimeout(() => {
            void reload()
          }, 100)
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tags' },
        () => {
          setTimeout(() => {
            void reload()
          }, 100)
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'post_tags' },
        () => {
          setTimeout(() => {
            void reload()
          }, 100)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return {
    subjects,
    posts,
    tags,
    tagSummary,
    loading,
    error,
    reload,
  }
}