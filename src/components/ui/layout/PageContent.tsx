import Box from '@mui/material/Box';
import type { ReactNode } from 'react';

interface PageContentProps {
  children: ReactNode;
}

function PageContent({ children }: PageContentProps) {
  return (
    <Box
      component="main"
      sx={{
        maxWidth: '60rem',
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        py: { xs: 5, sm: 7, md: 8 },
      }}
    >
      {children}
    </Box>
  );
}

export default PageContent;