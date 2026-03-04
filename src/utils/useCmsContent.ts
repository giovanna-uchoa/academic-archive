import { useCallback, useEffect, useRef, useState } from 'react'
import { cmsApi } from './cmsApi'
import { supabase } from './supabaseClient'
import type { Post, Subject } from './dataTypes'

export function useCmsContent() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadingRef = useRef(false)

  const reload = useCallback(async () => {
    if (loadingRef.current) return

    loadingRef.current = true
    setLoading(true)
    setError(null)

    try {
      const [nextSubjects, nextPosts] = await Promise.all([
        cmsApi.listSubjects(),
        cmsApi.listPosts(),
      ])

      setSubjects(nextSubjects)
      setPosts(nextPosts)
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
      .channel('posts-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
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
    loading,
    error,
    reload,
  }
}