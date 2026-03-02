import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import { blogPosts } from '../data/blogPosts';

interface BlogListProps {
  onSelectPost: (id: number) => void;
}

export function BlogList({ onSelectPost }: BlogListProps) {
  const theme = useTheme();

  return (
    <Box
      component="section"
      id="blog"
      sx={{
        maxWidth: '1200px',
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        py: { xs: 6, sm: 8 },
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Typography variant="h2" sx={{ mb: 1 }}>
          Recent Posts
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
          Things I've been learning, testing, and building
        </Typography>
      </Box>

      <Stack spacing={2}>
        {blogPosts.map((post) => (
          <Card
            key={post.id}
            component={CardActionArea}
            onClick={() => onSelectPost(post.id)}
            sx={{ cursor: 'pointer' }}
          >
            <CardContent>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
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
                  <Chip
                    label={post.category}
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.mode === 'light' ? '#f4ede4' : '#3d2f26',
                      color: theme.palette.text.secondary,
                      height: 'auto',
                      '& .MuiChip-label': {
                        px: 1,
                        py: 0.25,
                        fontSize: '0.75rem',
                      },
                    }}
                  />
                </Stack>

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

                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  {post.excerpt}
                </Typography>

                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', pt: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.secondary.main }}
                  >
                    Read more
                  </Typography>
                  <ArrowRight size={16} />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
