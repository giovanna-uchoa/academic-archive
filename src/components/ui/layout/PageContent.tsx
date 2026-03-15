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
        py: { xs: 4, sm: 6 },
      }}
    >
      {children}
    </Box>
  );
}

export default PageContent;