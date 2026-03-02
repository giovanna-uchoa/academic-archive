import { createTheme, ThemeOptions } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#3d2817', // Dark brown (light mode primary)
      light: '#826b5a', // Medium brown
      dark: '#2a1f1a', // Darker brown
      contrastText: '#f5e6d3', // Light tan
    },
    secondary: {
      main: '#8b6f47', // Tan/gold accent
      light: '#c4a57b', // Light gold for dark mode
      dark: '#6b5444', // Darker tan
      contrastText: '#fff',
    },
    background: {
      default: '#faf8f5', // Light background
      paper: '#fff', // Card/paper background
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#f57c00',
    },
    info: {
      main: '#1976d2',
    },
    success: {
      main: '#388e3c',
    },
    text: {
      primary: '#3d2817',
      secondary: '#826b5a',
      disabled: '#b89968',
    },
    divider: '#e8ddd0',
    mode: 'light',
  },
  typography: {
    fontFamily: [
      'ui-sans-serif',
      'system-ui',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Noto Color Emoji"',
    ].join(','),
    h1: {
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.111,
      color: '#3d2817',
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.2,
      color: '#3d2817',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.333,
      color: '#3d2817',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#3d2817',
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.556,
      color: '#3d2817',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#3d2817',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#826b5a',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.25,
      color: '#826b5a',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          backgroundColor: '#8b6f47',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#6b5444',
          },
        },
        outlined: {
          borderColor: '#d4c4b0',
          color: '#6b5444',
          '&:hover': {
            backgroundColor: '#f4ede4',
            borderColor: '#c4a57b',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          borderColor: '#e8ddd0',
          border: '1px solid #e8ddd0',
          borderRadius: '0.5rem',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: '#8b6f47',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          borderColor: '#e8ddd0',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#e8ddd0',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        standard: {
          backgroundColor: '#f4ede4',
          color: '#6b5444',
        },
      },
    },
  },
};

export const darkThemeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#f5e6d3', // Light tan (dark mode primary)
      light: '#c4a57b', // Light gold
      dark: '#3d2817', // Dark brown
      contrastText: '#1a1310',
    },
    secondary: {
      main: '#c4a57b', // Light gold accent
      light: '#f5e6d3', // Light tan
      dark: '#8b6f47', // Darker gold
      contrastText: '#1a1310',
    },
    background: {
      default: '#1a1310', // Dark background
      paper: '#2a1f1a', // Dark card background
    },
    error: {
      main: '#ff5252',
    },
    warning: {
      main: '#ffb74d',
    },
    info: {
      main: '#42a5f5',
    },
    success: {
      main: '#66bb6a',
    },
    text: {
      primary: '#f5e6d3',
      secondary: '#b89968',
      disabled: '#826b5a',
    },
    divider: '#3d2f26',
    mode: 'dark',
  },
  typography: {
    fontFamily: [
      'ui-sans-serif',
      'system-ui',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      '"Noto Color Emoji"',
    ].join(','),
    h1: {
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.111,
      color: '#f5e6d3',
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.2,
      color: '#f5e6d3',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.333,
      color: '#f5e6d3',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#f5e6d3',
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.556,
      color: '#f5e6d3',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#f5e6d3',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#b89968',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.25,
      color: '#b89968',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          backgroundColor: '#c4a57b',
          color: '#1a1310',
          '&:hover': {
            backgroundColor: '#f5e6d3',
          },
        },
        outlined: {
          borderColor: '#4a3a2e',
          color: '#c4a57b',
          '&:hover': {
            backgroundColor: '#3d2f26',
            borderColor: '#8b6f47',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#2a1f1a',
          borderColor: '#3d2f26',
          border: '1px solid #3d2f26',
          borderRadius: '0.5rem',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: '#c4a57b',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#2a1f1a',
          borderColor: '#3d2f26',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#3d2f26',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        standard: {
          backgroundColor: '#3d2f26',
          color: '#c4a57b',
        },
      },
    },
  },
};
