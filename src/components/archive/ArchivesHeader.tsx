import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function ArchivesHeader() {
  return (
    <Box>
      <Typography variant="overline" sx={{ letterSpacing: 2 }}>
        Archives
      </Typography>

      <Typography variant="h3" sx={{ mb: 1 }}>
        Timeline by Date
      </Typography>

      <Typography variant="body1" color="text.secondary">
        Browse content through a chronological timeline organized by month and year.
      </Typography>
    </Box>
  );
}

export default ArchivesHeader;
