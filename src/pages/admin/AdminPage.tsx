import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { SubjectSection } from '../../components/admin/SubjectSection';
import { PostSection } from '../../components/admin/PostSection';
import { useCmsContent } from '../../utils/useCmsContent';

export function AdminPage() {
  const { subjects, posts, loading, error, reload } = useCmsContent();

  const [token, setToken] = useState(localStorage.getItem('cms_admin_token') || '');
  const [status, setStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error'>('success');


  const sortedPosts = useMemo(
    () => [...posts].sort((a, b) => b.id - a.id),
    [posts]
  );

  const saveToken = () => {
    localStorage.setItem('cms_admin_token', token);
    setStatusType('success');
    setStatus('Admin token saved locally.');
  };

  const requireToken = () => {
    if (!token.trim()) {
      setStatusType('error');
      setStatus('Admin token is required for write operations.');
      return false;
    }

    return true;
  };

  return (
    <Box component="main" sx={{ maxWidth: '1200px', mx: 'auto', px: 2, py: 4 }}>
      <Stack spacing={3}>
        <AdminHeader
          token={token}
          setToken={setToken}
          saveToken={saveToken}
          status={status}
          statusType={statusType}
          error={error}
        />

        {loading ? (
          <Stack alignItems="center" py={6}>
            <CircularProgress />
          </Stack>
        ) : (
          <>
            <SubjectSection
              subjects={subjects}
              token={token}
              requireToken={requireToken}
              reload={reload}
              setStatus={setStatus}
              setStatusType={setStatusType}
            />

            <PostSection
              posts={sortedPosts}
              subjects={subjects}
              token={token}
              requireToken={requireToken}
              reload={reload}
              setStatus={setStatus}
              setStatusType={setStatusType}
            />
          </>
        )}
      </Stack>
    </Box>
  );
}
