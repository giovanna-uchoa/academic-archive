import { ThemeOptions } from '@mui/material/styles';

export const headingFont = ['"Fraunces"', '"Palatino Linotype"', '"Book Antiqua"', 'Palatino', 'serif'].join(',');
const bodyFont = ['"Inter"', '"Segoe UI"', '"Helvetica Neue"', 'sans-serif'].join(',');

export interface ContentPalette {
  markdownCodeBackground: string;
  markdownCodeText: string;
  markdownBlockquoteBorder: string;
  markdownBlockquoteBackground: string;
  elevatedShadow: string;
}

export function getContentPalette(mode: 'light' | 'dark'): ContentPalette {
  if (mode === 'dark') {
    return {
      markdownCodeBackground: '#211c14',
      markdownCodeText: '#ece4d0',
      markdownBlockquoteBorder: '#e0a94a',
      markdownBlockquoteBackground: '#18140f',
      elevatedShadow: '0 18px 32px rgba(0,0,0,0.36)',
    };
  }

  return {
    markdownCodeBackground: '#e9e2cd',
    markdownCodeText: '#1c2c22',
    markdownBlockquoteBorder: '#b8863b',
    markdownBlockquoteBackground: '#faf6ec',
    elevatedShadow: '0 18px 32px rgba(31,58,46,0.12)',
  };
}

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
    fontSize: '1.75rem',
    '@media (min-width:600px)': { fontSize: '2.25rem' },
    '@media (min-width:900px)': { fontSize: '2.75rem' },
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
  const darkBorder = '#2e2820';
  const darkHover = '#e0a94a';
  const content = getContentPalette(mode);

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
          border: `1px solid ${isLight ? '#ddd3ba' : darkBorder}`,
          boxShadow: 'none',
          transition: 'border-color 0.2s ease, transform 0.2s ease',
          '&:hover': {
            borderColor: isLight ? '#b8863b' : darkHover,
            transform: 'translateY(-4px)',
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
      main: '#1f3a2e',
      light: '#3f5d4d',
      dark: '#0f2019',
      contrastText: '#faf6ec',
    },
    secondary: {
      main: '#b8863b',
      light: '#d1a862',
      dark: '#8f6526',
      contrastText: '#1c1610',
    },
    background: {
      default: '#f2ebda',
      paper: '#faf6ec',
    },
    text: {
      primary: '#1c2c22',
      secondary: '#5c6659',
      disabled: '#96a08f',
    },
    divider: '#ddd3ba',
    mode: 'light',
  },
  typography: sharedTypography,
  components: sharedComponents('light'),
};

export const darkThemeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#ece4d0',
      light: '#faf6ec',
      dark: '#c2b8a3',
      contrastText: '#100e0b',
    },
    secondary: {
      main: '#e0a94a',
      light: '#eac47f',
      dark: '#a97d34',
      contrastText: '#100e0b',
    },
    background: {
      default: '#100e0b',
      paper: '#18140f',
    },
    text: {
      primary: '#ece4d0',
      secondary: '#a89e8c',
      disabled: '#665e50',
    },
    divider: '#2e2820',
    mode: 'dark',
  },
  typography: sharedTypography,
  components: sharedComponents('dark'),
};
