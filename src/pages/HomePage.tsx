import { Link as RouterLink } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useCmsContent } from '../utils/useCmsContent';
import {
  buildCategorySummary,
  sortPostsByDateDesc,
} from '../utils/contentTaxonomy';
import { renderSubjectIcon } from '../utils/iconRenderer';

import Hero from '../components/Hero';
import BlogCard from '../components/blog/BlogCard';

function HomePage() {
  const { posts, subjects, tagSummary, loading, error } = useCmsContent();

  if (loading) {
    return (
      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const orderedPosts = sortPostsByDateDesc(posts);
  const recentPosts = orderedPosts.slice(0, 6);
  const categories = buildCategorySummary(subjects, posts).slice(0, 6);
  const tags = tagSummary.slice(0, 12);

  return (
    <Stack spacing={4}>
      <Hero />

      <Divider />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '2fr 1fr',
          },
          gap: { xs: 2, sm: 3 },
          width: '100%',
        }}
      >
        {/* Posts */}
        <Box>
          <Stack spacing={2.5}>
            <Typography variant="h5">Recent Entries</Typography>

            <Stack spacing={2}>
              {recentPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  onSelectRedirectTo={`post/${post.id}`}
                />
              ))}
            </Stack>
          </Stack>
        </Box>

        {/* Sidebar */}
        <Box>
          <Stack spacing={4}>
            <Stack spacing={1.5}>
              <Typography variant="h6">Catalog</Typography>

              {categories.map((category) => (
                <Stack
                  key={category.id}
                  direction="row"
                  spacing={0.5}
                  component={RouterLink}
                  to={`/subjects/${category.id}`}
                  sx={{
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: 'text.secondary',
                    '&:hover': { color: 'secondary.main' },
                  }}
                >
                  <Box sx={{ display: 'flex', color: 'secondary.main' }}>
                    {renderSubjectIcon(category.icon, {
                      size: 18,
                      fallbackSize: '1rem',
                    })}
                  </Box>

                  <Typography variant="body2">
                    {category.title} ({category.totalPosts})
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="h6">Popular Tags</Typography>

              <Stack direction="row" flexWrap="wrap" gap={1}>
                {tags.map((tag) => (
                  <Chip
                    key={tag.slug}
                    size="small"
                    label={`${tag.label} (${tag.totalPosts})`}
                    component={RouterLink}
                    to={`/tags/${tag.slug}`}
                    clickable
                  />
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
}

export default HomePage;