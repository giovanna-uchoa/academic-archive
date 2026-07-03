import { Link as RouterLink } from 'react-router-dom';
import { Hash } from 'lucide-react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import { useCmsContent } from '../utils/useCmsContent';
import AsyncBoundary from '../components/ui/state/AsyncBoundary';
import PageHeader from '../components/ui/PageHeader';

export default function TagsPage() {
  const { tagSummary, loading, error } = useCmsContent();
  const tags = tagSummary;

  return (
    <AsyncBoundary loading={loading} error={error}>
      <Stack spacing={3}>
        <PageHeader
          eyebrow="Tags"
          title="Topic Map"
          description="Browse recurring themes and cross-cutting filters across the archive."
        />

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {tags.map((tag) => (
            <Chip
              key={tag.slug}
              icon={<Hash size={14} />}
              label={`${tag.label} (${tag.totalPosts})`}
              component={RouterLink}
              to={`/tags/${tag.slug}`}
              clickable
            />
          ))}
        </Stack>
      </Stack>
    </AsyncBoundary>
  );
}
