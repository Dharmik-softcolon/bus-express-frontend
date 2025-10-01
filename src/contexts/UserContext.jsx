import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import config from '../config/config'
import { canAccessRoute, getDefaultRoute, PUBLIC_ROUTES } from '../config/routes'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem(config.STORAGE.USER)
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem(config.STORAGE.USER)
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    
    try {
      const response = await authAPI.login({ email, password })
      
      if (response.success) {
        const userData = {
          ...response.data.user,
          token: response.data.token,
          refreshToken: response.data.refreshToken
        }
        
        setUser(userData)
        localStorage.setItem(config.STORAGE.USER, JSON.stringify(userData))
        setLoading(false)
        return { success: true, user: userData }
      } else {
        setLoading(false)
        return { success: false, error: response.message || config.ERRORS.UNAUTHORIZED }
      }
    } catch (error) {
      setLoading(false)
      return { success: false, error: error.message || config.ERRORS.NETWORK_ERROR }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(config.STORAGE.USER)
  }

  const updateUser = async (updates) => {
    try {
      const response = await authAPI.updateProfile(updates)
      
      if (response.success) {
        const updatedUser = { ...user, ...response.data }
        setUser(updatedUser)
        localStorage.setItem(config.STORAGE.USER, JSON.stringify(updatedUser))
        return { success: true, user: updatedUser }
      } else {
        return { success: false, error: response.message || config.ERRORS.SERVER_ERROR }
      }
    } catch (error) {
      return { success: false, error: error.message || config.ERRORS.NETWORK_ERROR }
    }
  }

  const hasRole = (requiredRole) => {
    if (!user) return false
    
    // Direct role match
    if (user.role === requiredRole) return true
    
    // Check if user's role can create the required role (hierarchy check)
    const userCanCreate = config.ROLE_HIERARCHY[user.role] || []
    return userCanCreate.includes(requiredRole)
  }

  const canAccess = (path) => {
    if (!user) return false
    return canAccessRoute(path, user.role)
  }

  const getDashboardRoute = () => {
    if (!user) return PUBLIC_ROUTES.HOME
    return getDefaultRoute(user.role)
  }

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    hasRole,
    canAccess,
    getDashboardRoute
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
