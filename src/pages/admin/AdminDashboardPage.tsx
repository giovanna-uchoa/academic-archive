import { useMemo } from 'react';
import { Link as RouterLink, useOutletContext } from 'react-router-dom';
import { LibraryBig, FileText, Tag as TagIcon } from 'lucide-react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import type { AdminOutletContext } from './AdminLayout';
import StatTile from '../../components/admin/StatTile';
import MonthlyActivityChart from '../../components/admin/MonthlyActivityChart';
import { renderSubjectIcon } from '../../utils/iconRenderer';
import {
  buildSubjectSummary,
  buildMonthlyActivity,
  sortPostsByDateDesc,
  formatAccessionNumber,
  formatPostDate,
} from '../../utils/contentTaxonomy';

function AdminDashboardPage() {
  const { subjects, posts, tags } = useOutletContext<AdminOutletContext>();

  const subjectSummary = useMemo(() => buildSubjectSummary(subjects, posts), [subjects, posts]);
  const recentPosts = useMemo(() => sortPostsByDateDesc(posts).slice(0, 6), [posts]);
  const monthlyActivity = useMemo(() => buildMonthlyActivity(posts), [posts]);

  const isEmpty = subjects.length === 0 && posts.length === 0;

  if (isEmpty) {
    return (
      <Paper sx={{ p: 4 }}>
        <Stack spacing={2} alignItems="flex-start">
          <Typography variant="h5">Get started</Typography>
          <Typography variant="body2" color="text.secondary">
            There&apos;s no content yet. Create your first subject to start adding posts.
          </Typography>
          <Button component={RouterLink} to="/admin/subjects" variant="contained">
            Create a subject
          </Button>
        </Stack>
      </Paper>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <StatTile label="Subjects" value={subjects.length} icon={<LibraryBig size={18} />} to="/admin/subjects" />
        <StatTile label="Posts" value={posts.length} icon={<FileText size={18} />} to="/admin/posts" />
        <StatTile label="Tags" value={tags.length} icon={<TagIcon size={18} />} to="/admin/tags" />
      </Stack>

      <Paper sx={{ p: 3 }}>
        <MonthlyActivityChart data={monthlyActivity} />
      </Paper>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Paper sx={{ p: 3, flex: 1 }}>
          <Stack spacing={2}>
            <Typography variant="h6">Subjects</Typography>
            {subjectSummary.length === 0 ? (
              <Alert severity="info">No subjects yet.</Alert>
            ) : (
              <Stack spacing={1}>
                {subjectSummary.map((subject) => (
                  <Box
                    key={subject.id}
                    component={RouterLink}
                    to={`/admin/subjects/${subject.id}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                      p: 1,
                      borderRadius: 1,
                      textDecoration: 'none',
                      color: 'text.primary',
                      '&:hover': { backgroundColor: 'action.hover' },
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                      {subject.icon && (
                        <Box sx={{ color: 'secondary.main', display: 'flex' }}>
                          {renderSubjectIcon(subject.icon, { size: 18 })}
                        </Box>
                      )}
                      <Typography noWrap>{subject.title}</Typography>
                    </Stack>
                    <Chip icon={<LibraryBig size={14} />} label={`${subject.totalPosts} posts`} size="small" />
                  </Box>
                ))}
              </Stack>
            )}
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, flex: 1 }}>
          <Stack spacing={2}>
            <Typography variant="h6">Recent posts</Typography>
            {recentPosts.length === 0 ? (
              <Alert severity="info">No posts yet.</Alert>
            ) : (
              <Stack spacing={1}>
                {recentPosts.map((post) => (
                  <Box
                    key={post.id}
                    component={RouterLink}
                    to={`/admin/posts/${post.id}`}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      p: 1,
                      borderRadius: 1,
                      textDecoration: 'none',
                      color: 'text.primary',
                      '&:hover': { backgroundColor: 'action.hover' },
                    }}
                  >
                    <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.5 }}>
                      {formatAccessionNumber(post.id)}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                      <Typography noWrap>{post.title}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                        {formatPostDate(post.date)}
                      </Typography>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  );
}

export default AdminDashboardPage;
