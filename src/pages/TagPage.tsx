import { useParams } from 'react-router-dom';
import { Hash } from 'lucide-react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useCmsContent } from '../utils/useCmsContent';
import { buildPostTags, getPostTags, toTagSlug, getPostPath } from '../utils/contentTaxonomy';
import BlogCard from '../components/blog/BlogCard';
import Loading from '../components/ui/state/Loading';
import ErrorDisplay from '../components/ui/state/Error';

export default function TagPage() {
  const { tagSlug } = useParams<{ tagSlug: string }>();
  const { posts, loading, error } = useCmsContent();

  const postTags = buildPostTags(posts);
  const filteredPosts = posts.filter((post) => {
    const tags = postTags[post.id] ?? [];
    return tags.some((tag) => toTagSlug(tag) === tagSlug);
  });

  if (loading) return <Loading />;

  if (error) return <ErrorDisplay message={error} />;

  const tagLabel =
    filteredPosts.flatMap((post) => getPostTags(post)).find((tag) => toTagSlug(tag) === tagSlug)
    ?? (tagSlug || '').replace(/-/g, ' ');

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="overline" sx={{ letterSpacing: 2 }}>Tag</Typography>
        <Typography variant="h3" sx={{ mb: 1 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Hash size={24} />
            <span>{tagLabel}</span>
          </Stack>
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {filteredPosts.length} related post(s).
        </Typography>
      </Box>

      {filteredPosts.length === 0 ? (
        <Alert severity="info">No posts found for this tag.</Alert>
      ) : (
        <Stack spacing={1.5}>
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} onSelectRedirectTo={getPostPath(post)} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
