import { Link } from 'react-router-dom'
import { Bus, User } from 'lucide-react'
import { useUser } from '../../contexts/UserContext'
import UserProfile from '../auth/UserProfile'

const Header = () => {
  const { user } = useUser()

  return (
    <header className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Bus className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">BusExpress</span>
          </Link>

          {/* Company Name - Empty for Master Admin */}
          <div className="flex-1 text-center">
            {user && user.role !== 'master-admin' && user.company && (
              <h1 className="text-lg font-semibold text-gray-800">
                {user.company}
              </h1>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* User Role Badge */}
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {user.role === 'master-admin' ? 'Master Admin' :
                   user.role === 'bus-owner' ? 'Bus Owner' :
                   user.role === 'bus-admin' ? 'Bus Admin' :
                   user.role === 'booking-man' ? 'Booking Manager' :
                   user.role === 'bus-employee' ? 'Bus Employee' :
                   user.role === 'customer' ? 'Customer' : user.role}
                </div>
                <UserProfile />
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
