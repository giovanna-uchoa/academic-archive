import Box from '@mui/material/Box';
import type { ReactNode } from 'react';

interface PageTopBarProps {
  children: ReactNode;
}

function PageTopBar({ children }: PageTopBarProps) {
  return (
    <Box
      sx={{
        maxWidth: '72rem',
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        pt: { xs: 3, sm: 4 },
      }}
    >
      {children}
    </Box>
  );
}

export default PageTopBar;
