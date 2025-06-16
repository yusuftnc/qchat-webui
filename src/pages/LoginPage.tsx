import { Container, Box, Typography, Paper } from '@mui/material';
import { LoginButton } from '../components/LoginButton';

export const LoginPage = () => {
  return (
    <Container maxWidth="sm" sx={{
        margin: '0 auto',        // Container'ı yatay ortala
        px: 2,                   // Yan padding (mobil için)
        minHeight: '100vh',      // Tam yükseklik
      }}>
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
            width: '100%',
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            QChat
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            AI Destekli Soru & Cevap Platformu
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Hesabınızla giriş yapın ve AI modellerine sorular sorun
          </Typography>
          <LoginButton />
        </Paper>
      </Box>
    </Container>
  );
}; 