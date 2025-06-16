import { createTheme } from '@mui/material/styles';

// Material-UI tema konfigürasyonu
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Microsoft mavi tonları
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e', // Microsoft kırmızısı
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      'Segoe UI',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    // Button özelleştirmeleri
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none', // Büyük harf yapmaz
          fontWeight: 500,
        },
      },
    },
    // TextField özelleştirmeleri
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    // Paper özelleştirmeleri
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
}); 