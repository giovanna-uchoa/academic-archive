import { Terminal } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

const appName = import.meta.env.VITE_APP_NAME ?? 'App';

interface LogoProps {
  onClick: () => void;
}

function Logo({ onClick }: LogoProps) {
    return (
      <Link
        component={RouterLink}
        to="/"
        underline="none"
        onClick={onClick}
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flex: 1,
          fontWeight: 600,
          letterSpacing: 0.5,
          color: theme.palette.primary.main,
          opacity: 0.9,
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          '&:hover': { opacity: 1, transform: 'translateY(-1px)' },
        })}
      >
        <Terminal size={20} />
        {appName}
      </Link>
    )
}

export default Logo;