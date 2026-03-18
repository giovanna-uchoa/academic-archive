import { useEffect, useState } from 'react';
import { Calendar, Clock, Hash } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { cmsApi } from '../../utils/cmsApi';
import type { Post } from '../../utils/dataTypes';
import { formatPostDate, getPostTags, toTagSlug } from '../../utils/contentTaxonomy';

import BackButton from '../ui/BackButton';
import MarkdownContent from '../MarkdownContent';
import PageTopBar from '../ui/layout/PageTopBar';
import PageContent from '../ui/layout/PageContent';

interface BlogPostProps {
  post: Post;
  subjectTitle?: string;
  onBack: () => void;
}

function BlogPost({ post, subjectTitle, onBack }: BlogPostProps) {
  const theme = useTheme();
  const tags = getPostTags(post);
  const formattedDate = formatPostDate(post.date);
  const timeSpent = post.timeSpent?.trim() || 'Time spent not specified';
  const [mainCategory, setMainCategory] = useState<string>(subjectTitle ?? post.subjectId);

  useEffect(() => {
    if (subjectTitle) {
      setMainCategory(subjectTitle);
      return;
    }

    let cancelled = false;

    async function loadSubjectTitle() {
      try {
        const subject = await cmsApi.getSubject(post.subjectId);
        if (!cancelled) {
          setMainCategory(subject?.title ?? post.subjectId);
        }
      } catch {
        if (!cancelled) {
          setMainCategory(post.subjectId);
        }
      }
    }

    void loadSubjectTitle();

    return () => {
      cancelled = true;
    };
  }, [post.subjectId, subjectTitle]);

  return (
    <Box sx={{ width: '100%' }}>
      <PageTopBar>
       <BackButton onClick={onBack} />
      </PageTopBar>


      {/* Main content */}
      <PageContent>
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
      </PageContent>
    </Box>
  );
}

export default BlogPost;