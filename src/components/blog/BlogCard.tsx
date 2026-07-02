import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { Post } from '../../utils/dataTypes';
import { formatPostDate } from '../../utils/contentTaxonomy';
import { getContentPalette } from '../../theme/muiTheme';

interface BlogCardProps {
  post: Post;
  onSelectRedirectTo: string;
}

function BlogCard({ post, onSelectRedirectTo }: BlogCardProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          boxShadow: getContentPalette(theme.palette.mode).elevatedShadow,
          borderColor: theme.palette.primary.light,
        },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={onSelectRedirectTo}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            p: { xs: 2, sm: 2.5 },
          }}
        >
          <Stack
            sx={{
              height: '100%',
              justifyContent: 'space-between',
            }}
          >
            {/* Top content */}
            <Stack spacing={1.2}>
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.primary.main,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  transition: 'color 0.2s',
                }}
              >
                {post.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {post.excerpt}
              </Typography>
            </Stack>

            {/* Footer */}
            <Stack direction="row" spacing={2} alignItems="center" pt={2}>
              <Typography variant="caption" color="text.secondary">
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
