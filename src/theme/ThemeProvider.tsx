import { ReactNode, useMemo, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { themeOptions, darkThemeOptions } from './muiTheme';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  // Check for saved theme preference or system preference on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as 'light' | 'dark' | null;
    
    if (savedMode) {
      setMode(savedMode);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setMode('dark');
    }

    // Listen to theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setMode(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const theme = useMemo(() => {
    const options = mode === 'dark' ? darkThemeOptions : themeOptions;
    return createTheme(options);
  }, [mode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize styles */}
      {children}
    </MuiThemeProvider>
  );
}

export { useThemeMode };

function useThemeMode() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as 'light' | 'dark' | null;
    setMode(savedMode || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  }, []);

  const toggleTheme = () => {
    setMode(prev => {
      const newMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-mode', newMode);
      return newMode;
    });
  };

  return { mode, toggleTheme };
}
