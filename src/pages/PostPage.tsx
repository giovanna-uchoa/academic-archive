import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { cmsApi } from '../utils/cmsApi';
import type { Subject, Post } from '../utils/dataTypes';
import Loading from '../components/ui/state/Loading';
import NotFound from '../components/ui/state/NotFound';
import ErrorDisplay from '../components/ui/state/Error';
import BlogPost from '../components/blog/BlogPost';

export default function PostPage() {
  const { postId, subjectId } = useParams<{ postId: string; subjectId?: string }>();
  const navigate = useNavigate();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) {
      setError('Invalid post id');
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [postData, subjectData] = await Promise.all([
          cmsApi.getPost(postId || ''),
          subjectId ? cmsApi.getSubject(subjectId) : Promise.resolve(null),
        ]);

        if (!cancelled) {
          setPost(postData);
          setSubject(subjectData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load content');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [postId, subjectId]);

  if (loading) return <Loading />;

  if (error) return <ErrorDisplay message={error} />;

  if (!post) return <NotFound title="Post not found" />;

  return (
    <BlogPost
      post={post}
      subjectTitle={subject?.title}
      onBack={() => navigate(`/subjects/${subjectId ?? post.subjectId}`)}
      backLabel={''}
    />
  );
}