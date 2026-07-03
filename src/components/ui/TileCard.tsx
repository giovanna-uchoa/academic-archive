import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';

import { getContentPalette } from '../../theme/muiTheme';

interface TileCardProps {
  to: string;
  featured?: boolean;
  affordanceSize?: number;
  affordanceOffset?: number;
  affordanceIconSize?: number;
  cardSx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
  children: ReactNode;
}

function TileCard({
  to,
  featured = false,
  affordanceSize,
  affordanceOffset = 16,
  affordanceIconSize,
  cardSx,
  contentSx,
  children,
}: TileCardProps) {
  const theme = useTheme();
  const size = affordanceSize ?? (featured ? 40 : 32);
  const iconSize = affordanceIconSize ?? (featured ? 18 : 16);

  return (
    <Card
      variant="outlined"
      sx={{
        position: 'relative',
        borderColor: 'divider',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: getContentPalette(theme.palette.mode).elevatedShadow,
        },
        '&:hover .card-open-affordance': {
          opacity: 1,
          transform: 'scale(1)',
        },
        ...cardSx,
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={to}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <CardContent
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            p: featured ? { xs: 2.5, sm: 3.5 } : { xs: 2, sm: 2.5 },
            ...contentSx,
          }}
        >
          {children}
        </CardContent>
      </CardActionArea>

      <Box
        className="card-open-affordance"
        sx={{
          position: 'absolute',
          right: affordanceOffset,
          bottom: affordanceOffset,
          width: size,
          height: size,
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
        <ArrowUpRight size={iconSize} />
      </Box>
    </Card>
  );
}

export default TileCard;
