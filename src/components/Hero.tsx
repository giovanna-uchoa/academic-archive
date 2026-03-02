import { Coffee, Code2 } from 'lucide-react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';

export function Hero() {
  const theme = useTheme();

  return (
    <Box
      component="section"
      id="about"
      sx={{
        maxWidth: '1200px',
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        py: { xs: 6, sm: 8, md: 10 },
      }}
    >
      <Stack spacing={{ xs: 2, sm: 3 }}>
        <Chip
          icon={<Coffee size={16} />}
          label="Available for interesting projects"
          sx={{
            width: 'fit-content',
            backgroundColor: theme.palette.mode === 'light' ? '#f4ede4' : '#3d2f26',
            color: theme.palette.text.secondary,
            borderColor: theme.palette.divider,
          }}
          variant="outlined"
        />

        <Typography
          component="h1"
          variant="h1"
          sx={{
            fontSize: { xs: '1.875rem', sm: '2.25rem', md: '3rem' },
          }}
        >
          Hi, I'm {' '}
          <Box
            component="span"
            sx={{
              color: theme.palette.secondary.main,
            }}
          >
            Your Name
          </Box>
        </Typography>

        <Typography
          variant="h5"
          sx={{
            color: theme.palette.text.secondary,
            maxWidth: '42rem',
          }}
        >
          IT Professional & Technology Enthusiast
        </Typography>

        <Typography
          variant="body1"
          sx={{
            maxWidth: '42rem',
            lineHeight: 1.625,
          }}
        >
          I work in IT and love experimenting with new technologies, tools, and solutions.
          This is my space where I document what I learn, share tutorials, and write about
          the things I try and test almost weekly. If you're exploring similar technologies
          or looking for practical insights, you might find something useful here.
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ pt: 2 }}
        >
          <Button
            variant="contained"
            href="#subjects"
            startIcon={<Code2 size={18} />}
            sx={{
              px: 3,
              py: 1.5,
            }}
          >
            Explore Subjects
          </Button>
          <Button
            variant="outlined"
            href="mailto:your@email.com"
            sx={{
              px: 3,
              py: 1.5,
            }}
          >
            Get in Touch
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
