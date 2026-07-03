import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface PageHeaderProps {
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
}

function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <Box>
      <Typography variant="overline" sx={{ letterSpacing: 2 }}>
        {eyebrow}
      </Typography>

      <Typography variant="h3" sx={{ mb: 1 }}>
        {title}
      </Typography>

      {description && (
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      )}
    </Box>
  );
}

export default PageHeader;
