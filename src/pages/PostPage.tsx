import { useNavigate, useParams } from 'react-router-dom';

import { cmsApi } from '../utils/cmsApi';
import type { Subject, Post } from '../utils/dataTypes';
import { useAsyncData } from '../utils/useAsyncData';
import AsyncBoundary from '../components/ui/state/AsyncBoundary';
import NotFound from '../components/ui/state/NotFound';
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

  return (
    <AsyncBoundary loading={loading} error={error}>
      {!post ? (
        <NotFound title="Post not found" />
      ) : (
        <BlogPost
          post={post}
          subjectTitle={subject?.title}
          onBack={() => navigate(`/subjects/${subjectId ?? post.subjectId}`)}
        />
      )}
    </AsyncBoundary>
  );
}
