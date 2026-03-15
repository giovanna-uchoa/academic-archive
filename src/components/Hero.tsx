import { Link as RouterLink } from 'react-router-dom';
import { Archive, BookOpen, Hash } from 'lucide-react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

function Hero() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
      <Typography variant="overline" sx={{ letterSpacing: 2 }}>Academic Archive</Typography>
      <Typography variant="h2" sx={{ maxWidth: 760 }}>
        A living archive of studies, builds, and technical reflections.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
        Editorial structure inspired by knowledge blogs: browse by timeline,
        categories, and tags to quickly find each experiment.
      </Typography>

      <Box sx={{ pt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Chip component={RouterLink} to="/archives" clickable icon={<Archive size={14} />} label="Open archives" />
        <Chip component={RouterLink} to="/catalog" clickable icon={<BookOpen size={14} />} label="Browse catalog" />
        <Chip component={RouterLink} to="/tags" clickable icon={<Hash size={14} />} label="Explore tags" />
      </Box>
    </Box>
  );
}

export default Hero;