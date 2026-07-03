import { Link as RouterLink } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
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
  featured?: boolean;
}

function BlogCard({ post, onSelectRedirectTo, featured = false }: BlogCardProps) {
  const theme = useTheme();
  const affordanceSize = featured ? 40 : 32;
  const accessionNumber = `№${String(post.id).padStart(3, '0')}`;

  return (
    <Card
      sx={{
        position: 'relative',
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
        '&:hover .card-open-affordance': {
          opacity: 1,
          transform: 'scale(1)',
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
            p: featured ? { xs: 2.5, sm: 3.5 } : { xs: 2, sm: 2.5 },
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
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.5 }}>
                {accessionNumber}
              </Typography>

              <Typography
                variant={featured ? 'h5' : 'h6'}
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
                  WebkitLineClamp: featured ? 5 : 3,
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
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>

      <Box
        className="card-open-affordance"
        sx={{
          position: 'absolute',
          right: 16,
          bottom: 16,
          width: affordanceSize,
          height: affordanceSize,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          opacity: 0,
          transform: 'scale(0.8)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          pointerEvents: 'none',
        }}
      >
        <ArrowUpRight size={featured ? 18 : 16} />
      </Box>
    </Card>
  );
}

export default BlogCard;
