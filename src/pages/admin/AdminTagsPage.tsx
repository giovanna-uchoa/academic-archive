import { useOutletContext, useParams } from 'react-router-dom';
import TagForm from '../../components/admin/TagForm';
import type { AdminOutletContext } from './AdminLayout';
import { useAdminEditRoute } from './useAdminEditRoute';

function AdminTagsPage() {
  const { tags, tagSummary, reload, setStatus, setStatusType, registerDirty } =
    useOutletContext<AdminOutletContext>();
  const { tagSlug } = useParams();
  const { initialEditValue, onEditComplete } = useAdminEditRoute(tagSlug, '/admin/tags');

  return (
    <TagForm
      tags={tags}
      tagSummary={tagSummary}
      reload={reload}
      setStatus={setStatus}
      setStatusType={setStatusType}
      initialEditSlug={initialEditValue}
      onEditComplete={onEditComplete}
      registerDirty={registerDirty}
    />
  );
}

export default AdminTagsPage;
