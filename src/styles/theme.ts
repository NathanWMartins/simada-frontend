import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#212121',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dedede',
      contrastText: '#000000',
    },
    background: {
      default: '#f7f7f7ff',
      paper: '#ffffff',
    },
    text: {
      primary: '#4D4D4D',
      secondary: '#444444',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 14,
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      contrastText: '#000000',
    },
    secondary: {
      main: '#f48fb1',
      contrastText: '#ffffff',
    },
    background: {
      default: '#383838',
      paper: '#0d0d0dff',
    },
    text: {
      primary: '#ffffff',
      secondary: '#bbbbbb',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 14,
  },
});
