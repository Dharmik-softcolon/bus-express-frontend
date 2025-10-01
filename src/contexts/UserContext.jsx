import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import config from '../config/config'

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
    
    // Public routes
    const publicRoutes = [config.ROUTES.HOME, config.ROUTES.SEARCH, config.ROUTES.SEATS, config.ROUTES.CONFIRMATION]
    if (publicRoutes.includes(path)) return true
    
    // Role-based access
    const roleRoutes = {
      [config.ROLES.MASTER_ADMIN]: [config.ROUTES.ADMIN, config.ROUTES.ADMIN_MASTER, config.ROUTES.ADMIN_BUS_OWNER, config.ROUTES.ADMIN_EMPLOYEE, config.ROUTES.ADMIN_ROLES],
      [config.ROLES.BUS_OWNER]: [config.ROUTES.ADMIN, config.ROUTES.ADMIN_BUS_OWNER, config.ROUTES.ADMIN_EMPLOYEE],
      [config.ROLES.BUS_ADMIN]: [config.ROUTES.ADMIN, config.ROUTES.ADMIN_BUSES, config.ROUTES.ADMIN_TRIPS, config.ROUTES.ADMIN_BOOKING_MEN, config.ROUTES.ADMIN_ROUTES, config.ROUTES.ADMIN_USERS, config.ROUTES.ADMIN_SETTINGS],
      [config.ROLES.BOOKING_MAN]: [config.ROUTES.ADMIN, config.ROUTES.ADMIN_BOOKING_MEN],
      [config.ROLES.BUS_EMPLOYEE]: [config.ROUTES.ADMIN, config.ROUTES.ADMIN_EMPLOYEE],
      [config.ROLES.CUSTOMER]: [config.ROUTES.HOME]
    }
    
    const allowedRoutes = roleRoutes[user.role] || []
    return allowedRoutes.some(route => path.startsWith(route))
  }

  const getDashboardRoute = () => {
    if (!user) return config.ROUTES.HOME
    
    return config.DASHBOARD_ROUTES[user.role] || config.ROUTES.HOME
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
