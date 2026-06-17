import { createTheme, type ThemeOptions } from '@mui/material/styles'

const baseTokens: ThemeOptions = {
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        * {
          -webkit-user-select: none;
          user-select: none;
        }
        input,
        textarea,
        [contenteditable="true"] {
          -webkit-user-select: text;
          user-select: text;
        }
      `,
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }) => ({
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, paddingInline: 20 },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small', variant: 'outlined' },
    },
    MuiSelect: {
      defaultProps: { size: 'small' },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6 },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRight: 'none' },
      },
    },
  },
}

export const lightTheme = createTheme({
  ...baseTokens,
  palette: {
    mode: 'light',
    primary: {
      main: '#1565C0',
      light: '#1E88E5',
      dark: '#0D47A1',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#00897B',
      light: '#26A69A',
      dark: '#00695C',
      contrastText: '#FFFFFF',
    },
    error: { main: '#C62828' },
    warning: { main: '#EF6C00' },
    success: { main: '#2E7D32' },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    divider: '#E0E3E7',
  },
})

export const darkTheme = createTheme({
  ...baseTokens,
  palette: {
    mode: 'dark',
    primary: {
      main: '#42A5F5',
      light: '#90CAF9',
      dark: '#1565C0',
      contrastText: '#000000',
    },
    secondary: {
      main: '#26A69A',
      light: '#80CBC4',
      dark: '#00897B',
      contrastText: '#000000',
    },
    error: { main: '#EF5350' },
    warning: { main: '#FFA726' },
    success: { main: '#66BB6A' },
    background: {
      default: '#0F1217',
      paper: '#1A1F2B',
    },
    divider: '#2A3040',
  },
})
