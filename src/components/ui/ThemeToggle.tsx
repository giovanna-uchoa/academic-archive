import Box from '@mui/material/Box';
import { Contrast } from 'lucide-react';
import { useThemeMode } from '../../theme/ThemeProvider';

function ThemeToggle() {
  const { mode, toggleTheme } = useThemeMode();
  const isDark = mode === 'dark';

  const rotation = isDark ? 'rotate(0deg)' : 'rotate(180deg)';

  return (
    <Box
      component="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      sx={(theme) => ({
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 34,
        height: 34,
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        p: 0,
        flexShrink: 0,

        backgroundColor: isDark
          ? theme.palette.background.paper
          : `transparent`,

        color: theme.palette.text.secondary,
        transform: rotation,
        willChange: 'transform',

        transition: `
          background-color 0.2s ease,
          color 0.2s ease,
          transform 0.35s cubic-bezier(.4,0,.2,1)
        `,

        outline: 'none',

        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },

        '&:active': {
          transform: `${rotation} scale(0.9)`,
        },

        '&:focus-visible': {
          boxShadow: `0 0 0 2px ${
            isDark
              ? theme.palette.primary.main
              : theme.palette.secondary.main
          }`,
        },
      })}
    >
      <Contrast size={16} strokeWidth={2} />
    </Box>
  );
}

export default ThemeToggle;