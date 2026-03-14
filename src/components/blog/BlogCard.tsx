import { Link as RouterLink } from 'react-router-dom';
import { Clock, Hash } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Post } from '../../utils/dataTypes';
import { formatPostDate, getPostTags, toTagSlug } from '../../utils/contentTaxonomy';

interface BlogCardProps {
  post: Post;
  onSelectRedirectTo: string;
}

function BlogCard({ post, onSelectRedirectTo }: BlogCardProps) {
  const theme = useTheme();
  const tags = getPostTags(post).slice(0, 4);

  return (
    <Card
      key={post.id}
      sx={{
        cursor: 'pointer',
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: theme.palette.mode === 'light'
            ? '0 18px 32px rgba(64, 45, 24, 0.08)'
            : '0 18px 32px rgba(0, 0, 0, 0.24)',
          borderColor: theme.palette.primary.light,
        },
      }}
    >
      <CardActionArea component={RouterLink} to={onSelectRedirectTo}>
        <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Stack spacing={1.5}>
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
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  whiteSpace: 'nowrap',
                }}
              >
                {formatPostDate(post.date)}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.secondary.main,
                }}
              >
                Open post →
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default BlogCard;