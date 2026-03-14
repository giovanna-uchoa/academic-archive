import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import type { Post } from '../../utils/dataTypes';
import MarkdownContent from '../MarkdownContent';

interface BlogPostProps {
  post: Post;
  subjectTitle?: string;
  onBack: () => void;
  backLabel?: string;
}

function BlogPost({ post, subjectTitle, onBack, backLabel = 'Back to all posts' }: BlogPostProps) {
  const theme = useTheme();

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
        {backLabel}
      </Button>

      <Stack spacing={{ xs: 2, sm: 3 }}>
        <Box>
          <Chip
            label={subjectTitle || post.subjectId}
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
            {
              post.timeSpent &&
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <Clock size={16} />
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  {post.timeSpent}
                </Typography>
              </Stack>
            }
          </Stack>
        </Box>

        <MarkdownContent content={post.content} />
      </Stack>
    </Box>
  );
}

export default BlogPost;