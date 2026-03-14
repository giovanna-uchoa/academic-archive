import { Link as RouterLink } from 'react-router-dom';
import { CalendarDays, FolderTree } from 'lucide-react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useCmsContent } from '../utils/useCmsContent';
import { buildArchiveGroups, formatPostDate, getPostPath } from '../utils/contentTaxonomy';

export default function ArchivesPage() {
  const { posts, subjects, loading, error } = useCmsContent();

  const subjectTitles = new Map(subjects.map((subject) => [subject.id, subject.title]));
  const groups = buildArchiveGroups(posts);
  const groupedByYear = groups.reduce<Record<number, typeof groups>>((acc, group) => {
    if (!acc[group.year]) {
      acc[group.year] = [];
    }
    acc[group.year].push(group);
    return acc;
  }, {});

  if (loading) {
    return (
      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="overline" sx={{ letterSpacing: 2 }}>Archives</Typography>
        <Typography variant="h3" sx={{ mb: 1 }}>Timeline by Date</Typography>
        <Typography variant="body1" color="text.secondary">
          Browse content through a chronological timeline organized by month and year.
        </Typography>
      </Box>

      {Object.entries(groupedByYear)
        .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
        .map(([year, yearGroups]) => (
          <Stack key={year} spacing={2}>
            <Typography variant="h5">{year}</Typography>

            <Box
              sx={{
                position: 'relative',
                pl: { xs: 3, md: 4 },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: { xs: 7, md: 9 },
                  top: 6,
                  bottom: 6,
                  width: '2px',
                  backgroundColor: 'divider',
                },
              }}
            >
              <Stack spacing={2.5}>
                {yearGroups.map((group) => (
                  <Box key={`${group.year}-${group.month}`} sx={{ position: 'relative' }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        left: { xs: -24, md: -26 },
                        top: 8,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        border: (theme) => `2px solid ${theme.palette.secondary.main}`,
                        backgroundColor: 'background.paper',
                      }}
                    />

                    <Paper variant="outlined" sx={{ p: { xs: 1.5, md: 2 } }}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.5 }}>
                        <CalendarDays size={16} />
                        <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                          {group.label}
                        </Typography>
                      </Stack>

                      <Stack divider={<Divider flexItem />}>
                        {group.posts.map((post) => (
                          <Stack
                            key={post.id}
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={1.25}
                            sx={{ py: 1.25, justifyContent: 'space-between', alignItems: { md: 'center' } }}
                          >
                            <Box>
                              <Link
                                component={RouterLink}
                                to={getPostPath(post)}
                                underline="hover"
                                color="inherit"
                                variant="subtitle1"
                              >
                                {post.title}
                              </Link>
                              <Typography variant="body2" color="text.secondary">
                                {post.excerpt}
                              </Typography>
                            </Box>

                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                              <Chip
                                icon={<FolderTree size={14} />}
                                label={subjectTitles.get(post.subjectId) ?? post.subjectId}
                                component={RouterLink}
                                to={`/catalog/${post.subjectId}`}
                                clickable
                                size="small"
                              />
                            </Stack>
                          </Stack>
                        ))}
                      </Stack>
                    </Paper>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        ))}
    </Stack>
  );
}
