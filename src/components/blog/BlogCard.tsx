import { Link as RouterLink } from 'react-router-dom';
import { Clock } from 'lucide-react';
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
    <Card key={post.id} sx={{ cursor: 'pointer' }}>
      <CardActionArea component={RouterLink} to={onSelectRedirectTo}>
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
                {formatPostDate(post.date)}
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