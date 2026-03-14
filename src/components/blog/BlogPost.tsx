import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, Hash } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { Post } from '../../utils/dataTypes';
import { formatPostDate, getPostTags, getPostSubjectTitle, toTagSlug } from '../../utils/contentTaxonomy';
import MarkdownContent from '../MarkdownContent';

interface BlogPostProps {
  post: Post;
  subjectTitle?: string;
  onBack: () => void;
  backLabel?: string;
}

function BlogPost({ post, subjectTitle, onBack, backLabel = 'Back to all posts' }: BlogPostProps) {
  const theme = useTheme();
  const tags = getPostTags(post);
  const formattedDate = formatPostDate(post.date);
  const timeSpent = post.timeSpent?.trim() || 'Time spent not specified';
  const [mainCategory, setMainCategory] = useState<string | null>(null);

  useEffect(() => {
    if (subjectTitle) {
      setMainCategory(subjectTitle);
      return;
    }

    getPostSubjectTitle(post).then(setMainCategory);
  }, [post, subjectTitle]);

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

      <Stack spacing={{ xs: 3, md: 4 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
            flexWrap: 'wrap',
            rowGap: 1,
          }}
        >
          {/* Main Category */}
          <Chip
            label={mainCategory}
            size="small"
            sx={{
              fontWeight: 600,
              backgroundColor: 'transparent',
              border: `1px solid ${theme.palette.divider}`,
            }}
          />

          {/* Tags */}
          {tags.length > 0 &&
            tags.map((tag) => (
              <Chip
                key={tag}
                icon={<Hash size={14} />}
                label={tag}
                size="small"
                clickable
                component={RouterLink}
                to={`/tags/${toTagSlug(tag)}`}
                sx={{
                  backgroundColor: 'transparent',
                  color: theme.palette.text.secondary,
                  border: `1px solid ${theme.palette.divider}`,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              />
            ))}
        </Stack>

        {/* Title */}
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.035em',
            maxWidth: '22ch',
          }}
        >
          {post.title}
        </Typography>

        {/* Excerpt */}
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: { xs: '1.05rem', md: '1.1rem' },
            lineHeight: 1.75,
            maxWidth: '48rem',
          }}
        >
          {post.excerpt}
        </Typography>

        {/* Meta */}
        <Stack
          direction="row"
          spacing={3}
          sx={{
            flexWrap: 'wrap',
            alignItems: 'center',
            color: theme.palette.text.secondary,
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Calendar size={16} />
            <Typography variant="body2">{formattedDate}</Typography>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Clock size={16} />
            <Typography variant="body2">{timeSpent}</Typography>
          </Stack>
        </Stack>

        <Divider sx={{ mt: 1 }} />

        <MarkdownContent content={post.content} />
      </Stack>
    </Box>
  );
}

export default BlogPost;