import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { MonthlyActivityPoint } from '../../utils/contentTaxonomy';

interface MonthlyActivityChartProps {
  data: MonthlyActivityPoint[];
}

const TRACK_HEIGHT = 96;
const VALUE_LABEL_HEIGHT = 18;
const BAR_WIDTH = 20;

function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleString(undefined, { month: 'long', year: 'numeric' });
}

function monthShortLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleString(undefined, { month: 'short' });
}

function MonthlyActivityChart({ data }: MonthlyActivityChartProps) {
  const theme = useTheme();
  const maxCount = Math.max(1, ...data.map((point) => point.count));
  const peakIndex = data.reduce(
    (best, point, index) => (point.count > data[best].count ? index : best),
    0
  );
  const now = new Date();
  const currentKey = `${now.getFullYear()}-${now.getMonth()}`;

  return (
    <Stack spacing={0.5}>
      <Typography variant="subtitle2" color="text.secondary">
        Posts by month
      </Typography>

      <Stack direction="row" alignItems="flex-end" sx={{ height: TRACK_HEIGHT }}>
        {data.map((point, index) => {
          const key = `${point.year}-${point.month}`;
          const isPeak = index === peakIndex && point.count > 0;
          const isCurrent = key === currentKey;
          const showValue = isPeak || isCurrent;
          const barHeight = Math.max(2, (point.count / maxCount) * (TRACK_HEIGHT - VALUE_LABEL_HEIGHT));

          return (
            <Tooltip
              key={key}
              title={`${monthLabel(point.year, point.month)}: ${point.count} post${point.count === 1 ? '' : 's'}`}
            >
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <Box sx={{ height: VALUE_LABEL_HEIGHT, display: 'flex', alignItems: 'flex-end' }}>
                  {showValue && (
                    <Typography variant="caption" color="text.secondary">
                      {point.count}
                    </Typography>
                  )}
                </Box>
                <Box
                  sx={{
                    width: BAR_WIDTH,
                    maxWidth: '80%',
                    height: barHeight,
                    backgroundColor: theme.palette.secondary.main,
                    borderRadius: '4px 4px 0 0',
                    opacity: isCurrent ? 1 : 0.7,
                  }}
                />
              </Box>
            </Tooltip>
          );
        })}
      </Stack>

      <Stack direction="row" sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
        {data.map((point) => (
          <Box key={`${point.year}-${point.month}`} sx={{ flex: 1, minWidth: 0, textAlign: 'center', pt: 0.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
              {monthShortLabel(point.year, point.month)}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}

export default MonthlyActivityChart;
