import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import { Eye, EyeOff, User, Lock, Bus, Mail, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  
  const { login } = useUser()
  const navigate = useNavigate()

  // Load saved credentials on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail')
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }))
      setRememberMe(true)
    }
  }, [])

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Password validation
  const validatePassword = (password) => {
    return password.length >= 6
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear errors when user types
    setError('')
    if (name === 'email') {
      setEmailError('')
    } else if (name === 'password') {
      setPasswordError('')
    }
  }

  const handleEmailBlur = () => {
    if (formData.email && !validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }
  }

  const handlePasswordBlur = () => {
    if (formData.password && !validatePassword(formData.password)) {
      setPasswordError('Password must be at least 6 characters long')
    } else {
      setPasswordError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form before submission
    const isEmailValid = validateEmail(formData.email)
    const isPasswordValid = validatePassword(formData.password)
    
    if (!isEmailValid) {
      setEmailError('Please enter a valid email address')
    }
    if (!isPasswordValid) {
      setPasswordError('Password must be at least 6 characters long')
    }
    
    if (!isEmailValid || !isPasswordValid) {
      return
    }
    
    setLoading(true)
    setError('')
    setIsValidating(true)

    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        // Save email if remember me is checked
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email)
        } else {
          localStorage.removeItem('rememberedEmail')
        }
        
        // Redirect to appropriate dashboard based on role
        const dashboardRoutes = {
          'MASTER_ADMIN': '/master-admin',
          'BUS_OWNER': '/bus-owner',
          'BUS_ADMIN': '/bus-admin',
          'BOOKING_MAN': '/booking-man',
          'BUS_EMPLOYEE': '/bus-employee',
        }
        
        const redirectTo = dashboardRoutes[result.user.role] || '/'
        navigate(redirectTo)
      } else {
        setError(result.error || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
      setIsValidating(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>
      
      <div className="max-w-md w-full space-y-6 sm:space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
              <Bus className="h-12 w-12 sm:h-16 sm:w-16 text-text relative z-10 animate-bounce-gentle" />
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text mb-2">
            SafeRun
          </h2>
          <p className="text-text/80 text-sm sm:text-base">
            Welcome back! Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-background/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-background/20 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-error/5 border border-error/20 text-error px-4 py-3 rounded-lg flex items-center space-x-2 animate-fade-in">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-label">
                Email Address
              </label>
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mt-1">
                  <Mail className={`h-5 w-5 ${emailError ? 'text-error' : 'text-primary'}`} />
                </div>
                <div className="flex-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleEmailBlur}
                    className={`input-field ${
                      emailError 
                        ? 'border-error bg-error/5 focus:border-error' 
                        : 'border-border bg-background focus:border-primary'
                    }`}
                    placeholder="Enter your email address"
                    aria-describedby={emailError ? "email-error" : undefined}
                  />
                  {formData.email && !emailError && validateEmail(formData.email) && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                  )}
                </div>
              </div>
              {emailError && (
                <p id="email-error" className="text-error text-xs flex items-center space-x-1 font-medium">
                  <AlertCircle className="h-3 w-3" />
                  <span>{emailError}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-label">
                Password
              </label>
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mt-1">
                  <Lock className={`h-5 w-5 ${passwordError ? 'text-error' : 'text-primary'}`} />
                </div>
                <div className="flex-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handlePasswordBlur}
                    className={`input-field ${
                      passwordError 
                        ? 'border-error bg-error/5 focus:border-error' 
                        : 'border-border bg-background focus:border-primary'
                    }`}
                    placeholder="Enter your password"
                    aria-describedby={passwordError ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-hover-light rounded-lg transition-colors duration-200 p-1"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-text-light hover:text-text-dark" />
                    ) : (
                      <Eye className="h-5 w-5 text-text-light hover:text-text-dark" />
                    )}
                  </button>
                </div>
              </div>
              {passwordError && (
                <p id="password-error" className="text-error text-xs flex items-center space-x-1 font-medium">
                  <AlertCircle className="h-3 w-3" />
                  <span>{passwordError}</span>
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-body-small">Remember me</span>
              </label>
              <button
                type="button"
                className="text-body-small text-primary hover:text-primary/80 font-semibold transition-colors duration-200"
                onClick={() => {/* TODO: Implement forgot password */}}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isValidating}
              className="btn-primary w-full"
            >
              {loading || isValidating ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{isValidating ? 'Validating...' : 'Signing in...'}</span>
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
              className="text-text-light hover:text-primary text-body-small font-semibold transition-colors duration-200 flex items-center justify-center space-x-1"
            >
              <span>←</span>
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

