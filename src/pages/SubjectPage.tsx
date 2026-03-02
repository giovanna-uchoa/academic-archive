import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { useCmsContent } from '../utils/useCmsContent';
import { BlogPost } from '../components/BlogPost';
import { renderRichContent } from '../utils/renderContent';

export function SubjectPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const theme = useTheme();
  const { subjects, posts, loading, error } = useCmsContent();

  const subject = subjects.find(item => item.id === (subjectId || ''));

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
      <Box
        component="main"
        sx={{
          maxWidth: '56rem',
          mx: 'auto',
          px: { xs: 2, sm: 3 },
          py: { xs: 6, sm: 8 },
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              color: theme.palette.primary.main,
            }}
          >
            Subject Not Found
          </Typography>
          <Button
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate('/')}
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            Back to Home
          </Button>
        </Box>
      </Box>
    );
  }

  // Filter blog posts for this subject
  const subjectPosts = posts.filter(post => post.subjectId === subject.id);

  const selectedPostData = subjectPosts.find(post => post.id === selectedPost) || null;

  if (selectedPostData) {
    return <BlogPost post={selectedPostData} subjectTitle={subject.title} onBack={() => setSelectedPost(null)} />;
  }

  return (
    <Box
      component="main"
      sx={{
        maxWidth: '56rem',
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
      }}
    >
      {/* Back Button */}
      <Button
        startIcon={<ArrowLeft size={18} />}
        onClick={() => navigate('/')}
        sx={{
          mb: { xs: 3, sm: 4 },
          color: theme.palette.text.secondary,
          textTransform: 'none',
          '&:hover': {
            color: theme.palette.primary.main,
          },
        }}
      >
        Back to Home
      </Button>

      {/* Subject Header */}
      <Box sx={{ mb: { xs: 3, sm: 6 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }} sx={{ mb: 2 }}>
          <Typography variant="h2" sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
            {subject.icon}
          </Typography>
          <Box>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
                mb: 1,
              }}
            >
              {subject.title}
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
              {subject.description}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Subject Overview */}
      <Box
        sx={{
          mb: { xs: 6, sm: 8 },
          '& h2': {
            mt: 2.5,
            mb: 1.5,
            fontSize: '1.5rem',
            fontWeight: 600,
            color: theme.palette.primary.main,
          },
          '& h3': {
            mt: 2,
            mb: 1,
            fontSize: '1.25rem',
            fontWeight: 600,
            color: theme.palette.primary.main,
          },
          '& p': {
            mb: 1.5,
            color: theme.palette.text.primary,
            lineHeight: 1.6,
          },
          '& ul, & ol': {
            mb: 1.5,
            pl: 2,
            color: theme.palette.text.primary,
          },
          '& li': {
            mb: 0.5,
          },
          '& strong': {
            fontWeight: 600,
            color: theme.palette.primary.main,
          },
        }}
        dangerouslySetInnerHTML={{ __html: renderRichContent(subject.overview) }}
      />

      {/* Blog Posts Section */}
      <Box>
        <Typography
          variant="h5"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: { xs: 2, sm: 3 },
            color: theme.palette.primary.main,
          }}
        >
          <BookOpen size={24} />
          Articles & Experiments
        </Typography>

        {subjectPosts.length === 0 ? (
          <Alert
            severity="info"
            sx={{
              textAlign: 'center',
              py: 6,
            }}
          >
            No articles yet. Check back soon!
          </Alert>
        ) : (
          <Stack spacing={{ xs: 2, sm: 3 }}>
            {subjectPosts.map((post) => (
              <Card
                key={post.id}
                component={CardActionArea}
                onClick={() => setSelectedPost(post.id)}
                sx={{ cursor: 'pointer' }}
              >
                <CardContent>
                  <Stack spacing={1}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      sx={{
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: theme.palette.primary.main,
                          '&:hover': {
                            color: theme.palette.secondary.main,
                          },
                          transition: 'color 0.2s',
                        }}
                      >
                        {post.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {post.date}
                      </Typography>
                    </Stack>

                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      {post.excerpt}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        alignItems: 'center',
                        pt: 1,
                      }}
                    >
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                        <Clock size={16} />
                        <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                          {post.timeSpent}
                        </Typography>
                      </Stack>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.secondary.main,
                        }}
                      >
                        Read more →
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
