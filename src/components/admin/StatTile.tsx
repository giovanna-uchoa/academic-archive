import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { getContentPalette } from '../../theme/muiTheme';

interface StatTileProps {
  label: string;
  value: number;
  icon?: ReactNode;
  to: string;
}

function StatTile({ label, value, icon, to }: StatTileProps) {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      sx={{
        position: 'relative',
        borderColor: 'divider',
        flex: 1,
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: getContentPalette(theme.palette.mode).elevatedShadow,
        },
        '&:hover .card-open-affordance': {
          opacity: 1,
          transform: 'scale(1)',
        },
      }}
    >
      <CardActionArea component={RouterLink} to={to} sx={{ height: '100%' }}>
        <CardContent sx={{ flex: 1, p: { xs: 2, sm: 2.5 } }}>
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
        </CardContent>
      </CardActionArea>

      <Box
        className="card-open-affordance"
        sx={{
          position: 'absolute',
          right: 12,
          bottom: 12,
          width: 28,
          height: 28,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          opacity: 0,
          transform: 'scale(0.8)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          pointerEvents: 'none',
        }}
      >
        <ArrowUpRight size={14} />
      </Box>
    </Card>
  );
}

export default StatTile;
