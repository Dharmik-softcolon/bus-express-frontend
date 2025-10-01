import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import { Eye, EyeOff, User, Lock, Bus } from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useUser()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('') // Clear error when user types
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      // Redirect to appropriate dashboard based on role
      const dashboardRoutes = {
        'MASTER_ADMIN': '/master-admin',
        'BUS_OWNER': '/bus-owner',
        'BUS_ADMIN': '/bus-admin',
        'BOOKING_MAN': '/booking-man',
        'BUS_EMPLOYEE': '/bus-employee',
        'CUSTOMER': '/customer'
      }
      
      const redirectTo = dashboardRoutes[result.user.role] || '/'
      navigate(redirectTo)
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const demoAccounts = [
    { email: 'dharmikghevariya08@gmail.com', password: 'Admin@1995', role: 'Master Admin' },
    { email: 'owner1@example.com', password: 'owner123', role: 'Bus Owner' },
    { email: 'admin1@example.com', password: 'admin123', role: 'Bus Admin' },
    { email: 'booking1@example.com', password: 'booking123', role: 'Booking Man' },
    { email: 'driver1@example.com', password: 'driver123', role: 'Bus Employee' },
    { email: 'customer1@example.com', password: 'customer123', role: 'Customer' }
  ]

  const fillDemoAccount = (account) => {
    setFormData({
      email: account.email,
      password: account.password
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <Bus className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
          </div>
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-bold text-white">
            BusExpress Login
          </h2>
          <p className="mt-2 text-blue-100 text-sm sm:text-base">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

