import { useAuth0 } from '@auth0/auth0-react'

export const useAuth = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    loginWithRedirect, 
    logout: auth0Logout 
  } = useAuth0()

  const login = () => {
    loginWithRedirect()
  }

  const logout = () => {
    auth0Logout({ 
      logoutParams: { 
        returnTo: window.location.origin 
      } 
    })
  }

  return {
    user: isAuthenticated ? {
      name: user?.name,
      username: user?.email,
      email: user?.email
    } : null,
    isAuthenticated,
    isLoading,
    login,
    logout
  }
} 