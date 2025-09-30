import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import { Eye, EyeOff, User, Lock, Bus } from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
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

    const result = await login(formData.username, formData.password)
    
    if (result.success) {
      // Redirect to appropriate dashboard
      const dashboardRoutes = {
        'master-admin': '/admin/master',
        'bus-owner': '/admin/bus-owner',
        'bus-admin': '/admin',
        'booking-man': '/admin/booking-men',
        'bus-employee': '/admin/employee',
        'customer': '/'
      }
      
      const redirectTo = dashboardRoutes[result.user.role] || '/'
      navigate(redirectTo)
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const demoAccounts = [
    { username: 'master', password: 'admin123', role: 'Master Admin' },
    { username: 'owner1', password: 'owner123', role: 'Bus Owner' },
    { username: 'admin1', password: 'admin123', role: 'Bus Admin' },
    { username: 'booking1', password: 'booking123', role: 'Booking Man' },
    { username: 'driver1', password: 'driver123', role: 'Bus Employee' },
    { username: 'customer1', password: 'customer123', role: 'Customer' }
  ]

  const fillDemoAccount = (account) => {
    setFormData({
      username: account.username,
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
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="Enter your username"
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

          {/* Demo Accounts */}
          <div className="mt-6 sm:mt-8">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Demo Accounts (Click to fill)</h3>
            <div className="space-y-2">
              {demoAccounts.map((account, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => fillDemoAccount(account)}
                  className="w-full text-left p-2 text-xs sm:text-sm bg-gray-50 hover:bg-gray-100 rounded border transition-colors"
                >
                  <span className="font-medium">{account.role}</span>
                  <br />
                  <span className="text-gray-600 break-all">{account.username} / {account.password}</span>
                </button>
              ))}
            </div>
          </div>

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

