import { useNavigate, useParams } from 'react-router-dom';

import { cmsApi } from '../utils/cmsApi';
import type { Subject, Post } from '../utils/dataTypes';
import { useAsyncData } from '../utils/useAsyncData';
import Loading from '../components/ui/state/Loading';
import NotFound from '../components/ui/state/NotFound';
import ErrorDisplay from '../components/ui/state/Error';
import BlogPost from '../components/blog/BlogPost';

interface PostPageData {
  post: Post | null;
  subject: Subject | null;
}

export default function PostPage() {
  const { postId, subjectId } = useParams<{ postId: string; subjectId?: string }>();
  const navigate = useNavigate();

  const { data, loading, error } = useAsyncData<PostPageData>(async () => {
    if (!postId) {
      throw new Error('Invalid post id');
    }

    const [postData, subjectData] = await Promise.all([
      cmsApi.getPost(postId),
      subjectId ? cmsApi.getSubject(subjectId) : Promise.resolve(null),
    ]);

    return { post: postData, subject: subjectData };
  }, [postId, subjectId]);

  const post = data?.post ?? null;
  const subject = data?.subject ?? null;

  if (loading) return <Loading />;

  if (error) return <ErrorDisplay message={error} />;

  if (!post) return <NotFound title="Post not found" />;

  return (
    <BlogPost
      post={post}
      subjectTitle={subject?.title}
      onBack={() => navigate(`/subjects/${subjectId ?? post.subjectId}`)}
    />
  );
}