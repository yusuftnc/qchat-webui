import { Button } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

export const LoginButton = () => {
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login hatası:', error);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={handleLogin}
      sx={{
        minWidth: 200,
        py: 1.5,
      }}
    >
      Giriş Yap
    </Button>
  );
}; 