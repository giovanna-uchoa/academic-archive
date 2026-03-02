import { useCallback, useEffect, useState } from 'react';
import { cmsApi } from './cmsApi';
import type { Post, Subject } from '../types/content';

export function useCmsContent() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [nextSubjects, nextPosts] = await Promise.all([
        cmsApi.listSubjects(),
        cmsApi.listPosts(),
      ]);

      setSubjects(nextSubjects);
      setPosts(nextPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    subjects,
    posts,
    loading,
    error,
    reload,
  };
}
