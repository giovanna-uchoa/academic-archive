import { useOutletContext, useParams } from 'react-router-dom';
import PostForm from '../../components/admin/PostForm';
import type { AdminOutletContext } from './AdminLayout';
import { useAdminEditRoute } from './useAdminEditRoute';

function parsePostId(raw: string): number | null {
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function AdminPostsPage() {
  const { posts, subjects, tags, reload, setStatus, setStatusType, registerDirty } =
    useOutletContext<AdminOutletContext>();
  const { postId } = useParams();
  const { initialEditValue, onEditComplete } = useAdminEditRoute(postId, '/admin/posts', parsePostId);

  return (
    <PostForm
      posts={posts}
      subjects={subjects}
      tags={tags}
      reload={reload}
      setStatus={setStatus}
      setStatusType={setStatusType}
      initialEditPostId={initialEditValue}
      onEditComplete={onEditComplete}
      registerDirty={registerDirty}
    />
  );
}

export default AdminPostsPage;
