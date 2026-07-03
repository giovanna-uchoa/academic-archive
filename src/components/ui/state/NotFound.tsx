import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

interface NotFoundProps {
  title?: string;
  backLabel?: string;
}

function NotFound({
  title = 'Content not found',
  backLabel = 'Go Back',
}: NotFoundProps) {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      component="main"
      sx={{
        maxWidth: '56rem',
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        py: 8,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h3"
        sx={{
          mb: 2,
          color: theme.palette.primary.main,
          fontSize: '2rem',
        }}
      >
        {title}
      </Typography>

      <Button
        startIcon={<ArrowLeft size={18} />}
        onClick={() => navigate(-1)}
      >
        {backLabel}
      </Button>
    </Box>
  );
}

export default NotFound;