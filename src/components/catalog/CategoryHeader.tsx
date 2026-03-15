import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { renderSubjectIcon } from '../../utils/iconRenderer';
import type { Subject } from '../../utils/dataTypes';

interface CategoryHeaderProps {
  category: Subject;
}

function CategoryHeader({ category }: CategoryHeaderProps) {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
      <Box sx={{ color: theme.palette.secondary.main }}>
          {renderSubjectIcon(category.icon, { size: 34, fallbackSize: '2.1rem' })}
      </Box>

      <Box>
          <Typography
          variant="h2"
          sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }, mb: 1 }}
          >
          {category.title}
          </Typography>

          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
          {category.description}
          </Typography>
      </Box>
      </Stack>
    </Box>
  );
}

export default CategoryHeader;