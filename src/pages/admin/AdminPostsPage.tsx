import { useOutletContext, useParams } from 'react-router-dom';
import PostForm from '../../components/admin/PostForm';
import type { AdminOutletContext } from './AdminLayout';
import { useAdminEditRoute } from './useAdminEditRoute';
import { ADMIN_POSTS_PATH } from './adminSections';

function parsePostId(raw: string): number | null {
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function AdminPostsPage() {
  const { posts, subjects, tags, reload, setStatus, setStatusType, registerDirty } =
    useOutletContext<AdminOutletContext>();
  const { postId } = useParams();
  const { initialEditValue, onEditComplete } = useAdminEditRoute(postId, ADMIN_POSTS_PATH, parsePostId);

  return (
    <PostForm
      posts={posts}
      subjects={subjects}
      tags={tags}
      reload={reload}
      setStatus={setStatus}
      setStatusType={setStatusType}
      initialEditValue={initialEditValue}
      onEditComplete={onEditComplete}
      registerDirty={registerDirty}
    />
  );
}

export default AdminPostsPage;
