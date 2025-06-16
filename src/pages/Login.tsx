import { Box, Button, Typography, Container, Paper } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
  const { login, isLoading } = useAuth();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
            width: '100%'
          }}
        >
          {/* Logo */}
          <Box sx={{ mb: 3 }}>
            <img src="/qchat-logo.svg" alt="QChat" width="64" height="64" />
          </Box>

          {/* Title */}
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            QChat'e Hoş Geldin
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            AI destekli sohbet ve soru-cevap platformu
          </Typography>

          {/* Login Button */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={login}
            disabled={isLoading}
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 2
            }}
          >
            {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
            Google, Microsoft veya email ile giriş yapabilirsiniz
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}; 