import { Link as RouterLink } from 'react-router-dom';
import { LibraryBig } from 'lucide-react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useCmsContent } from '../utils/useCmsContent';
import { buildCategorySummary } from '../utils/contentTaxonomy';
import { renderSubjectIcon } from '../utils/iconRenderer';

export default function CatalogPage() {
  const { subjects, posts, loading, error } = useCmsContent();
  const categories = buildCategorySummary(subjects, posts);

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

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="overline" sx={{ letterSpacing: 2 }}>Catalog</Typography>
        <Typography variant="h3" sx={{ mb: 1 }}>Study Categories</Typography>
        <Typography variant="body1" color="text.secondary">
          Thematic index of subjects and their related entries.
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        {categories.map((category) => (
          <Grid item xs={12} md={6} key={category.id}>
            <Card
              variant="outlined"
              sx={{
                borderColor: 'divider',
              }}
            >
              <CardActionArea component={RouterLink} to={`/subjects/${category.id}`}>
                <CardContent>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <Box sx={{ color: 'secondary.main' }}>
                        {renderSubjectIcon(category.icon, { size: 24 })}
                      </Box>
                      <Typography variant="h6">{category.title}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">{category.description}</Typography>
                    <Chip icon={<LibraryBig size={14} />} label={`${category.totalPosts} posts`} size="small" sx={{ width: 'fit-content' }} />
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
