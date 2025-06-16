import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { theme } from './utils/theme';
import { msalConfig } from './utils/authConfig';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/LoginPage';
import { MainApp } from './pages/MainApp';

// Microsoft Authentication instance
const msalInstance = new PublicClientApplication(msalConfig);

// Ana uygulama mantığı
const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      {isAuthenticated ? <MainApp /> : <LoginPage />}
    </Router>
  );
};

// App wrapper (providers)
function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </MsalProvider>
  );
}

export default App
