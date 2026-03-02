import { Heart, Terminal } from 'lucide-react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

export function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        mt: 'auto',
      }}
    >
      <Container maxWidth="md" sx={{ py: { xs: 3, sm: 6 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Terminal size={16} />
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              yourname.dev
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', color: theme.palette.text.secondary }}
          >
            <Typography variant="body2">Built with</Typography>
            <Heart
              size={16}
              style={{
                fill: theme.palette.secondary.main,
                color: theme.palette.secondary.main,
              }}
            />
            <Typography variant="body2">and lots of coffee</Typography>
          </Stack>

          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            © 2025 All rights reserved
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
