import { useParams } from 'react-router-dom';
import { Hash } from 'lucide-react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import { useCmsContent } from '../utils/useCmsContent';
import { buildPostTags, getPostTags, toTagSlug, getPostPath } from '../utils/contentTaxonomy';
import BlogCard from '../components/blog/BlogCard';
import AsyncBoundary from '../components/ui/state/AsyncBoundary';
import PageHeader from '../components/ui/PageHeader';

export default function TagPage() {
  const { tagSlug } = useParams<{ tagSlug: string }>();
  const { posts, loading, error } = useCmsContent();

  const postTags = buildPostTags(posts);
  const filteredPosts = posts.filter((post) => {
    const tags = postTags[post.id] ?? [];
    return tags.some((tag) => toTagSlug(tag) === tagSlug);
  });

  const tagLabel =
    filteredPosts.flatMap((post) => getPostTags(post)).find((tag) => toTagSlug(tag) === tagSlug)
    ?? (tagSlug || '').replace(/-/g, ' ');

  return (
    <AsyncBoundary loading={loading} error={error}>
      <Stack spacing={3}>
        <PageHeader
          eyebrow="Tag"
          title={
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Hash size={24} />
              <span>{tagLabel}</span>
            </Stack>
          }
          description={`${filteredPosts.length} related post(s).`}
        />

        {filteredPosts.length === 0 ? (
          <Alert severity="info">No posts found for this tag.</Alert>
        ) : (
          <Stack spacing={1.5}>
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} to={getPostPath(post)} />
            ))}
          </Stack>
        )}
      </Stack>
    </AsyncBoundary>
  );
}
