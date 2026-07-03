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
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gridAutoRows: { xs: 'auto', sm: 'minmax(220px, auto)' },
          gap: { xs: 2, sm: 3 },
          width: '100%',
        }}
      >
        {categories.map((category, index) => (
          <Box
            key={category.id}
            sx={index === 0 ? { gridColumn: { sm: 'span 2' }, gridRow: { sm: 'span 2' } } : undefined}
          >
            <CategoryCard category={category} featured={index === 0} />
          </Box>
        ))}
      </Box>
    </Stack>
  );
}