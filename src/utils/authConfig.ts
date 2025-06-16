import type { Configuration } from '@azure/msal-browser';

// Microsoft Entra ID konfigürasyonu
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID, // Buraya Azure'dan alacağın Client ID
    authority: "https://login.microsoftonline.com/common", // Multi-tenant için
    redirectUri: "http://localhost:5173", // Vite dev server URL'i
  },
  cache: {
    cacheLocation: "localStorage", // sessionStorage veya localStorage
    storeAuthStateInCookie: false, // IE11 desteği için true yapılabilir
  },
};

// API istekleri için scope'lar
export const loginRequest = {
  scopes: ["User.Read"], // Microsoft Graph'tan kullanıcı bilgilerini okumak için
}; 