import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import TileCard from '../ui/TileCard';

interface StatTileProps {
  label: string;
  value: number;
  icon?: ReactNode;
  to: string;
}

function StatTile({ label, value, icon, to }: StatTileProps) {
  return (
    <TileCard
      to={to}
      affordanceSize={28}
      affordanceOffset={12}
      affordanceIconSize={14}
      cardSx={{ flex: 1, height: 'auto', width: 'auto' }}
      contentSx={{ flex: 'unset', display: 'block', p: { xs: 2, sm: 2.5 } }}
    >
      <Stack spacing={1.2}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.5 }}>
            {label}
          </Typography>
          {icon && <Box sx={{ color: 'secondary.main', display: 'flex' }}>{icon}</Box>}
        </Stack>
        <Typography sx={{ fontSize: { xs: '2rem', sm: '2.5rem' }, fontWeight: 600, lineHeight: 1 }}>
          {value}
        </Typography>
      </Stack>
    </TileCard>
  );
}

export default StatTile;
