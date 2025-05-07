import { createContext, useCallback, useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from './useLocalStorage'
import { lookerConfig } from '../lookerConfig'
const AuthContext = createContext()

/**
 * Auth Context provider.
 *
 * Can use to access:
 * - user: current user (JWT from Google Auth) stored in local storage
 * - login: to save a given user in local storage
 * - logout: to remove the current user and redirect to login page
 */
export const AuthProvider = ({ children }) => {
  const defaultUser = { name: 'John Doe', mocked: true }

  const [user, setUser] = useLocalStorage(
    'user',
    lookerConfig.gsiEnableAuth ? null : defaultUser
  )
  const navigate = useNavigate()

  const login = useCallback(
    async (data) => {
      // First, send Google data to your backend
      if (data && !data.mocked) {
        try {
          const response = await fetch('/api/set-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sub: data.sub,
              given_name: data.given_name,
              family_name: data.family_name,
            }),
          })
          
          if (!response.ok) {
            console.error('Failed to set user on backend')
          }
        } catch (error) {
          console.error('Error setting user on backend:', error)
        }
      }
      
      // Then continue with existing login flow
      setUser(data)
      navigate('/')
    },
    [setUser, navigate]
  )

  const logout = useCallback(() => {
    setUser(null)
    navigate('/login', { replace: true })
  }, [setUser, navigate])

  const value = useMemo(
    () => ({
      user,
      login,
      logout
    }),
    [user, login, logout]
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Expose AuthContext
 */
export const useAuth = () => {
  return useContext(AuthContext)
}
