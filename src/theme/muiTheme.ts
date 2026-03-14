import { ThemeOptions } from '@mui/material/styles';

const headingFont = ['"Spectral"', '"Palatino Linotype"', '"Book Antiqua"', 'Palatino', 'serif'].join(',');
const bodyFont = ['"Avenir Next"', '"Segoe UI"', '"Helvetica Neue"', 'sans-serif'].join(',');

const sharedTypography: ThemeOptions['typography'] = {
  fontFamily: bodyFont,
  h1: {
    fontFamily: headingFont,
    fontWeight: 600,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontFamily: headingFont,
    fontWeight: 600,
    lineHeight: 1.16,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontFamily: headingFont,
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h4: {
    fontFamily: headingFont,
    fontWeight: 600,
    lineHeight: 1.25,
  },
  h5: {
    fontFamily: headingFont,
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h6: {
    fontFamily: headingFont,
    fontWeight: 600,
    lineHeight: 1.35,
  },
  body1: {
    lineHeight: 1.7,
  },
  body2: {
    lineHeight: 1.55,
  },
  overline: {
    fontWeight: 600,
    letterSpacing: '0.12em',
  },
  button: {
    textTransform: 'none',
    fontWeight: 500,
  },
};

function sharedComponents(mode: 'light' | 'dark'): ThemeOptions['components'] {
  const isLight = mode === 'light';
  const darkBorder = '#2b3847';
  const darkHover = '#d39a5f';

  return {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          border: `1px solid ${isLight ? '#e6dbc9' : darkBorder}`,
          boxShadow: 'none',
          transition: 'border-color 0.2s ease, transform 0.2s ease',
          '&:hover': {
            borderColor: isLight ? '#b08a5a' : darkHover,
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 7,
        },
      },
    },
  };
}

export const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#2f2418',
      light: '#64513f',
      dark: '#1c140d',
      contrastText: '#fffefb',
    },
    secondary: {
      main: '#9f6a2f',
      light: '#d2a16d',
      dark: '#72491f',
      contrastText: '#fff',
    },
    background: {
      default: '#f7f3ec',
      paper: '#fffcf6',
    },
    text: {
      primary: '#33251a',
      secondary: '#6a5746',
      disabled: '#9e8c79',
    },
    divider: '#e6dbc9',
    mode: 'light',
  },
  typography: sharedTypography,
  components: sharedComponents('light'),
};

export const darkThemeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#dce8f4',
      light: '#f4f8fc',
      dark: '#8ea1b6',
      contrastText: '#0b121a',
    },
    secondary: {
      main: '#d39a5f',
      light: '#e8c29a',
      dark: '#b67839',
      contrastText: '#0b121a',
    },
    background: {
      default: '#0b121a',
      paper: '#111b26',
    },
    text: {
      primary: '#e8f1fb',
      secondary: '#a8bdd4',
      disabled: '#6e8399',
    },
    divider: '#2b3847',
    mode: 'dark',
  },
  typography: sharedTypography,
  components: sharedComponents('dark'),
};
