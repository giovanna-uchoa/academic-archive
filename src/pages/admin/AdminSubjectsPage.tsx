import { useOutletContext, useParams } from 'react-router-dom';
import SubjectForm from '../../components/admin/SubjectForm';
import type { AdminOutletContext } from './AdminLayout';
import { useAdminEditRoute } from './useAdminEditRoute';

function AdminSubjectsPage() {
  const { subjects, posts, reload, setStatus, setStatusType, registerDirty } =
    useOutletContext<AdminOutletContext>();
  const { subjectId } = useParams();
  const { initialEditValue, onEditComplete } = useAdminEditRoute(subjectId, '/admin/subjects');

  return (
    <SubjectForm
      subjects={subjects}
      posts={posts}
      reload={reload}
      setStatus={setStatus}
      setStatusType={setStatusType}
      initialEditId={initialEditValue}
      onEditComplete={onEditComplete}
      registerDirty={registerDirty}
    />
  );
}

export default AdminSubjectsPage;
