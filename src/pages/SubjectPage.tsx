import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { cmsApi } from '../utils/cmsApi';
import { renderSubjectIcon } from '../utils/iconRenderer';
import BlogSection from '../components/blog/BlogSection';
import MarkdownContent from '../components/MarkdownContent';
import type { Subject, Post } from '../utils/dataTypes';

function SubjectPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subjectId) return;

    async function load() {
      try {
        setLoading(true);

        const [subjectData, postsData] = await Promise.all([
          cmsApi.getSubject(subjectId || ''),
          cmsApi.listPostsBySubjectId(subjectId || ''),
        ]);

        setSubject(subjectData);
        setPosts(postsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [subjectId]);

  if (loading) {
    return (
      <Box component="main" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box component="main" sx={{ maxWidth: '56rem', mx: 'auto', px: { xs: 2, sm: 3 }, py: 6 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!subject) {
    return (
      <Box component="main" sx={{ maxWidth: '56rem', mx: 'auto', px: 3, py: 8, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ mb: 2, color: theme.palette.primary.main }}>
          Subject not found
        </Typography>

        <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
    {/* Back button */}
      <Box
        sx={{
          maxWidth: '72rem',
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          pt: { xs: 3, sm: 4 },
        }}
      >
        <Button
          startIcon={<ArrowLeft size={18} />}
          onClick={() => navigate(`/catalog`)}
          sx={{
            mb: 4,
            textTransform: 'none',
            color: theme.palette.text.secondary,
            '&:hover': { color: theme.palette.primary.main },
          }}
        >
          Back
        </Button>
      </Box>
      <Box
        component="main"
        sx={{
          maxWidth: '60rem',
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: { xs: 4, sm: 6 },
        }}
      >
        <Box sx={{ mb: 6 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <Box sx={{ color: theme.palette.secondary.main }}>
              {renderSubjectIcon(subject.icon, { size: 34, fallbackSize: '2.1rem' })}
            </Box>

            <Box>
              <Typography
                variant="h2"
                sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }, mb: 1 }}
              >
                {subject.title}
              </Typography>

              <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                {subject.description}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {subject.overview && <MarkdownContent content={subject.overview} />}

        <BlogSection subject={subject} subjectPosts={posts} />
      </Box>
    </Box>
  );
}

export default SubjectPage;