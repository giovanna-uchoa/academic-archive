import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';

import { cmsApi } from '../utils/cmsApi';
import type { Subject, Post } from '../utils/dataTypes';
import { useAsyncData } from '../utils/useAsyncData';
import BackButton from '../components/ui/BackButton';
import MarkdownContent from '../components/MarkdownContent';
import BlogSection from '../components/blog/BlogSection';
import AsyncBoundary from '../components/ui/state/AsyncBoundary';
import NotFound from '../components/ui/state/NotFound';
import PageTopBar from '../components/ui/layout/PageTopBar';
import PageContent from '../components/ui/layout/PageContent';
import SubjectHeader from '../components/catalog/SubjectHeader';

interface SubjectPageData {
  subject: Subject | null;
  posts: Post[];
}

function SubjectPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();

  const { data, loading, error } = useAsyncData<SubjectPageData>(async () => {
    if (!subjectId) return { subject: null, posts: [] };

    const subjectData = await cmsApi.getSubject(subjectId);
    if (!subjectData?.blogEnabled) {
      return { subject: subjectData, posts: [] };
    }

    const postsData = await cmsApi.listPostsBySubjectId(subjectId);
    return { subject: subjectData, posts: postsData };
  }, [subjectId]);

  const subject = data?.subject ?? null;
  const posts = data?.posts ?? [];

  return (
    <AsyncBoundary loading={loading} error={error}>
      {!subject ? (
        <NotFound title="Subject not found" />
      ) : (
        <Box sx={{ width: '100%' }}>
          <PageTopBar>
            <BackButton onClick={() => navigate('/catalog')} />
          </PageTopBar>

          <PageContent>
            <SubjectHeader subject={subject} />

            {subject.overview && <MarkdownContent content={subject.overview} />}

            {subject.blogEnabled && (
              <BlogSection subject={subject} subjectPosts={posts} />
            )}
          </PageContent>
        </Box>
      )}
    </AsyncBoundary>
  );
}

export default SubjectPage;
