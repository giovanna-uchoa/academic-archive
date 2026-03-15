import { ArrowLeft } from 'lucide-react';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

interface BackButtonProps {
  label?: string;
  onClick: () => void;
}

function BackButton({ label = 'Back', onClick }: BackButtonProps) {
  const theme = useTheme();

  return (
    <Button
      startIcon={<ArrowLeft size={18} />}
      onClick={onClick}
      sx={{
        textTransform: 'none',
        color: theme.palette.text.secondary,
        '&:hover': {
          color: theme.palette.primary.main,
        },
      }}
    >
      {label}
    </Button>
  );
}

export default BackButton;