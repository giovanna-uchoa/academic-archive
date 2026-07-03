import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useCmsContent } from '../utils/useCmsContent';
import {
  buildCategorySummary,
  sortPostsByDateDesc,
} from '../utils/contentTaxonomy';
import { renderSubjectIcon } from '../utils/iconRenderer';

import Hero from '../components/Hero';
import Loading from '../components/ui/state/Loading';
import ErrorDisplay from '../components/ui/state/Error';
import BlogCard from '../components/blog/BlogCard';

function HomePage() {
  const { posts, subjects, tagSummary, loading, error } = useCmsContent();

  if (loading) return <Loading />;

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  const orderedPosts = sortPostsByDateDesc(posts);
  const recentPosts = orderedPosts.slice(0, 6);
  const categories = buildCategorySummary(subjects, posts).slice(0, 6);
  const tags = tagSummary.slice(0, 12);

  return (
    <Stack spacing={{ xs: 4, md: 6 }}>
      <Hero />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '2fr 1fr',
          },
          gap: { xs: 3, sm: 4, lg: 6 },
          width: '100%',
        }}
      >
        {/* Posts */}
        <Box>
          <Stack spacing={2.5}>
            <Typography variant="h5">Recent Entries</Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gridAutoRows: { xs: 'auto', sm: 'minmax(200px, auto)' },
                gap: { xs: 2, sm: 3 },
              }}
            >
              {recentPosts.map((post, index) => (
                <Box key={post.id} sx={index === 0 ? { gridColumn: { sm: 'span 2' } } : undefined}>
                  <BlogCard
                    post={post}
                    onSelectRedirectTo={`post/${post.id}`}
                    featured={index === 0}
                  />
                </Box>
              ))}
            </Box>
          </Stack>
        </Box>

        {/* Sidebar */}
        <Box>
          <Stack spacing={4}>
            <Stack spacing={1.5}>
              <Typography variant="h6">Catalog</Typography>

              {categories.map((category) => (
                <Box
                  key={category.id}
                  component={RouterLink}
                  to={`/subjects/${category.id}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: 'text.secondary',
                    '&:hover': { color: 'secondary.main' },
                  }}
                >
                  <Typography variant="body2">
                    {category.title}
                  </Typography>
                </Box>
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