import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useCmsContent } from '../utils/useCmsContent';
import { buildCategorySummary } from '../utils/contentTaxonomy';
import Loading from '../components/ui/state/Loading';
import ErrorDisplay from '../components/ui/state/Error';
import CategoryCard from '../components/catalog/CategoryCard';

export default function CatalogPage() {
  const { subjects, posts, loading, error } = useCmsContent();
  const categories = buildCategorySummary(subjects, posts);

  if (loading) return <Loading />;

  if (error) return <ErrorDisplay message={error} />;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="overline" sx={{ letterSpacing: 2 }}>
          Catalog
        </Typography>

        <Typography variant="h3" sx={{ mb: 1 }}>
          Study Categories
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Thematic index of subjects and their related entries.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr 1fr',
          },
          gap: { xs: 2, sm: 3 },
          width: '100%',
        }}
      >
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
          />
        ))}
      </Box>
    </Stack>
  );
}