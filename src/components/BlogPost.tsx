import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import { blogPosts } from '../data/blogPosts';

interface BlogPostProps {
  postId: number;
  onBack: () => void;
}

export function BlogPost({ postId, onBack }: BlogPostProps) {
  const post = blogPosts.find(p => p.id === postId);
  const theme = useTheme();

  if (!post) {
    return null;
  }

  return (
    <Box
      component="article"
      sx={{
        maxWidth: '56rem',
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
      }}
    >
      <Button
        startIcon={<ArrowLeft size={18} />}
        onClick={onBack}
        sx={{
          mb: { xs: 3, sm: 4 },
          color: theme.palette.text.secondary,
          textTransform: 'none',
          '&:hover': {
            color: theme.palette.primary.main,
          },
        }}
      >
        Back to all posts
      </Button>

      <Stack spacing={{ xs: 2, sm: 3 }}>
        <Box>
          <Chip
            label={post.category}
            size="small"
            sx={{
              backgroundColor: theme.palette.mode === 'light' ? '#f4ede4' : '#3d2f26',
              color: theme.palette.text.secondary,
              mb: 2,
            }}
          />

          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
              mb: 2,
            }}
          >
            {post.title}
          </Typography>

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <Calendar size={16} />
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                {post.date}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <Clock size={16} />
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                {post.readTime}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        <Box
          sx={{
            '& h2': {
              mt: 3,
              mb: 1.5,
              fontSize: '1.5rem',
              fontWeight: 600,
              color: theme.palette.primary.main,
            },
            '& h3': {
              mt: 2.5,
              mb: 1,
              fontSize: '1.25rem',
              fontWeight: 600,
              color: theme.palette.primary.main,
            },
            '& p': {
              mb: 1.5,
              color: theme.palette.text.primary,
              lineHeight: 1.5,
            },
            '& ul, & ol': {
              mb: 1.5,
              pl: 2,
              color: theme.palette.text.primary,
            },
            '& li': {
              mb: 0.5,
            },
            '& code': {
              backgroundColor: theme.palette.mode === 'light' ? '#f4ede4' : '#2a1f1a',
              color: theme.palette.secondary.main,
              px: 0.5,
              py: 0.25,
              borderRadius: '0.25rem',
              fontFamily: 'monospace',
              fontSize: '0.875em',
            },
            '& pre': {
              backgroundColor: theme.palette.mode === 'light' ? '#f4ede4' : '#2a1f1a',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '0.5rem',
              p: 2,
              overflow: 'auto',
              mb: 1.5,
            },
            '& pre code': {
              backgroundColor: 'transparent',
              color: theme.palette.text.primary,
              px: 0,
              py: 0,
            },
            '& strong': {
              fontWeight: 600,
              color: theme.palette.primary.main,
            },
            '& a': {
              color: theme.palette.secondary.main,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </Stack>
    </Box>
  );
}
