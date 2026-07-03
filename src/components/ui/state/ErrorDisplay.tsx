import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

interface ErrorDisplayProps {
  message: string;
}

function ErrorDisplay({ message }: ErrorDisplayProps) {
  return (
    <Box
      component="main"
      sx={{
        maxWidth: '56rem',
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        py: 6,
      }}
    >
      <Alert severity="error">{message}</Alert>
    </Box>
  );
}

export default ErrorDisplay;
