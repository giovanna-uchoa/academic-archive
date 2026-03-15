import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';

import { cmsApi } from '../utils/cmsApi';
import type { Subject, Post } from '../utils/dataTypes';
import BackButton from '../components/ui/BackButton';
import MarkdownContent from '../components/MarkdownContent';
import BlogSection from '../components/blog/BlogSection';
import Loading from '../components/ui/state/Loading';
import NotFound from '../components/ui/state/NotFound';
import ErrorDisplay from '../components/ui/state/Error';
import PageTopBar from '../components/ui/layout/PageTopBar';
import PageContent from '../components/ui/layout/PageContent';
import CategoryHeader from '../components/catalog/CategoryHeader';

function SubjectPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subjectId) return;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const subjectData = await cmsApi.getSubject(subjectId || '');

        setSubject(subjectData);

        if (!subjectData?.blogEnabled) {
          setPosts([]);
          return;
        }

        const postsData = await cmsApi.listPostsBySubjectId(subjectId || '');
        setPosts(postsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [subjectId]);

  if (loading) return <Loading />;

  if (error) return <ErrorDisplay message={error} />;

  if (!subject) return <NotFound title="Subject not found" />;

  return (
    <Box sx={{ width: '100%' }}>
      <PageTopBar>
       <BackButton onClick={() => navigate('/catalog')} />
      </PageTopBar>

      <PageContent>
        <CategoryHeader category={subject} />

        {subject.overview && <MarkdownContent content={subject.overview} />}

        {subject.blogEnabled && (
          <BlogSection subject={subject} subjectPosts={posts} />
        )}
      </PageContent>
    </Box>
  );
}

export default SubjectPage;