import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { loginRequest } from '../utils/authConfig';
import { setAuthToken, removeAuthToken } from '../services/api';

export const useAuth = () => {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();

  // Login fonksiyonu
  const login = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);
      console.log('Login başarılı:', response);
      
      // API için token'ı ayarla
      if (response.accessToken) {
        setAuthToken(response.accessToken);
      }
      
      return response;
    } catch (error) {
      console.error('Login hatası:', error);
      throw error;
    }
  };

  // Logout fonksiyonu
  const logout = () => {
    removeAuthToken();
    instance.logoutPopup();
  };

  // Kullanıcı bilgileri
  const user = accounts[0] || null;

  return {
    isAuthenticated,
    login,
    logout,
    user,
  };
}; 