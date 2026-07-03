import type { ReactNode } from 'react';
import Box from '@mui/material/Box';

interface FeaturedTileGridProps<T> {
  items: T[];
  keyFn: (item: T) => React.Key;
  renderItem: (item: T, featured: boolean) => ReactNode;
  columns: { xs?: string; sm?: string; md?: string };
  autoRows?: { xs?: string; sm?: string };
  featuredSpan?: { column?: number; row?: number };
}

function FeaturedTileGrid<T>({
  items,
  keyFn,
  renderItem,
  columns,
  autoRows,
  featuredSpan,
}: FeaturedTileGridProps<T>) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: columns,
        ...(autoRows ? { gridAutoRows: autoRows } : {}),
        gap: { xs: 2, sm: 3 },
        width: '100%',
      }}
    >
      {items.map((item, index) => {
        const featured = index === 0;
        const spanSx =
          featured && featuredSpan
            ? {
                ...(featuredSpan.column ? { gridColumn: { sm: `span ${featuredSpan.column}` } } : {}),
                ...(featuredSpan.row ? { gridRow: { sm: `span ${featuredSpan.row}` } } : {}),
              }
            : undefined;

        return (
          <Box key={keyFn(item)} sx={spanSx}>
            {renderItem(item, featured)}
          </Box>
        );
      })}
    </Box>
  );
}

export default FeaturedTileGrid;
