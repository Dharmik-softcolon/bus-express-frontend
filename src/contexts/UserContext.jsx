import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

// Mock user database
const mockUsers = [
  {
    id: 1,
    username: 'master',
    password: 'admin123',
    name: 'Master Admin',
    email: 'master@busexpress.com',
    phone: '+91 9876543210',
    role: 'master-admin',
    company: 'BusExpress Platform',
    aadhaarCard: '1234-5678-9012',
    drivingLicense: null,
    position: 'Master Administrator',
    address: 'Mumbai, Maharashtra',
    joinDate: '2023-01-01'
  },
  {
    id: 2,
    username: 'owner1',
    password: 'owner123',
    name: 'John Smith',
    email: 'john@abctransport.com',
    phone: '+91 9876543211',
    role: 'bus-owner',
    company: 'ABC Transport Company',
    aadhaarCard: '2345-6789-0123',
    drivingLicense: null,
    position: 'Owner',
    address: 'Pune, Maharashtra',
    joinDate: '2023-02-01'
  },
  {
    id: 3,
    username: 'admin1',
    password: 'admin123',
    name: 'Alice Johnson',
    email: 'alice@abctransport.com',
    phone: '+91 9876543212',
    role: 'bus-admin',
    company: 'ABC Transport Company',
    aadhaarCard: '3456-7890-1234',
    drivingLicense: null,
    position: 'Bus Administrator',
    address: 'Nashik, Maharashtra',
    joinDate: '2023-03-01'
  },
  {
    id: 4,
    username: 'booking1',
    password: 'booking123',
    name: 'Bob Wilson',
    email: 'bob@abctransport.com',
    phone: '+91 9876543213',
    role: 'booking-man',
    company: 'ABC Transport Company',
    aadhaarCard: '4567-8901-2345',
    drivingLicense: null,
    position: 'Booking Manager',
    address: 'Goa, Goa',
    joinDate: '2023-04-01'
  },
  {
    id: 5,
    username: 'driver1',
    password: 'driver123',
    name: 'Mike Johnson',
    email: 'mike@abctransport.com',
    phone: '+91 9876543214',
    role: 'bus-employee',
    company: 'ABC Transport Company',
    aadhaarCard: '5678-9012-3456',
    drivingLicense: 'DL-1234567890123',
    position: 'Driver',
    address: 'Mumbai, Maharashtra',
    joinDate: '2023-05-01',
    licenseExpiry: '2025-12-31',
    experience: '8 years'
  },
  {
    id: 6,
    username: 'conductor1',
    password: 'conductor123',
    name: 'Sarah Davis',
    email: 'sarah@abctransport.com',
    phone: '+91 9876543215',
    role: 'bus-employee',
    company: 'ABC Transport Company',
    aadhaarCard: '6789-0123-4567',
    drivingLicense: null,
    position: 'Conductor',
    address: 'Pune, Maharashtra',
    joinDate: '2023-06-01',
    experience: '5 years'
  },
  {
    id: 7,
    username: 'customer1',
    password: 'customer123',
    name: 'Jane Doe',
    email: 'jane@email.com',
    phone: '+91 9876543216',
    role: 'customer',
    company: null,
    aadhaarCard: '7890-1234-5678',
    drivingLicense: null,
    position: null,
    address: 'Mumbai, Maharashtra',
    joinDate: '2023-07-01'
  }
]

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('busexpress_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        localStorage.removeItem('busexpress_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    setLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const foundUser = mockUsers.find(u => u.username === username && u.password === password)
    
    if (foundUser) {
      const userData = { ...foundUser }
      delete userData.password // Don't store password
      
      setUser(userData)
      localStorage.setItem('busexpress_user', JSON.stringify(userData))
      setLoading(false)
      return { success: true, user: userData }
    } else {
      setLoading(false)
      return { success: false, error: 'Invalid username or password' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('busexpress_user')
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('busexpress_user', JSON.stringify(updatedUser))
  }

  const hasRole = (requiredRole) => {
    if (!user) return false
    
    const roleHierarchy = {
      'master-admin': 5,
      'bus-owner': 4,
      'bus-admin': 3,
      'booking-man': 2,
      'bus-employee': 1,
      'customer': 0
    }
    
    const userLevel = roleHierarchy[user.role] || 0
    const requiredLevel = roleHierarchy[requiredRole] || 0
    
    return userLevel >= requiredLevel
  }

  const canAccess = (path) => {
    if (!user) return false
    
    // Public routes
    const publicRoutes = ['/', '/search', '/seats', '/confirmation']
    if (publicRoutes.includes(path)) return true
    
    // Role-based access
    const roleRoutes = {
      'master-admin': ['/admin', '/admin/master', '/admin/bus-owner', '/admin/employee', '/admin/roles'],
      'bus-owner': ['/admin', '/admin/bus-owner', '/admin/employee'],
      'bus-admin': ['/admin', '/admin/buses', '/admin/trips', '/admin/booking-men', '/admin/routes', '/admin/users', '/admin/settings'],
      'booking-man': ['/admin', '/admin/booking-men'],
      'bus-employee': ['/admin', '/admin/employee'],
      'customer': ['/']
    }
    
    const allowedRoutes = roleRoutes[user.role] || []
    return allowedRoutes.some(route => path.startsWith(route))
  }

  const getDashboardRoute = () => {
    if (!user) return '/'
    
    const dashboardRoutes = {
      'master-admin': '/admin/master',
      'bus-owner': '/admin/bus-owner',
      'bus-admin': '/admin',
      'booking-man': '/admin/booking-men',
      'bus-employee': '/admin/employee',
      'customer': '/'
    }
    
    return dashboardRoutes[user.role] || '/'
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
