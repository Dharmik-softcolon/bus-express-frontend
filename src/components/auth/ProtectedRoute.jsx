import { useUser } from '../../contexts/UserContext'
import { Navigate, useLocation } from 'react-router-dom'
import { canAccessRoute, getDefaultRoute, PUBLIC_ROUTES } from '../../config/routes'

const ProtectedRoute = ({ children, requiredRoles = null, redirectTo = null }) => {
  const { user, loading } = useUser()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // If no user, redirect to login
  if (!user) {
    return <Navigate to={PUBLIC_ROUTES.LOGIN} state={{ from: location }} replace />
  }

  // Check if user can access this route
  const hasAccess = canAccessRoute(location.pathname, user.role)
  
  if (!hasAccess) {
    // If specific roles are required, check them
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-gray-500">
              Required roles: {requiredRoles.join(', ')}
            </p>
            <p className="text-sm text-gray-500">
              Your role: {user.role}
            </p>
            <button 
              onClick={() => window.history.back()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary"
            >
              Go Back
            </button>
          </div>
        </div>
      )
    }
    
    // Redirect to appropriate dashboard or specified route
    const redirectPath = redirectTo || getDefaultRoute(user.role)
    return <Navigate to={redirectPath} replace />
  }

  return children
}

export default ProtectedRoute

