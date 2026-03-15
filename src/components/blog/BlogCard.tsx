import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { Post } from '../../utils/dataTypes';
import { formatPostDate } from '../../utils/contentTaxonomy';

interface BlogCardProps {
  post: Post;
  onSelectRedirectTo: string;
}

function BlogCard({ post, onSelectRedirectTo }: BlogCardProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        boxSizing: 'border-box',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow:
            theme.palette.mode === 'light'
              ? '0 18px 32px rgba(64,45,24,0.08)'
              : '0 18px 32px rgba(0,0,0,0.24)',
          borderColor: theme.palette.primary.light,
        },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={onSelectRedirectTo}
        sx={{
          width: '100%',
          display: 'block',
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2, sm: 2.5 },
            width: '100%',
            minWidth: 0,
          }}
        >
          <Stack spacing={1.5} sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.primary.main,
                wordBreak: 'break-word',
                transition: 'color 0.2s',
                '&:hover': {
                  color: theme.palette.secondary.main,
                },
              }}
            >
              {post.title}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                overflowWrap: 'anywhere',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {post.excerpt}
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: 'center',
                pt: 1,
                flexWrap: 'wrap',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                }}
              >
                {formatPostDate(post.date)}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.secondary.main,
                  fontWeight: 500,
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