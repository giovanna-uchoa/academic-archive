import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface AdminListItemProps {
  eyebrow?: ReactNode;
  icon?: ReactNode;
  title: string;
  meta?: ReactNode;
  actions?: ReactNode;
}

function AdminListItem({ eyebrow, icon, title, meta, actions }: AdminListItemProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={1}
      >
        <Box>
          {eyebrow && (
            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.5, display: 'block' }}>
              {eyebrow}
            </Typography>
          )}
          <Stack direction="row" spacing={1} alignItems="center">
            {icon}
            <Typography fontWeight={600}>{title}</Typography>
          </Stack>
          {meta}
        </Box>
        {actions && (
          <Stack direction="row" spacing={1}>
            {actions}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

export default AdminListItem;
