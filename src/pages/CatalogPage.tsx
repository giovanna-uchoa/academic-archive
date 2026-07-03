import Stack from '@mui/material/Stack';

import { useCmsContent } from '../utils/useCmsContent';
import { buildSubjectSummary } from '../utils/contentTaxonomy';
import AsyncBoundary from '../components/ui/state/AsyncBoundary';
import PageHeader from '../components/ui/PageHeader';
import FeaturedTileGrid from '../components/ui/FeaturedTileGrid';
import SubjectCard from '../components/catalog/SubjectCard';

export default function CatalogPage() {
  const { subjects, posts, loading, error } = useCmsContent();
  const subjectSummary = buildSubjectSummary(subjects, posts);

  return (
    <AsyncBoundary loading={loading} error={error}>
      <Stack spacing={3}>
        <PageHeader
          eyebrow="Catalog"
          title="Study Categories"
          description="Thematic index of subjects and their related entries."
        />

        <FeaturedTileGrid
          items={subjectSummary}
          keyFn={(subject) => subject.id}
          columns={{ xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
          autoRows={{ xs: 'auto', sm: 'minmax(220px, auto)' }}
          featuredSpan={{ column: 2, row: 2 }}
          renderItem={(subject, featured) => (
            <SubjectCard subject={subject} featured={featured} />
          )}
        />
      </Stack>
    </AsyncBoundary>
  );
}
