import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import BlogPost from '../components/blog/BlogPost';
import { cmsApi } from '../utils/cmsApi';
import type { Subject, Post } from '../utils/dataTypes';

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

  if (loading) {
    return (
      <Box
        component="main"
        sx={{
          py: 8,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box component="main" sx={{ maxWidth: 700, mx: 'auto', p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box component="main" sx={{ maxWidth: 700, mx: 'auto', p: 3 }}>
        <Alert severity="warning">Post not found.</Alert>
      </Box>
    );
  }

  return (
    <BlogPost
      post={post}
      subjectTitle={subject?.title}
      onBack={() => navigate(`/subjects/${subjectId ?? post.subjectId}`)}
      backLabel="Back to subject"
    />
  );
}