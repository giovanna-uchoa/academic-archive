import { Link as RouterLink } from 'react-router-dom';
import { Hash } from 'lucide-react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useCmsContent } from '../utils/useCmsContent';
import { buildTagSummary } from '../utils/contentTaxonomy';

export default function TagsPage() {
  const { posts, subjects, loading, error } = useCmsContent();
  const tags = buildTagSummary(posts, subjects);

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
        <Typography variant="overline" sx={{ letterSpacing: 2 }}>Tags</Typography>
        <Typography variant="h3" sx={{ mb: 1 }}>Topic Map</Typography>
        <Typography variant="body1" color="text.secondary">
          Browse recurring themes and cross-cutting filters across the archive.
        </Typography>
      </Box>

      <Card variant="outlined">
        <CardContent>
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
        </CardContent>
      </Card>
    </Stack>
  );
}
