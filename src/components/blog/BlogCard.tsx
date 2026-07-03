import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { Post } from '../../utils/dataTypes';
import { formatAccessionNumber, formatPostDate } from '../../utils/contentTaxonomy';
import { getContentPalette } from '../../theme/muiTheme';
import TileCard from '../ui/TileCard';

interface BlogCardProps {
  post: Post;
  to: string;
  featured?: boolean;
}

function BlogCard({ post, to, featured = false }: BlogCardProps) {
  const theme = useTheme();
  const accessionNumber = formatAccessionNumber(post.id);

  return (
    <TileCard
      to={to}
      featured={featured}
      cardSx={{
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
    </TileCard>
  );
}

export default BlogCard;
